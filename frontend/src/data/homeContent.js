// PLACEHOLDER CONTENT. Replace the ids/urls below with Chaitanya's real videos.
// `yt` is the part after "v=" in a YouTube link (youtube.com/watch?v=THIS_PART).
const DEMO = 'rfscVS0vtbw'
const YT = { dsa: '8hly31xKli0', python: 'rfscVS0vtbw', mern: '7CqJlxBYj-M', java: 'grEKMHGYyns', js: 'PkZNo7MFNFg' }

export const CAROUSEL = [
  { yt: YT.python, tag: 'Welcome', title: 'Start here: how Career with Chaitanya works', text: 'A two minute tour of roadmaps, mock interviews and openings.' },
  { yt: YT.dsa, tag: 'Success story', title: 'From campus to a first offer letter', text: 'What changed for students who followed the plan.' },
  { yt: YT.mern, tag: 'Interview tips', title: 'Crack the HR round with confidence', text: 'The questions that come up every time, and how to answer them.' },
  { yt: YT.java, tag: 'Open mic', title: 'Inside a CWC Open Mic session', text: 'Speak, get feedback and grow your confidence.' },
]

export const CARDS = [
  { to: '/open-mic', icon: 'mic', title: 'CWC Open Mic', text: 'Online and offline meets to speak up, network and learn from peers.' },
  { to: '/interview-simulator', icon: 'bot', title: 'Interview Simulator', text: 'Five realistic rounds, from aptitude to a one-to-one review.' },
  { to: '/roadmaps', icon: 'route', title: 'Roadmaps', text: 'Step-by-step paths for the role you are aiming at.' },
]

const mk = (yt) => (title) => ({ yt, title })
const V = { dsa: mk(YT.dsa), python: mk(YT.python), mern: mk(YT.mern), java: mk(YT.java) }

export const COURSES = [
  { id: 'dsa', label: 'DSA', blurb: 'Data structures and algorithms, from arrays to graphs.', videos: [
    V.dsa('DSA roadmap: where to start'), V.dsa('Arrays and strings in one sitting'),
    V.dsa('Linked lists explained'), V.dsa('Stacks and queues'),
    V.dsa('Recursion and backtracking'), V.dsa('Trees and graphs'),
  ] },
  { id: 'python', label: 'Python', blurb: 'Python from zero to writing real programs.', videos: [
    V.python('Python in 30 minutes'), V.python('Lists, dicts and sets'),
    V.python('Functions and modules'), V.python('OOP in Python'),
    V.python('Files and exceptions'), V.python('Mini project: build a CLI app'),
  ] },
  { id: 'mern', label: 'MERN Stack', blurb: 'MongoDB, Express, React and Node, end to end.', videos: [
    V.mern('MERN stack overview'), V.mern('Node and Express basics'),
    V.mern('MongoDB and Mongoose'), V.mern('React fundamentals'),
    V.mern('Connect frontend and backend'), V.mern('Deploy your MERN app'),
  ] },
  { id: 'java', label: 'Java', blurb: 'Core Java for placements and projects.', videos: [
    V.java('Java basics'), V.java('OOP concepts'), V.java('Collections framework'),
    V.java('Exception handling'), V.java('Multithreading primer'),
  ] },
]

export const STUDENT_VIDEOS = [
  { yt: YT.python, name: 'Student name', role: 'Software Engineer at Company' },
  { yt: YT.dsa, name: 'Student name', role: 'Data Analyst at Company' },
  { yt: YT.mern, name: 'Student name', role: 'Full-stack Developer at Company' },
  { yt: YT.java, name: 'Student name', role: 'Associate Engineer at Company' },
]

// `yt` = preview clip (placeholder). For a real LinkedIn video, add `mp4: 'https://.../clip.mp4'` instead
// (LinkedIn does not allow its own videos to be autoplayed from outside), and set `url` to the post.
export const LINKEDIN_VIDEOS = [
  { url: 'https://www.linkedin.com/', yt: YT.python, start: 40, name: 'Student name', role: 'Placed at Company', text: 'From learning Python to a first offer.' },
  { url: 'https://www.linkedin.com/', yt: YT.dsa, start: 120, name: 'Student name', role: 'Placed at Company', text: 'Cracked the technical round with DSA.' },
  { url: 'https://www.linkedin.com/', yt: YT.mern, start: 300, name: 'Student name', role: 'Placed at Company', text: 'Built a MERN project that got noticed.' },
]

export const OPEN_MIC = {
  demo: { yt: YT.python, title: 'See an Open Mic in action' },
  online: [
    { date: 'Every Saturday', time: '7:00 PM IST', place: 'Google Meet', text: 'Share a 3 minute talk, get feedback from mentors and peers.' },
    { date: 'Every Sunday', time: '6:00 PM IST', place: 'Zoom', text: 'Mock group discussions and Q&A with Chaitanya.' },
  ],
  offline: [
    { date: 'To be announced', time: '10:00 AM', place: 'City, Venue', text: 'In-person meet-up: speak, network and meet your mentors.' },
  ],
}

export const ROUNDS = [
  { n: 1, title: 'Aptitude', text: 'Quantitative and numerical ability under a timer.' },
  { n: 2, title: 'Reasoning', text: 'Logical and verbal reasoning, scored section by section.' },
  { n: 3, title: 'Technical round', text: 'Core concepts and problem solving for your target role.' },
  { n: 4, title: 'HR round', text: 'Introduction, strengths, salary talk and culture fit.' },
  { n: 5, title: '1 to 1 review', text: 'A personal feedback session with a mentor and an improvement plan.' },
]
