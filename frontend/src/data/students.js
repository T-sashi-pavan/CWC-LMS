// =====================================================================================================
// DRAFT / PLACEHOLDER STUDENT STORIES
// Every story, headline, quote and track below is INVENTED so the layout can be built and reviewed.
// Real people are named here, so none of this may go live as fact. Each entry has `placeholder: true`:
// the UI should hide the story text for placeholder entries in production and show only name, photo
// and video until the client confirms the real details (see the "information needed" table).
//
// Media: `photo` files are produced by the media script (WebP). Videos are the Cloudinary uploads from
// VIDEOS_LINKS.txt; build delivery URLs with cld() so every size/preview/poster comes from one source.
// =====================================================================================================

const CLD = 'https://res.cloudinary.com/kr5lzd8b/video/upload/'

// cld('v123/x.mp4', 'w_480,q_auto')        -> resized video
// cld('v123/x.mp4', 'so_2,du_4,w_360,ac_none,q_auto:low') -> 4 second muted preview clip
// poster('v123/x.mp4')                       -> WebP still frame
export const cld = (id, t = 'f_auto,q_auto') => `${CLD}${t}/${id}`
export const poster = (id, w = 480) => `${CLD}so_1,w_${w},q_auto,f_webp/${id.replace(/\.\w+$/, '.webp')}`
export const preview = (id) => cld(id, 'so_2,du_4,w_360,q_auto:low,ac_none')

export const STUDENTS = [
  {
    id: 'afsana', name: 'Afsana', track: 'generative-ai', photo: '/students/afsana.webp',
    full: 'v1794390102/afsana.mp4', meetups: 4,
    headline: 'From first prompt to teaching AI in classrooms',
    story: 'Afsana started with curiosity about how chatbots think. A few months of Generative AI practice later, Afsana was explaining AI to school students at community sessions.',
    quote: 'Teaching it made me understand it twice as well.',
  },
  {
    id: 'aliya', name: 'Aliya', track: 'data-analyst', photo: null,
    short: 'v1794389676/aliya.mp4',
    headline: 'The spreadsheet that changed everything',
    story: 'Aliya never liked numbers until a messy sales sheet turned into a clean dashboard. That small win turned into a full Data Analyst roadmap.',
    quote: 'Once the chart made sense, I wanted to build ten more.',
  },
  {
    id: 'bharathi', name: 'Bharathi', track: 'python-full-stack', photo: null,
    short: 'v1794389694/bharathi.mp4',
    headline: 'One small app, one big confidence boost',
    story: 'Bharathi built a simple Python web app in week five and showed it in a mock interview. The interviewer asked for a second demo.',
    quote: 'Showing something I built beat any answer I had memorised.',
  },
  {
    id: 'bhavya', name: 'Bhavya', track: 'mern-stack', photo: '/students/bhavya.webp',
    short: 'v1794389675/bhavya.mp4',
    headline: 'Front end first, then the whole stack',
    story: 'Bhavya loved making things look right and followed the MERN roadmap to make them work too. The portfolio now has three deployed projects.',
    quote: 'Seeing my page go live on a real link was the best day of the course.',
  },
  {
    id: 'divya', name: 'Divya', track: 'data-science-genai', photo: '/students/divya.webp',
    full: 'v1794390132/divya.mp4',
    headline: 'Learning data science one notebook at a time',
    story: 'Divya studied a little every day and kept a notebook for every concept. The notebooks became a portfolio that did the talking in interviews.',
    quote: 'Small steps every day beat big plans on weekends.',
  },
  {
    id: 'gouthami', name: 'Gouthami', track: 'automation', photo: null,
    short: 'v1794389699/gouthami_video_2.mp4',
    headline: 'Automating the boring parts',
    story: 'Gouthami automated a repetitive reporting task as a practice lab and saved hours each week. The same project opened the first interview conversation.',
    quote: 'If I do something twice, I now ask how to make it automatic.',
  },
  {
    id: 'hamadi', name: 'Hamadi', track: 'devops-multi-cloud', photo: null,
    short: 'v1794389673/Hamadi.mp4',
    headline: 'Breaking things safely in the cloud',
    story: 'Hamadi learned by deploying, breaking and fixing small cloud setups. The habit of reading logs calmly became the standout skill in technical rounds.',
    quote: 'Every error message is a hint if you read it slowly.',
  },
  {
    id: 'jillasrivardhan', name: 'Jilla Srivardhan', track: 'java-full-stack', photo: '/students/jillasrivardhan.webp',
    headline: 'Steady progress through Java',
    story: 'Srivardhan worked through the Java Full Stack roadmap phase by phase and tracked every lab. Consistency, not speed, set the pace.',
    quote: 'One phase at a time felt slow, until I looked back.',
  },
  {
    id: 'mahendhar', name: 'Mahendhar', track: 'agentic-ai', photo: '/students/mahendhar.webp',
    short: 'v1794389698/mahendhar.mp4',
    headline: 'Building an AI agent that actually helps',
    story: 'Mahendhar built a small AI agent to answer study questions and kept improving it after every class. It became the centrepiece of the portfolio.',
    quote: 'My first agent was clumsy. My fifth one was useful.',
  },
  {
    id: 'manikumar', name: 'Mani Kumar', track: 'python-full-stack', photo: '/students/manikumar.webp',
    short: 'v1794389689/mani_kumar.mp4', full: 'v1794390183/manikumar.mp4',
    headline: 'From zero code to a full-stack project',
    story: 'Mani Kumar began with variables and loops and finished with a deployed full-stack app. The long journey is told in the full video.',
    quote: 'I did not need to be a genius, just to show up every day.',
  },
  {
    id: 'mounika', name: 'Mounika', track: 'data-analyst', photo: '/students/mounika.webp',
    full: 'v1794390112/mounika.mp4',
    headline: 'Telling stories with data',
    story: 'Mounika learned SQL and Power BI and then practised explaining dashboards out loud. The communication practice made the biggest difference.',
    quote: 'A chart nobody understands is just a picture.',
  },
  {
    id: 'narendra', name: 'Narendra', track: 'ai-engineering', photo: '/students/narendra.webp',
    full: 'v1794390113/Narendra.mp4', meetupVideo: 'v1794390133/narendra_meetup.mp4', meetupSeconds: 65,
    headline: 'Joining the meets changed how I explain things',
    story: 'Narendra attended the online meets to practise speaking about AI projects. Clearer explanations followed, and so did better interviews.',
    quote: 'Speaking about my project made me understand it better.',
  },
  {
    id: 'phanindra', name: 'Phanindra', track: 'forward-deployment', photo: '/students/phanindra.webp',
    meetupVideo: 'v1794390147/phanindhra_meetup.mp4', meetupSeconds: 250, meetupLandscape: true,
    headline: 'Learning to work with real customers',
    story: 'Phanindra took the Forward Deployment Engineer path to learn how to turn customer problems into working solutions. The meet-up session shows the thinking.',
    quote: 'The code is half of it; understanding the customer is the other half.',
  },
  {
    id: 'raju', name: 'Raju', track: 'mern-stack', photo: '/students/raju.webp',
    short: 'v1794389698/desing_raju_video_2.mp4', full: 'v1794390103/desing_raju.mp4',
    headline: 'Design eye, developer skills',
    story: 'Raju came from a design background and added the MERN stack. Pixel-perfect interfaces with real back ends became the signature.',
    quote: 'Good design and good code are the same discipline.',
  },
  {
    id: 'ramireddy', name: 'Rami Reddy', track: 'automation', photo: '/students/ramireddy.webp',
    headline: 'Practical automation, step by step',
    story: 'Rami Reddy worked through the automation labs and scripted small tools for everyday tasks. Each lab became a portfolio item.',
    quote: 'Start with one tiny script.',
  },
  {
    id: 'ramya', name: 'Ramya', track: 'generative-ai', photo: '/students/ramya.webp',
    full: 'v1794390146/ramya.mp4',
    headline: 'Prompting, then building',
    story: 'Ramya moved from writing prompts to building small LLM apps. Sharing each project in the community kept the motivation high.',
    quote: 'Share early. The feedback is the fastest teacher.',
  },
  {
    id: 'ravikiran', name: 'Ravi Kiran', track: 'devops-multi-cloud', photo: '/students/ravikiran.webp',
    headline: 'Learning the cloud the hands-on way',
    story: 'Ravi Kiran practised deploying the same app on different clouds and compared the results. The comparisons made interview answers concrete.',
    quote: 'Try it on two clouds and you will never forget the difference.',
  },
  {
    id: 'satish', name: 'Satish', track: 'java-full-stack', photo: '/students/satish.webp',
    full: 'v1794390128/satish.mp4',
    headline: 'Java foundations that held up under pressure',
    story: 'Satish focused on fundamentals first and revisited them before every interview. The calm, clear answers stood out.',
    quote: 'Fundamentals are what you fall back on when the question is new.',
  },
  {
    id: 'sravya', name: 'Sravya', track: 'ai-engineering', photo: null,
    seminar: true,
    headline: 'Sharing what I learned in a seminar',
    story: 'Sravya presented a seminar on what the AI Engineering path taught. Teaching a room full of people locked in the learning.',
    quote: 'If you can teach it, you own it.',
  },
  {
    id: 'srikeerthi', name: 'Srikeerthi', track: 'python-full-stack', photo: '/students/srikeerthi.webp',
    short: 'v1794389702/srikeerthi_video_1.mp4', short2: 'v1794389696/srikeerthi_video_2.mp4', meetups: 2,
    headline: 'Two videos, one steady climb',
    story: 'Srikeerthi recorded progress updates along the way, from first scripts to a working project. The meets added speaking practice on top.',
    quote: 'Looking back at my first video is the best motivation.',
  },
  {
    id: 'vijay', name: 'Vijay', track: 'data-science-genai', photo: null,
    short: 'v1794389699/vijay.mp4',
    headline: 'Curious about data, stubborn about finishing',
    story: 'Vijay picked a messy dataset and stayed with it until the model made sense. Finishing the project mattered more than the score.',
    quote: 'I finish what I start, even when the data fights back.',
  },
].map((s) => ({ placeholder: true, ...s }))

// Set to false before launch: the stories above are invented placeholders about real people.
// When false, cards show only the name, photo and video until the client confirms real details.
export const SHOW_SAMPLE_STORIES = true

export const TRACK_LABEL = {
  'generative-ai': 'Generative AI', 'agentic-ai': 'Agentic AI', 'ai-engineering': 'AI Engineering',
  'data-analyst': 'Data Analyst', 'data-science-genai': 'Data Science + GenAI', 'python-full-stack': 'Python Full Stack',
  'mern-stack': 'MERN Stack', 'java-full-stack': 'Java Full Stack', 'devops-multi-cloud': 'DevOps & Cloud',
  'automation': 'Automation', 'forward-deployment': 'Forward Deployment',
}

// the main video for a student (short story first, then the others)
export const mainVideo = (s) => s.short || s.full || s.short2 || s.meetupVideo || null
export const STORIES = STUDENTS.filter(mainVideo)

// Fixed information we need from the client for every student before launch.
export const INFO_NEEDED = [
  'Full name (and the exact spelling to display)',
  'Photo (if missing): see the "no photo" list in the plan',
  'Current role and company, or "learning / seeking" status',
  'Roadmap or course they followed',
  'Batch / year',
  'A real quote or a 1-2 line story, in their own words',
  'Permission to publish name, photo and video (written / messaged)',
  'LinkedIn profile or post URL, if they want it linked',
]
