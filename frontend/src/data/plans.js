// Course Hub content: the five fresher courses and the two paid plans (from the updated PRD).

// One registration form for both plans. Split into two links here if the mentor wants separate forms.
const PLAN_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLScebFHozhuWO57itM9zJBSH3CC90OU6trprSLq_rZUXXa85WQ/viewform'
export const FORM_LINKS = {
  monthly: PLAN_FORM,
  program: PLAN_FORM,
}

// Form the mentor shared for the Interview Simulator page.
export const SIMULATOR_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSfW2JyV0uLCiCLqi0_zTtYGANYc8EQZyCaAJp02MLY9flSTtg/viewform'

export const FRESHER_COURSES = [
  { id: 'data-science', icon: 'database', title: 'Data Science', text: 'Turn raw data into predictions and decisions.',
    topics: ['Python', 'Statistics', 'Pandas & NumPy', 'Machine learning', 'Projects'] },
  { id: 'data-analysis', icon: 'chart', title: 'Data Analysis', text: 'Clean, analyse and present data the way companies expect.',
    topics: ['Excel', 'SQL', 'Power BI / Tableau', 'Python basics', 'Dashboards'] },
  { id: 'aiml', icon: 'cpu', title: 'AI & ML', text: 'Build and ship machine learning and AI-powered applications.',
    topics: ['Python', 'ML algorithms', 'Deep learning', 'Generative AI', 'Projects'] },
  { id: 'python-fullstack', icon: 'code', title: 'Python Full Stack', text: 'Build complete web applications, front to back, in Python.',
    topics: ['HTML, CSS, JS', 'React', 'Django', 'Databases', 'Deployment'] },
  { id: 'java-fullstack', icon: 'coffee', title: 'Java Full Stack', text: 'The enterprise-ready stack that many service companies hire for.',
    topics: ['Core Java', 'Spring Boot', 'React', 'SQL', 'Deployment'] },
]

// `monthly` / `program`: true, false, or a short text.
export const PLAN_ROWS = [
  { label: 'Mock interview and review', monthly: true, program: true },
  { label: 'Interview readiness score and feedback', monthly: true, program: true },
  { label: 'Recorded courses and LMS', monthly: false, program: true },
  { label: 'Two live classes a day (1.5 hours each)', monthly: false, program: true },
  { label: 'Daily trainer mentoring', monthly: false, program: true },
  { label: 'Daily PM calls', monthly: false, program: true },
  { label: 'Weekly online tests', monthly: false, program: true },
  { label: 'Weekly mock interviews', monthly: 'Initial review', program: true },
  { label: 'Company simulation drives', monthly: false, program: true },
  { label: 'Company exposure target', monthly: false, program: '1 to 2 a month' },
  { label: 'Internship (1 to 2 months)', monthly: false, program: 'Subject to eligibility' },
  { label: 'Company referral support', monthly: 'After clearing the review', program: 'After basic requirements and review' },
]

export const PLANS = [
  { id: 'monthly', key: 'monthly', name: 'Monthly Career Support', price: 'Evaluation & referral', per: 'track',
    who: 'Already have the skills? Get evaluated and enter the referral pipeline if you are ready.', form: FORM_LINKS.monthly },
  { id: 'program', key: 'program', name: 'Career Development Program', price: 'Complete mentoring', per: 'program',
    who: 'Structured live training, daily mentoring, weekly evaluation and career support.', form: FORM_LINKS.program, best: true },
]
