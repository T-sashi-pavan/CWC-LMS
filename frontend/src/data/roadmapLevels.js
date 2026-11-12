// Which roadmaps are for freshers and which for experienced people.
// PLACEHOLDER SPLIT: made up for now (there is no course/level data yet). Move a slug between the lists to change it,
// and ask the client to confirm. Any roadmap not listed here falls into "Experienced".
export const LEVELS = [
  {
    id: 'fresher',
    title: 'Freshers',
    badge: 'Starting out',
    text: 'New to the industry? Build a strong base with these beginner-friendly paths to your first job.',
    slugs: ['data-analyst', 'python-full-stack', 'mern-stack', 'java-full-stack', 'automation-engineering'],
  },
  {
    id: 'experienced',
    title: 'Experienced',
    badge: 'Level up',
    text: 'Already working or past the basics? Move into AI, data science and cloud with these advanced paths.',
    slugs: ['ai-engineering', 'generative-ai', 'agentic-ai', 'data-science-genai', 'devops-multi-cloud', 'forward-deployment'],
  },
]

export const levelOf = (slug) => (LEVELS[0].slugs.includes(slug) ? 'fresher' : 'experienced')
