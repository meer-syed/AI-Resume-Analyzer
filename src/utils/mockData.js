export const mockProfiles = {
  software_engineer: {
    id: 'se-001',
    title: 'Senior Software Engineer',
    name: 'Alex Rivera',
    email: 'alex.rivera@devmail.io',
    phone: '+1 (555) 382-9471',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alex-rivera-codes',
    github: 'github.com/arivera-dev',
    portfolio: 'alexrivera.dev',
    summary: 'Senior Software Engineer with 6+ years of experience specializing in full-stack JavaScript applications, cloud architectures, and high-throughput microservices. Passionate about engineering performance, developer ergonomics, and mentoring engineering teams.',
    
    education: [
      { degree: 'B.S. in Computer Science', school: 'Stanford University', date: '2016 - 2020', gpa: '3.8/4.0' }
    ],
    
    experience: [
      {
        role: 'Senior Software Engineer',
        company: 'Vercel Inc.',
        date: '2022 - Present',
        description: [
          'Led development of edge routing protocols, reducing page load latency by 32% across 4M+ active sites.',
          'Collaborated with product designers to implement real-time preview features using React server components.',
          'Mentored 6 junior engineers and established automated CI/CD code quality gates with GitHub Actions.'
        ]
      },
      {
        role: 'Software Engineer II',
        company: 'Stripe',
        date: '2020 - 2022',
        description: [
          'Designed and developed transaction auditing systems processing over $12M in daily volume.',
          'Refactored legacy rails service into a FastAPI microservice, improving throughput by 4x.',
          'Maintained high system reliability, keeping checkout service availability at 99.999% during peak sales.'
        ]
      }
    ],

    projects: [
      {
        name: 'LiteQuery DB',
        description: 'An open-source, client-side vector database designed for offline-first React applications.',
        tech: ['TypeScript', 'WebAssembly', 'React', 'Rust'],
        stars: '1.2k stars'
      },
      {
        name: 'SaaS Launchpad',
        description: 'A micro-framework for rapidly bootstrapping FastAPI and Next.js applications.',
        tech: ['FastAPI', 'Next.js', 'PostgreSQL', 'Docker'],
        stars: '800+ stars'
      }
    ],

    skills: [
      { name: 'React / Next.js', category: 'Frontend', level: 'Expert' },
      { name: 'Node.js / Express', category: 'Backend', level: 'Expert' },
      { name: 'TypeScript', category: 'Languages', level: 'Expert' },
      { name: 'FastAPI / Python', category: 'Backend', level: 'Advanced' },
      { name: 'PostgreSQL', category: 'Database', level: 'Advanced' },
      { name: 'Docker & Kubernetes', category: 'DevOps', level: 'Advanced' },
      { name: 'AWS (S3, Lambda, EC2)', category: 'Cloud', level: 'Advanced' },
      { name: 'Redis', category: 'Database', level: 'Intermediate' },
      { name: 'GraphQL', category: 'APIs', level: 'Advanced' },
      { name: 'Git / CI/CD', category: 'DevOps', level: 'Expert' }
    ],

    languages: ['English (Native)', 'Spanish (Conversational)'],
    certifications: [
      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023' }
    ],
    achievements: [
      'Keynote speaker at JSConf 2024 on "Future of Edge Rendering"',
      'Discovered security vulnerability in open-source router (CVE-2023-38291)'
    ],

    ats: {
      overall: 88,
      breakdown: {
        formatting: 92,
        keywords: 85,
        grammar: 95,
        sections: 90,
        readability: 82,
        length: 98
      },
      issues: [
        { id: 'ats-1', severity: 'warning', section: 'Keywords', message: 'Missing core cloud-native keywords: "Kubernetes", "Prometheus", "Terraform".', category: 'Keywords' },
        { id: 'ats-2', severity: 'danger', section: 'Experience', message: 'First bullet in Stripe role uses weak action verb "Worked on transaction auditing".', category: 'Formatting' },
        { id: 'ats-3', severity: 'warning', section: 'Skills', message: 'Missing certifications related to Kubernetes/DevOps.', category: 'Skills' },
        { id: 'ats-4', severity: 'info', section: 'Length', message: 'Perfect resume length (1.5 pages). Ideal readability and margins.', category: 'Formatting' }
      ]
    },

    grammar: {
      issues: [
        {
          id: 'g-1',
          type: 'Weak Verb',
          text: 'Worked on transaction auditing',
          suggested: 'Designed and developed transaction auditing systems using React and FastAPI, improving throughput by 35%.',
          context: 'Use strong, impact-driven action verbs instead of general phrases.'
        },
        {
          id: 'g-2',
          type: 'Passive Voice',
          text: 'Establishing automated CI/CD code quality gates was done by me',
          suggested: 'Established automated CI/CD code quality gates with GitHub Actions.',
          context: 'Write in active voice to display direct ownership.'
        },
        {
          id: 'g-3',
          type: 'Spelling / Typos',
          text: 'Collaborated with product desingers',
          suggested: 'Collaborated with product designers',
          context: 'Corrected spelling for professional tone.'
        }
      ]
    },

    jobMatching: {
      targetJob: 'Staff Engineer (Infrastructure) - Vercel',
      descriptionText: 'We are looking for a Staff Engineer to design global routing systems, enhance serverless cold start times, manage edge network clusters, and optimize developer experience. Key requirements: React, Edge computing, Kubernetes, Terraform, Go, CI/CD, Next.js, and scaling systems handling 100k+ RPS.',
      matchScore: 78,
      matchedSkills: ['React', 'Edge computing', 'CI/CD', 'Next.js', 'Next.js Edge rendering'],
      missingSkills: ['Terraform', 'Go', 'Kubernetes Clusters', 'Prometheus monitoring'],
      weakAreas: [
        'Infrastructure-specific configuration tools (Terraform) are missing.',
        'High RPS load scaling experience could be emphasized more in projects.'
      ],
      recommendations: [
        'Add a project detailing Kubernetes cluster management or containerization.',
        'Incorporate "Terraform" and "Go" skills under languages and frameworks.',
        'Optimize your Stripe experience bullet to highlight scaling throughput to 100k+ RPS.'
      ]
    }
  },

  product_designer: {
    id: 'pd-002',
    title: 'Senior Product Designer',
    name: 'Clara Oswald',
    email: 'clara.design@uxstudio.co',
    phone: '+1 (555) 721-0492',
    location: 'Brooklyn, NY',
    linkedin: 'linkedin.com/in/clara-oswald-ux',
    github: 'github.com/clara-designs',
    portfolio: 'claraoswald.design',
    summary: 'Award-winning UX/UI Product Designer with 5+ years of experience craft-tuning B2B SaaS interfaces, interactive design systems, and visual guidelines. Expert in human-centered design principles, web accessibility (WCAG), and responsive developer handoff.',
    
    education: [
      { degree: 'B.F.A. in Communication Design', school: 'Pratt Institute', date: '2017 - 2021', gpa: '3.9/4.0' }
    ],
    
    experience: [
      {
        role: 'Senior Product Designer',
        company: 'Linear App',
        date: '2023 - Present',
        description: [
          'Re-architected user search interface, improving keyboard navigation efficiency by 45%.',
          'Created and maintained unified component token library used by 4 frontend teams in Figma and CSS.',
          'Conducted 50+ user testing sessions to iterate on workflow customization dashboards.'
        ]
      },
      {
        role: 'Product Designer',
        company: 'Framer',
        date: '2021 - 2023',
        description: [
          'Designed landing pages and interaction models that increased template installations by 60%.',
          'Worked on mobile app project to align Android and iOS interfaces with design tokens.',
          'Shipped 3 major UI kits downloaded by over 20,000 community designers.'
        ]
      }
    ],

    projects: [
      {
        name: 'Aura UI Kit',
        description: 'A fully accessible, WCAG-compliant design system containing 40+ responsive components.',
        tech: ['Figma', 'Framer Motion', 'Tailwind', 'Storybook'],
        stars: '15,000+ copies'
      }
    ],

    skills: [
      { name: 'Figma', category: 'Tools', level: 'Expert' },
      { name: 'UI/UX Design', category: 'Specialty', level: 'Expert' },
      { name: 'Design Tokens', category: 'Specialty', level: 'Expert' },
      { name: 'Prototyping (Framer)', category: 'Tools', level: 'Expert' },
      { name: 'Web Accessibility (WCAG)', category: 'Standards', level: 'Advanced' },
      { name: 'HTML & CSS', category: 'Frontend', level: 'Intermediate' },
      { name: 'User Research', category: 'Specialty', level: 'Advanced' }
    ],

    languages: ['English (Native)', 'French (Conversational)'],
    certifications: [
      { name: 'IAAP Web Accessibility Specialist', issuer: 'IAAP', date: '2022' }
    ],
    achievements: [
      'UX Design Award Winner 2024',
      'Author of weekly newsletter "Pixel Craft" with 8,000 subscribers'
    ],

    ats: {
      overall: 93,
      breakdown: {
        formatting: 96,
        keywords: 90,
        grammar: 98,
        sections: 95,
        readability: 92,
        length: 90
      },
      issues: [
        { id: 'ats-pd-1', severity: 'warning', section: 'Experience', message: 'Framer role first bullet uses passive-oriented wording "Worked on mobile app".', category: 'Formatting' },
        { id: 'ats-pd-2', severity: 'info', section: 'Readability', message: 'Excellent layout with modern font hierarchy. Perfect scanability.', category: 'Formatting' }
      ]
    },

    grammar: {
      issues: [
        {
          id: 'g-pd-1',
          type: 'Weak Verb',
          text: 'Worked on mobile app project',
          suggested: 'Designed and deployed mobile application frameworks, aligning Android and iOS modules with design tokens.',
          context: 'Elevate verbs to demonstrate leadership and technical output.'
        }
      ]
    },

    jobMatching: {
      targetJob: 'Lead Designer - Notion',
      descriptionText: 'Notion is searching for a Lead Designer to evolve core workspace editors, design database filters, and design layout controls. Requirements: Figma, advanced prototyping, high design craftsmanship, HTML/CSS familiarity, React, accessibility compliance, and design system scaling.',
      matchScore: 84,
      matchedSkills: ['Figma', 'Prototyping', 'Accessibility compliance', 'HTML & CSS', 'Design System scaling'],
      missingSkills: ['React', 'Database architecture logic', 'Lead team governance'],
      weakAreas: [
        'React framework familiarity is not explicitly highlighted in the resume.',
        'Leadership / direct management experience could be strengthened.'
      ],
      recommendations: [
        'Add a short project showing React code integration in storybook.',
        'Mention "Lead Designer" or "Lead responsibilities" in the Linear experience bullet points.'
      ]
    }
  }
};

export const initialHistory = [
  {
    id: 'h-1',
    fileName: 'Alex_Rivera_Resume_v1.pdf',
    score: 68,
    version: 'v1.0',
    date: '2026-06-10 14:32',
    parsedProfile: 'software_engineer',
    jobTarget: 'Full Stack Engineer - Vercel'
  },
  {
    id: 'h-2',
    fileName: 'Alex_Rivera_Resume_v2.pdf',
    score: 80,
    version: 'v2.0',
    date: '2026-07-01 10:15',
    parsedProfile: 'software_engineer',
    jobTarget: 'Staff Engineer - Vercel'
  },
  {
    id: 'h-3',
    fileName: 'Alex_Rivera_Resume_v3.pdf',
    score: 88,
    version: 'v3.0',
    date: '2026-07-16 22:45',
    parsedProfile: 'software_engineer',
    jobTarget: 'Staff Engineer (Infrastructure) - Vercel'
  }
];

export const mockNotifications = [
  { id: 'n-1', type: 'success', text: 'Resume "Alex_Rivera_Resume_v3.pdf" analyzed successfully. Score: 88.', time: '5m ago', read: false },
  { id: 'n-2', type: 'info', text: 'Job match report completed for Staff Engineer at Vercel.', time: '10m ago', read: false },
  { id: 'n-3', type: 'warning', text: 'Admin Warning: API usage quota is at 84% for this month.', time: '2h ago', read: true }
];

export const mockSystemStats = {
  cpuUsage: 14,
  memoryUsage: 38,
  redisStatus: 'Healthy',
  celeryWorkers: 3,
  celeryTasksQueued: 0,
  apiRequests: 14209,
  revenue: [
    { month: 'Jan', amount: 4500 },
    { month: 'Feb', amount: 5600 },
    { month: 'Mar', amount: 6800 },
    { month: 'Apr', amount: 8900 },
    { month: 'May', amount: 11200 },
    { month: 'Jun', amount: 14500 }
  ],
  topErrors: [
    { error: 'Passive Voice Detected', count: 489, category: 'Grammar' },
    { error: 'Missing Section: Summary', count: 320, category: 'Formatting' },
    { error: 'Invalid file format', count: 182, category: 'System' }
  ]
};

export const mockUsers = [
  { id: 'u-1', name: 'Maya Chen', email: 'maya@chen.design', role: 'Premium User', resumesCount: 4, dateJoined: '2026-01-15' },
  { id: 'u-2', name: 'Darius Brooks', email: 'd.brooks@eng.com', role: 'Standard User', resumesCount: 2, dateJoined: '2026-03-22' },
  { id: 'u-3', name: 'Sarah Connor', email: 's.connor@cyber.tech', role: 'Admin', resumesCount: 1, dateJoined: '2025-11-01' },
  { id: 'u-4', name: 'Thomas Anderson', email: 'neo@matrix.io', role: 'Premium User', resumesCount: 8, dateJoined: '2026-05-19' }
];
