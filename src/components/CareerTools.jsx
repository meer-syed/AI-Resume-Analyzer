import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, MessageSquare, FileText, HelpCircle, Clipboard, Check,
  Send, Award, BookOpen, Zap, Star, ChevronRight, Bot
} from 'lucide-react';
import { simulateCoverLetter, simulateCoachChat, simulateInterviewQuestions } from '../utils/aiSimulator';

const SUB_TOOLS = [
  { id: 'coverLetter', label: 'Cover Letter AI', icon: FileText },
  { id: 'chatbot',     label: 'Career Coach',    icon: MessageSquare },
  { id: 'interview',   label: 'Interview Prep',  icon: HelpCircle },
];

export default function CareerTools({ resume }) {
  const [activeTool, setActiveTool] = useState('coverLetter');

  // Cover Letter
  const [clTarget, setClTarget]         = useState('');
  const [clCompany, setClCompany]       = useState('');
  const [isGeneratingCl, setIsGeneratingCl] = useState(false);
  const [clContent, setClContent]       = useState('');
  const [clCopied, setClCopied]         = useState(false);

  // Chat
  const [chatMessages, setChatMessages] = useState([
    { sender: 'coach', text: "Hi! I'm your AI Career Coach. I've analyzed your resume — ask me anything about improving your ATS score, rephrasing bullet points, or how to stand out for specific roles." }
  ]);
  const [chatInput, setChatInput]       = useState('');
  const [isCoachTyping, setIsCoachTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Interview
  const [questions, setQuestions]       = useState([]);
  const [activeQIdx, setActiveQIdx]     = useState(0);
  const [userAnswers, setUserAnswers]   = useState({});
  const [isLoadingQ, setIsLoadingQ]     = useState(false);
  const [feedbackMap, setFeedbackMap]   = useState({});

  useEffect(() => {
    if (activeTool === 'interview' && questions.length === 0 && resume) {
      loadInterviewQuestions();
    }
  }, [activeTool, resume]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isCoachTyping]);

  const loadInterviewQuestions = async () => {
    setIsLoadingQ(true);
    const qs = await simulateInterviewQuestions(resume);
    setQuestions(qs);
    setIsLoadingQ(false);
  };

  const handleGenerateCl = async (e) => {
    e.preventDefault();
    if (!resume) return;
    setIsGeneratingCl(true);
    const letter = await simulateCoverLetter(resume, clTarget, clCompany);
    setClContent(letter);
    setIsGeneratingCl(false);
  };

  const handleCopyCl = () => {
    navigator.clipboard.writeText(clContent);
    setClCopied(true);
    setTimeout(() => setClCopied(false), 1800);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !resume) return;
    const userMsg = { sender: 'user', text: chatInput };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput('');
    setIsCoachTyping(true);
    const reply = await simulateCoachChat(resume, newMessages);
    setChatMessages([...newMessages, { sender: 'coach', text: reply }]);
    setIsCoachTyping(false);
  };

  const handleAnswerSubmit = (qId, ansText) => {
    const lengthQuality = ansText.length > 50 ? 'solid' : 'brief';
    const keywordMentioned = resume?.skills?.slice(0, 2).some(s => ansText.toLowerCase().includes(s.name.toLowerCase()));
    let feedback, rating;
    if (lengthQuality === 'solid' && keywordMentioned) {
      feedback = 'Excellent answer! You included specific technical metrics and connected your response to core competencies.';
      rating = 5;
    } else if (lengthQuality === 'solid') {
      feedback = 'Good detail, but try tying your results directly to your core skill technologies to make it memorable.';
      rating = 4;
    } else {
      feedback = 'Too brief. Use the STAR method (Situation, Task, Action, Result) and add quantitative metrics.';
      rating = 2.5;
    }
    setFeedbackMap(prev => ({ ...prev, [qId]: { feedback, rating } }));
  };

  if (!resume) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><Bot size={28} /></div>
        <h3 style={{ fontWeight: 700 }}>Load a Resume First</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Upload or load a demo resume to access AI career tools.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="page-title">Career AI Tools</h1>
        <p className="page-subtitle">Generate cover letters, get coaching, and practice interviews — all powered by AI.</p>
      </motion.div>

      {/* Tool Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg2)', padding: '0.35rem', borderRadius: 'var(--r-lg)', width: 'fit-content', border: '1px solid var(--border)' }}>
        {SUB_TOOLS.map(tool => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <motion.button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.55rem 1.1rem', borderRadius: 'var(--r-md)',
                fontSize: '0.84rem', fontWeight: 600,
                background: isActive ? 'var(--surface)' : 'transparent',
                color: isActive ? 'var(--text)' : 'var(--text2)',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.18s', border: 'none', cursor: 'pointer'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon size={14} />
              {tool.label}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* ── COVER LETTER ─────────────────────── */}
        {activeTool === 'coverLetter' && (
          <motion.div key="cl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <div className="grid-2" style={{ gap: '1.25rem', gridTemplateColumns: '0.8fr 1.2fr', alignItems: 'start' }}>
              {/* Input */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(37,99,235,0.1)', color: 'var(--blue)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Generate Cover Letter</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text3)', lineHeight: 1.4 }}>AI-personalized based on your resume</p>
                  </div>
                </div>

                <form onSubmit={handleGenerateCl} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Target Role</label>
                    <input required type="text" className="form-control" value={clTarget} onChange={e => setClTarget(e.target.value)} placeholder="e.g. Senior Backend Engineer" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Target Company</label>
                    <input required type="text" className="form-control" value={clCompany} onChange={e => setClCompany(e.target.value)} placeholder="e.g. Stripe Inc." />
                  </div>
                  <motion.button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', opacity: isGeneratingCl ? 0.75 : 1 }}
                    disabled={isGeneratingCl}
                    whileHover={!isGeneratingCl ? { scale: 1.02 } : {}}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isGeneratingCl ? (
                      <>
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff' }} />
                        Generating...
                      </>
                    ) : (
                      <><Sparkles size={14} /> Generate with AI</>
                    )}
                  </motion.button>
                </form>
              </div>

              {/* Output */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>Generated Letter</h4>
                  {clContent && (
                    <button className="btn btn-secondary btn-sm" onClick={handleCopyCl}>
                      {clCopied ? <><Check size={12} color="var(--green)" /> Copied</> : <><Clipboard size={12} /> Copy</>}
                    </button>
                  )}
                </div>

                {clContent ? (
                  <textarea
                    value={clContent}
                    onChange={e => setClContent(e.target.value)}
                    className="form-control"
                    style={{ minHeight: 300, fontFamily: 'inherit', fontSize: '0.82rem', lineHeight: 1.7, resize: 'vertical' }}
                  />
                ) : (
                  <div style={{ minHeight: 250, display: 'grid', placeItems: 'center', border: '2px dashed var(--border)', borderRadius: 'var(--r-sm)', textAlign: 'center', padding: '2rem' }}>
                    <div>
                      <FileText size={32} color="var(--text3)" style={{ margin: '0 auto 0.75rem' }} />
                      <p style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>Fill in the details and click Generate</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── CAREER COACH CHAT ───────────────── */}
        {activeTool === 'chatbot' && (
          <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <div className="card" style={{ overflow: 'hidden' }}>
              {/* Chat Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--grad-primary)', display: 'grid', placeItems: 'center', color: '#fff' }}>
                  <Bot size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>AI Career Coach</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--green)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                    Online · Powered by Gemini AI
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ height: 380, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'var(--bg)' }}>
                {chatMessages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}
                  >
                    <div className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'coach'}`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {isCoachTyping && (
                  <div style={{ display: 'flex', gap: '4px', padding: '0.65rem 0.9rem', background: 'var(--bg2)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', width: 'fit-content' }}>
                    {[0, 0.2, 0.4].map((d, i) => (
                      <motion.div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text3)' }} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, delay: d, repeat: Infinity }} />
                    ))}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompts */}
              <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', gap: '0.5rem', overflowX: 'auto', flexWrap: 'wrap' }}>
                {["How do I improve my ATS score?", "Rewrite my summary", "What keywords am I missing?"].map(p => (
                  <button key={p} onClick={() => setChatInput(p)} className="stat-pill" style={{ cursor: 'pointer', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                    {p}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.65rem', padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask anything about your resume..."
                  className="form-control"
                  style={{ borderRadius: 'var(--r-full)', paddingLeft: '1rem' }}
                />
                <motion.button
                  type="submit"
                  className="btn btn-primary btn-icon"
                  style={{ borderRadius: '50%', width: 40, height: 40, flexShrink: 0 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <Send size={15} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {/* ── INTERVIEW PREP ──────────────────── */}
        {activeTool === 'interview' && (
          <motion.div key="interview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.15rem' }}>Interview Preparation</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>AI-generated questions based on your profile</p>
                </div>
                {questions.length > 0 && (
                  <span className="badge badge-blue">{questions.length} Questions</span>
                )}
              </div>

              {isLoadingQ ? (
                <div style={{ textAlign: 'center', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[...Array(5)].map((_, i) => (
                      <motion.div key={i} style={{ width: 6, background: 'var(--grad-primary)', borderRadius: 3 }} animate={{ height: [12, 30, 12] }} transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }} />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Generating personalized interview questions...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><HelpCircle size={28} /></div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>No questions generated. Switch tab and come back.</p>
                </div>
              ) : (
                <div className="grid-2" style={{ gap: '1.25rem', alignItems: 'start' }}>
                  {/* Sidebar: Question List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {questions.map((q, idx) => {
                      const answered = !!feedbackMap[q.id];
                      return (
                        <button
                          key={q.id}
                          onClick={() => setActiveQIdx(idx)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.65rem',
                            padding: '0.75rem 0.9rem', borderRadius: 'var(--r-sm)',
                            background: activeQIdx === idx ? 'rgba(37,99,235,0.07)' : 'var(--bg2)',
                            border: `1px solid ${activeQIdx === idx ? 'rgba(37,99,235,0.2)' : 'var(--border)'}`,
                            color: activeQIdx === idx ? 'var(--blue)' : 'var(--text2)',
                            fontWeight: 600, fontSize: '0.82rem', textAlign: 'left',
                            cursor: 'pointer', transition: 'all 0.18s'
                          }}
                        >
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: answered ? 'var(--green)' : activeQIdx === idx ? 'var(--blue)' : 'var(--border2)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '0.68rem', fontWeight: 800, flexShrink: 0 }}>
                            {answered ? <Check size={11} /> : idx + 1}
                          </div>
                          Q{idx + 1}: {q.category || 'Behavioral'}
                        </button>
                      );
                    })}
                  </div>

                  {/* Main: Question + Answer */}
                  {questions[activeQIdx] && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ padding: '1rem', background: 'rgba(37,99,235,0.04)', borderLeft: '3px solid var(--blue)', borderRadius: 'var(--r-sm)' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' }}>Interview Question</div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.6 }}>{questions[activeQIdx].question}</p>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Your Answer</label>
                        <textarea
                          rows={5}
                          placeholder="Use the STAR method: Situation → Task → Action → Result. Add specific metrics."
                          value={userAnswers[questions[activeQIdx].id] || ''}
                          onChange={e => setUserAnswers({ ...userAnswers, [questions[activeQIdx].id]: e.target.value })}
                          className="form-control"
                        />
                      </div>

                      <button
                        onClick={() => handleAnswerSubmit(questions[activeQIdx].id, userAnswers[questions[activeQIdx].id] || '')}
                        className="btn btn-secondary"
                        style={{ alignSelf: 'flex-start' }}
                      >
                        <Award size={14} /> Get AI Feedback
                      </button>

                      <AnimatePresence>
                        {feedbackMap[questions[activeQIdx].id] && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}
                          >
                            {/* Rating */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ display: 'flex', gap: '2px' }}>
                                {[1,2,3,4,5].map(n => (
                                  <Star key={n} size={14} fill={n <= feedbackMap[questions[activeQIdx].id].rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                                ))}
                              </div>
                              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text2)' }}>
                                {feedbackMap[questions[activeQIdx].id].rating}/5
                              </span>
                            </div>

                            {/* Feedback */}
                            <div style={{ padding: '0.85rem', background: 'rgba(22,163,74,0.04)', border: '1px solid rgba(22,163,74,0.15)', borderRadius: 'var(--r-sm)', fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.6 }}>
                              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem' }}>AI Feedback</div>
                              {feedbackMap[questions[activeQIdx].id].feedback}
                            </div>

                            {/* Sample Answer */}
                            <div style={{ padding: '0.85rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.6 }}>
                              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem' }}>Sample Strong Answer</div>
                              {questions[activeQIdx].sampleAnswer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
