import os
import re
from typing import List, Optional
from datetime import datetime, timedelta

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from jose import JWTError, jwt
from passlib.context import CryptContext

# ----------------------------------------------------
# 1. APPLICATION & CORS SETUP
# ----------------------------------------------------
app = FastAPI(title="AI Resume Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------
# 2. CONFIGURATION & DATABASE DEFINITIONS
# ----------------------------------------------------
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "supersecretkey_dev_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/resume_db")
engine = create_engine(DATABASE_URL, connect_args={"connect_timeout": 10} if "postgresql" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ----------------------------------------------------
# 3. SQLALCHEMY MODELS
# ----------------------------------------------------
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="Standard User") // Admin, Standard User, Premium User
    date_joined = Column(DateTime, default=datetime.utcnow)

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=True) # S3/Cloudinary URL
    raw_text = Column(Text, nullable=False)
    ats_score = Column(Integer, default=0)
    parsed_json = Column(Text, nullable=True) # Full structured profile mapping
    created_at = Column(DateTime, default=datetime.utcnow)

class JobDescription(Base):
    __tablename__ = "job_descriptions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    description_text = Column(Text, nullable=False)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event = Column(String, nullable=False)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# ----------------------------------------------------
# 4. PYDANTIC SCHEMAS
# ----------------------------------------------------
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class JobCompareRequest(BaseModel):
    resume_id: int
    job_description: str

# ----------------------------------------------------
# 5. AUTHENTICATION HELPERS
# ----------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(lambda x: ""), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

# ----------------------------------------------------
# 6. ROUTER ENDPOINTS
# ----------------------------------------------------
@app.post("/auth/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = pwd_context.hash(user_in.password)
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_pwd,
        name=user_in.name,
        role="Standard User"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Audit trail
    db.add(AuditLog(user_id=new_user.id, event="Account Created"))
    db.commit()
    
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_email(db, user_in.email)
    if not user or not pwd_context.verify(user_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    db.add(AuditLog(user_id=user.id, event="User Login Successful"))
    db.commit()

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# ----------------------------------------------------
# 7. AI & PARSING PROCESSING (Celery task placeholders)
# ----------------------------------------------------
def process_resume_nlp(resume_id: int):
    # This runs asynchronously in Celery
    # 1. Load document text using PyMuPDF (fitz) or docx
    # 2. Feed text into spaCy: extract contacts, organizations, and entities
    # 3. Request OpenAI GPT for formatting guidelines and grammar audits
    # 4. Save results back into Resume model in PostgreSQL
    pass

@app.post("/resumes/upload")
async def upload_resume(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["pdf", "docx"]:
        raise HTTPException(status_code=400, detail="Unsupported file format")
        
    contents = await file.read()
    raw_text = ""

    # Simulated text extractor wrapper
    if ext == "pdf":
        # import fitz
        # doc = fitz.open(stream=contents, filetype="pdf")
        # raw_text = "\n".join([page.get_text() for page in doc])
        raw_text = "Simulated PyMuPDF extracted candidate details for " + file.filename
    else:
        # import docx
        # doc = docx.Document(io.BytesIO(contents))
        # raw_text = "\n".join([p.text for p in doc.paragraphs])
        raw_text = "Simulated python-docx extracted candidate details for " + file.filename

    new_resume = Resume(
        user_id=current_user.id,
        file_name=file.filename,
        raw_text=raw_text,
        ats_score=75
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    # Queue background analysis (analogous to Celery worker triggers)
    background_tasks.add_task(process_resume_nlp, new_resume.id)

    return {"message": "Upload success, processing in background Celery queues.", "resume_id": new_resume.id}

@app.post("/jobs/compare")
def compare_job(req: JobCompareRequest, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == req.resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume reference not found")
        
    # Calculate similarity embeddings
    # from sentence_transformers import SentenceTransformer, util
    # model = SentenceTransformer('all-MiniLM-L6-v2')
    # emb1 = model.encode(resume.raw_text, convert_to_tensor=True)
    # emb2 = model.encode(req.job_description, convert_to_tensor=True)
    # score = util.cos_sim(emb1, emb2).item()
    score = 0.72 # Default simulation

    return {
        "match_score": int(score * 100),
        "recommendations": [
            "Add custom cloud configuration skills.",
            "Ensure certifications targets are explicitly stated."
        ]
    }
