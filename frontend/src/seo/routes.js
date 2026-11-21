// Single source of truth for search-engine tags. Used by <Seo /> (in the browser) and by
// scripts/seo-build.mjs (at build time, to write one real HTML file per page).
// Plain ESM with no JSX so Node can import it.

export const SITE = {
  url: 'https://www.cwcecosystem.com',
  name: 'CWC Ecosystem',
  alt: 'Career with Chaitanya',
  image: '/icon-512.png',
  sameAs: [
    'https://www.youtube.com/@careerwithchaitanya',
    'https://www.instagram.com/careerwithchaitanya/',
    'https://www.linkedin.com/in/chaitanya-madakasira/',
  ],
}

const BRAND = 'CWC Ecosystem | Career with Chaitanya'

// `index: false` keeps a page out of search results and the sitemap.
export const PAGES = {
  '/': {
    title: `${BRAND} – Courses, Roadmaps & Mock Interviews`,
    description: 'CWC Ecosystem by Career with Chaitanya: free video courses, role roadmaps, mock interviews, open mic meets and fresh job openings to help you land your first offer letter.',
    h1: 'CWC Ecosystem – Career with Chaitanya',
    text: 'Learn, practise and get hired. Video courses, role roadmaps, mock interviews and a friendly open mic, guided by Chaitanya.',
    priority: '1.0',
  },
  '/roadmaps': {
    title: 'Career Roadmaps for Freshers & Experienced | Career with Chaitanya',
    description: 'Step-by-step career roadmaps from Career with Chaitanya: know exactly what to learn, in what order, for fresher and experienced software and data roles.',
    h1: 'Career roadmaps',
    text: 'Step-by-step plans for fresher and experienced roles.',
    priority: '0.9',
  },
  '/courses': {
    title: 'Free Course Videos in Telugu & English | Career with Chaitanya',
    description: 'Free video playlists from Career with Chaitanya in Telugu and English: DSA, Python, MERN stack and Java for placements and projects.',
    h1: 'Free course videos',
    text: 'Free video playlists in Telugu and English: DSA, Python, MERN and Java.',
    priority: '0.8',
  },
  '/course-tracks': {
    title: 'Courses Hub – Freshers & Experienced Tracks | Career with Chaitanya',
    description: 'Career with Chaitanya Courses Hub: job-ready courses for freshers, with an experienced track coming soon. Pick your level and start.',
    h1: 'Courses Hub',
    text: 'Choose your level: Freshers or Experienced.',
    priority: '0.9',
  },
  '/course-tracks/freshers': {
    title: 'Fresher Courses: Data Science, AI/ML, Full Stack | Career with Chaitanya',
    description: 'Job-focused fresher courses by Career with Chaitanya: Data Science, Data Analysis, AI & ML, Python Full Stack and Java Full Stack, with mentoring and mock interviews.',
    h1: 'Courses for freshers',
    text: 'Data Science, Data Analysis, AI & ML, Python Full Stack and Java Full Stack.',
    priority: '0.9',
  },
  '/interview-simulator': {
    title: 'Interview Simulator – Mock Interview Rounds | Career with Chaitanya',
    description: 'Practise the full hiring process in five rounds with the Career with Chaitanya Interview Simulator: aptitude, reasoning, technical, HR and a one-to-one review.',
    h1: 'Interview Simulator',
    text: 'Five realistic rounds, from aptitude to a one-to-one review.',
    priority: '0.9',
  },
  '/crack-company': {
    title: 'Crack the Company – How Top Companies Hire | Career with Chaitanya',
    description: 'Round-by-round guides to how top companies such as TCS, Infosys, Amazon, Microsoft and Google hire, and how to prepare. By Career with Chaitanya.',
    h1: 'Crack the Company',
    text: 'How each company hires, round by round, and how to prepare.',
    priority: '0.8',
  },
  '/jobs': {
    title: 'Fresher Job Openings | Career with Chaitanya',
    description: 'Fresh job openings for freshers and early-career candidates, collected and updated by Career with Chaitanya. Apply directly from the listing.',
    h1: 'Job openings',
    text: 'Fresh job openings for freshers and early-career candidates.',
    priority: '0.8',
  },
  '/open-mic': {
    title: 'CWC Open Mic – Online & Offline Meets | Career with Chaitanya',
    description: 'Join the CWC Open Mic: online and offline meets to practise speaking, share ideas and meet people on the same path. Photos and recordings from past sessions.',
    h1: 'CWC Open Mic',
    text: 'A friendly stage to practise speaking, share ideas and meet people on the same path.',
    priority: '0.7',
  },
  '/testimonials': {
    title: 'Student Success Stories & Testimonials | Career with Chaitanya',
    description: 'Hear from students who followed the Career with Chaitanya plan and landed their first offer letter.',
    h1: 'Student stories',
    text: 'Stories from students who followed the plan.',
    priority: '0.7',
  },
  '/about': {
    title: 'About Chaitanya & CWC Ecosystem | Career with Chaitanya',
    description: 'About Chaitanya and the CWC Ecosystem: free resources, roadmaps, mock interviews and guidance built to help students get their first job.',
    h1: 'About us',
    text: 'The story and the mission behind CWC Ecosystem and Career with Chaitanya.',
    priority: '0.6',
  },
  '/login': {
    title: `Log in or sign up | ${SITE.name}`,
    description: 'Log in or create a free CWC Ecosystem account.',
    h1: 'Log in',
    text: 'Log in or create a free account.',
    index: false,
  },
}

export const normalizePath = (p) => {
  const clean = (p || '/').split('?')[0].split('#')[0].replace(/\/+$/, '')
  return clean || '/'
}

// exact page, otherwise the closest parent (e.g. /roadmaps/some-slug uses /roadmaps)
export function pageFor(path) {
  const p = normalizePath(path)
  if (PAGES[p]) return { path: p, ...PAGES[p] }
  const parent = Object.keys(PAGES).filter((k) => k !== '/' && p.startsWith(`${k}/`)).sort((a, b) => b.length - a.length)[0]
  return { path: p, ...PAGES[parent || '/'], parent: Boolean(parent) }
}

export const jsonLd = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': `${SITE.url}/#org`,
      name: SITE.name,
      alternateName: [SITE.alt, 'CWC', 'Chaitanya courses'],
      url: `${SITE.url}/`,
      logo: `${SITE.url}${SITE.image}`,
      description: PAGES['/'].description,
      sameAs: SITE.sameAs,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: `${SITE.url}/`,
      name: SITE.name,
      alternateName: SITE.alt,
      inLanguage: 'en',
      publisher: { '@id': `${SITE.url}/#org` },
    },
  ],
})
