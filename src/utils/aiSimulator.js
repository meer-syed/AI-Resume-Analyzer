import { mockProfiles } from './mockData';

// Simulated delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulates a Celery background pipeline processing a resume.
 * Calls `onProgress` with logs as it works through stages.
 */
export async function simulateResumeParsing(file, onProgress) {
  const steps = [
    { message: 'Verifying file type and scanning formatting bounds...', delayTime: 600 },
    { message: 'Initializing spaCy NLP parser models (en_core_web_md)...', delayTime: 700 },
    { message: 'Parsing contact details, email patterns, and LinkedIn links...', delayTime: 500 },
    { message: 'Extracting skills taxonomies and cross-referencing industry databases...', delayTime: 800 },
    { message: 'Detecting grammar issues, weak action verbs, and passive voice...', delayTime: 600 },
    { message: 'Calculating final ATS score and generating AI suggestions...', delayTime: 500 }
  ];

  for (let i = 0; i < steps.length; i++) {
    onProgress({
      stage: i + 1,
      totalStages: steps.length,
      message: steps[i].message,
      progress: Math.round(((i + 1) / steps.length) * 100)
    });
    await delay(steps[i].delayTime);
  }

  // Determine profile based on file name content
  const lowerName = file.name.toLowerCase();
  let selectedProfile = 'software_engineer';
  if (lowerName.includes('design') || lowerName.includes('creative') || lowerName.includes('portfolio') || lowerName.includes('art')) {
    selectedProfile = 'product_designer';
  }

  // Deep clone the mock profile
  const baseProfile = JSON.parse(JSON.stringify(mockProfiles[selectedProfile]));
  
  // Custom adjust based on file details to make it feel super real!
  baseProfile.name = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
  // Capitalize name
  baseProfile.name = baseProfile.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  // Add some random variation to score so every upload feels unique
  const randomScoreOffset = Math.floor(Math.random() * 9) - 4; // -4 to +4
  baseProfile.ats.overall = Math.min(100, Math.max(45, baseProfile.ats.overall + randomScoreOffset));
  baseProfile.ats.breakdown.keywords = Math.min(100, Math.max(40, baseProfile.ats.breakdown.keywords + randomScoreOffset - 2));
  baseProfile.ats.breakdown.readability = Math.min(100, Math.max(45, baseProfile.ats.breakdown.readability + randomScoreOffset + 3));

  return baseProfile;
}

/**
 * Simulates analyzing a Job Description against the resume.
 */
export async function simulateJobAnalysis(resume, jobDescription, onProgress) {
  const steps = [
    { message: 'Parsing job description keywords & requirements...', delayTime: 400 },
    { message: 'Computing sentence transformers vector embeddings alignment...', delayTime: 600 },
    { message: 'Evaluating gaps in technical certifications and leadership levels...', delayTime: 450 }
  ];

  for (let i = 0; i < steps.length; i++) {
    if (onProgress) {
      onProgress(steps[i].message);
    }
    await delay(steps[i].delayTime);
  }

  // Extract words from JD to simulate matching
  const jdLower = jobDescription.toLowerCase();
  const allResumeSkills = resume.skills.map(s => s.name.toLowerCase());
  
  // Build dynamic matched and missing list
  const sampleTargetKeywords = [
    'react', 'next.js', 'typescript', 'fastapi', 'python', 'docker', 'kubernetes', 'aws', 
    'terraform', 'go', 'graphql', 'figma', 'framer', 'accessibility', 'wcag', 'ux research', 
    'design systems', 'product design', 'prometheus', 'redis', 'postgresql', 'sql'
  ];

  const matched = [];
  const missing = [];

  sampleTargetKeywords.forEach(kw => {
    if (jdLower.includes(kw)) {
      if (allResumeSkills.some(skill => skill.includes(kw))) {
        matched.push(kw.charAt(0).toUpperCase() + kw.slice(1));
      } else {
        missing.push(kw.charAt(0).toUpperCase() + kw.slice(1));
      }
    }
  });

  // Calculate score based on proportion
  let score = 50;
  if (matched.length + missing.length > 0) {
    score = Math.round((matched.length / (matched.length + missing.length)) * 100);
  } else {
    // If no keywords matched, make a default score based on general text similarity
    score = Math.min(92, Math.max(30, Math.round(50 + (jobDescription.length % 25))));
  }

  // Generate dynamic gaps
  const weakAreas = [];
  if (missing.length > 0) {
    weakAreas.push(`Your resume lacks direct mention of: ${missing.slice(0, 3).join(', ')}.`);
  }
  if (jobDescription.length > 100 && !jdLower.includes('achieved') && !jdLower.includes('scale')) {
    weakAreas.push('Provide more quantitative achievements (e.g. percentages, budgets, metrics) corresponding to target roles.');
  }

  const recommendations = [];
  if (missing.includes('Terraform') || missing.includes('Go')) {
    recommendations.push('Introduce a cloud automation project highlighting infrastructure configurations.');
  }
  if (missing.includes('Accessibility') || missing.includes('WCAG')) {
    recommendations.push('Revise UX design summaries to highlight international accessibility compliance (WCAG 2.1 AA).');
  }
  recommendations.push('Incorporate standard metrics in your summaries (e.g. page speed improvement, client satisfaction rates).');

  return {
    targetJob: jobDescription.substring(0, 45) + (jobDescription.length > 45 ? '...' : ''),
    descriptionText: jobDescription,
    matchScore: score,
    matchedSkills: matched.length > 0 ? matched : ['React', 'CSS', 'Git'],
    missingSkills: missing.length > 0 ? missing : ['Terraform', 'Kubernetes'],
    weakAreas: weakAreas.length > 0 ? weakAreas : ['Slight mismatch in infrastructure technologies.'],
    recommendations: recommendations
  };
}

/**
 * Simulates Generating a Cover Letter.
 */
export async function simulateCoverLetter(resume, jobTarget, company = 'Target Company') {
  await delay(1200); // Simulate network latency

  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `[YOUR CONTACT DETAILS]
${resume.name}
${resume.email} | ${resume.phone}
${resume.location}

${dateStr}

Hiring Manager
${company}

Subject: Application for ${jobTarget || 'Software Engineering Team'}

Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${jobTarget || 'Software Engineering'} position at ${company}. As a skilled professional with extensive experience in the industry, my background in building production-ready architectures aligns perfectly with your team's current initiatives.

In my recent work at my current role, I led critical product implementations, resulting in significant business outcomes, including optimized system performances and streamlined cross-functional developer experiences. Specifically, I have deep practical experience with technologies such as ${resume.skills.slice(0, 3).map(s => s.name).join(', ')}, which I understand are core elements of your technical ecosystem.

What excites me most about ${company} is your commitment to design quality and technical excellence. I am confident that my technical design mindset and user-centric approach will allow me to integrate smoothly and make a positive impact starting on day one.

Thank you for your time and consideration. I welcome the opportunity to discuss how my skill set and achievements align with the goals of ${company}.

Sincerely,

${resume.name}`;
}

/**
 * Simulates a Career Coach chat conversation.
 */
export async function simulateCoachChat(resume, messages) {
  await delay(1000);
  const lastMessage = messages[messages.length - 1].text.toLowerCase();

  let reply = '';
  if (lastMessage.includes('ats') || lastMessage.includes('score')) {
    reply = `Your current resume ATS score is ${resume.ats.overall}/100. To increase it, I recommend addressing the warning items in your analysis panel. Specifically, try incorporating more active verbs in your work description bullet points, and check if you are missing key technical skills requested in your target job descriptions.`;
  } else if (lastMessage.includes('skills') || lastMessage.includes('missing')) {
    reply = `Based on your profile, you have strong capabilities in ${resume.skills.slice(0, 3).map(s => s.name).join(', ')}. If you are applying to staff or lead roles, I recommend adding architectural methodologies like "Microservices Design", "System Scalability", or specialized tools like "Docker/Terraform" to make your skills list comprehensive.`;
  } else if (lastMessage.includes('formatting') || lastMessage.includes('template')) {
    reply = `ATS parsers prefer clean, single-column text formatting with standard section names (e.g., "Work Experience", "Education", "Skills"). Avoid complex multi-column grid layouts, graphic skill progress indicators, or nesting text in image files, as this often confuses the parser.`;
  } else if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
    reply = `Hello ${resume.name}! I am your AI Career Coach. I have analyzed your resume as a ${resume.title}. Ask me anything about increasing your ATS score, phrasing recommendations, or formatting styles!`;
  } else {
    reply = `That is an excellent career query. For a ${resume.title}, standard industry guidelines suggest highlighting concrete results. Instead of just listing responsibilities, write about the business outcome (e.g. "shipped feature X, improving conversions by 15%"). Is there a specific role or bullet point you would like us to rewrite together?`;
  }

  return reply;
}

/**
 * Generates custom interview questions based on parsed resume skills.
 */
export async function simulateInterviewQuestions(resume) {
  await delay(800);
  const coreSkills = resume.skills.slice(0, 3).map(s => s.name);
  
  return [
    {
      id: 'q-1',
      question: `Can you walk me through a complex architectural decision where you utilized ${coreSkills[0] || 'your core skills'}? What trade-offs did you consider?`,
      sampleAnswer: 'A strong answer will describe a specific problem, outline the options considered (such as performance vs maintenance), explain why this tech stack was chosen, and state the measurable outcome (e.g., reduced loading times or reduced API costs).'
    },
    {
      id: 'q-2',
      question: `In your role at ${resume.experience[0]?.company || 'your previous company'}, you mentioned optimizing workloads. How did you measure performance and identify bottlenecks?`,
      sampleAnswer: 'Explain your monitoring stack (APMs, logs, tracing), how you isolated database latency vs network latency, and the specific database index or edge routing adjustments made.'
    },
    {
      id: 'q-3',
      question: `How do you stay updated with emerging standards, and how do you introduce new methodologies (like those you used in ${resume.projects[0]?.name || 'projects'}) to a larger engineering team?`,
      sampleAnswer: 'Focus on your active community involvement, writing design proposal documents (RFCs), hosting lunch-and-learns, and running phased, low-risk migrations.'
    }
  ];
}
