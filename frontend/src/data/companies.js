// Company-wise "Crack the Company" guides.
//
// How this was put together: the hiring stages, patterns and FAQs below are written in our own words from public
// information (company careers pages, preparation sites and the write-ups candidates shared on
// interviewexperiences.in). Numbers under `reported` are what those candidates reported about themselves: a small,
// self-selected sample, so treat them as hints and not as official statistics. Hiring processes change often, so
// students must always check the latest job post and the offer mail. Real candidate experiences are linked, not copied.
//
// type: 'service' | 'product' | 'consulting'

export const TYPES = [
  { id: 'all', label: 'All' },
  { id: 'service', label: 'IT services' },
  { id: 'consulting', label: 'Consulting' },
  { id: 'product', label: 'Product' },
]
export const TYPE_LABEL = { service: 'IT services', product: 'Product company', consulting: 'Consulting' }

const IE = 'https://interviewexperiences.in'
const hub = (slug) => `${IE}/company/${slug}`
const exp = (slug, path, title, tag) => ({ title, tag, url: `${IE}/experience/${slug}/${path}` })

export const SOURCES = [
  { name: 'Interview Experiences', url: 'https://interviewexperiences.in/', text: 'Company-wise write-ups from candidates, with the questions they were asked and their outcome.' },
  { name: 'Just Crack Interview', url: 'https://www.justcrackinterview.com/', text: 'Interview questions by topic (aptitude, reasoning, DBMS, networking, HR) and preparation articles.' },
]

export const COMPANIES = [
  // ---------------------------------------------------------------- TCS
  {
    id: 'tcs', name: 'TCS', type: 'service', color: '#2563EB',
    tagline: 'India’s biggest fresher hirer: an aptitude-first test, then technical, managerial and HR.',
    glance: [['Hires', 'Freshers in large batches'], ['Entry roles', 'Ninja, Digital, Prime tiers'], ['Entry test', 'TCS NQT'], ['Difficulty', 'Easy to medium, speed matters']],
    reported: { source: 'interviewexperiences.in, 26 write-ups', text: 'Candidates rated 55% of questions easy and 38% medium. Topics reported: behavioural 29%, DSA 29%, other (OOP, SQL, projects) 36%.' },
    process: [
      { t: 'Apply and register', d: 'Register for the TCS NQT on the official TCS portal (or through campus). Keep your resume and academic details ready.' },
      { t: 'TCS NQT online test', d: 'A timed test covering numerical, verbal and reasoning ability, programming logic and a hands-on coding section. Your score decides the tier you are considered for.' },
      { t: 'Technical interview', d: 'A panel or one-to-one conversation about your language, core subjects, SQL and projects.' },
      { t: 'Managerial round', d: 'Checks how you handle pressure, teamwork and situations. Often merged with the technical or HR round.' },
      { t: 'HR round and offer', d: 'Communication, relocation, shift flexibility and the service agreement are discussed.' },
    ],
    rounds: [
      { n: 'TCS NQT (online)', f: 'About 3 hours in total. Sections reported: numerical (26 questions), verbal (24), reasoning (30), programming logic (10) and a hands-on coding section with 2 problems.', w: ['Speed and accuracy in aptitude', 'Reading pseudocode and finding the output', 'Writing working code in C, C++, Java, Python or Perl'], p: 'Practise full timed mocks. Aim to finish aptitude with time to spare, then spend the saved time on coding.' },
      { n: 'Technical interview', f: '20 to 40 minutes, usually about your resume.', w: ['One programming language in depth', 'OOP, SQL, DBMS and basic data structures', 'Your project: problem, design, your own role'], p: 'For every skill on your resume, prepare three questions you would ask yourself and answer them aloud.' },
      { n: 'Managerial / HR', f: '10 to 20 minutes, conversational.', w: ['Communication and confidence', 'Willingness to relocate and learn', 'Honesty about strengths and weaknesses'], p: 'Prepare crisp answers for "Tell me about yourself", "Why TCS?" and "Where do you see yourself in three years?".' },
    ],
    faqs: [
      { q: 'Is there negative marking in the TCS NQT?', a: 'Reports on this differ between sections and years. Read the instructions on the current test page before you start, and do not guess blindly in sections that mention negative marking.' },
      { q: 'How many times can I attempt the NQT?', a: 'TCS allows repeated attempts in some cycles, but rules change. Confirm the current rule on the official registration page.' },
      { q: 'What coding level should I expect?', a: 'Mostly easy to medium problems: strings, arrays, simple maths, pattern printing and basic simulation (for example fee calculators or duplicate detection).' },
      { q: 'What decides Ninja, Digital or Prime?', a: 'Your NQT score and performance across rounds. Higher scores and stronger coding open the Digital and Prime tracks.' },
      { q: 'Do they ask about my final-year project?', a: 'Yes, very often. Know your tech stack, your own contribution and one thing that went wrong and how you fixed it.' },
    ],
    patterns: [
      { t: 'Strings and arrays', l: 'Easy', ex: ['Reverse words, check palindromes, count characters', 'Find duplicates or the second largest element', 'Integer to Roman numeral conversion'] },
      { t: 'Number problems', l: 'Easy', ex: ['Prime, Armstrong, GCD and LCM', 'Digit sum and number series'] },
      { t: 'Simulation / business logic', l: 'Easy–Medium', ex: ['Fee or bill calculators with conditions', 'Detecting duplicate transactions in a list'] },
      { t: 'SQL and DBMS', l: 'Easy', ex: ['Joins, group by, subqueries', 'Normalisation and keys'] },
      { t: 'OOP and basics', l: 'Easy', ex: ['Four pillars of OOP with examples', 'Pointers (C/C++), exceptions, constructors'] },
    ],
    experiences: [
      exp('tcs', 'tcs-nqt-2026-april-1', 'TCS NQT 2026: April 1 slot', 'Test'),
      exp('tcs', 'tcs-ninja-interview-experience', 'TCS Ninja interview experience', 'Fresher'),
      exp('tcs', 'tcs-prime-interview-experience', 'TCS Prime interview experience', 'Fresher'),
      exp('tcs', 'tcs-nqt-2026-coding-questions-gym-fees-duplicate-transaction', 'TCS NQT 2026 coding questions', 'Coding'),
      exp('tcs', 'tcs-digital-interview-experience-17-yoe-selected', 'TCS Digital interview, 1.7 years experience', 'Selected'),
    ],
    hub: hub('tcs'),
  },

  // ---------------------------------------------------------------- Infosys
  {
    id: 'infosys', name: 'Infosys', type: 'service', color: '#0EA5E9',
    tagline: 'A timed online assessment with reasoning and coding, then a technical and HR interview.',
    glance: [['Hires', 'Freshers and experienced'], ['Entry roles', 'System Engineer, DSE, Specialist Programmer'], ['Entry test', 'Online assessment (campus or off-campus)'], ['Difficulty', 'Easy to medium, harder for specialist roles']],
    reported: { source: 'interviewexperiences.in, 31 write-ups', text: 'About 54% of reported questions were DSA, 31% DBMS and technical concepts, 10% behavioural. Candidates rated 40% easy, 40% medium, 19% hard.' },
    process: [
      { t: 'Online assessment', d: 'A timed test with reasoning, quantitative, verbal and pseudocode or coding questions. Many candidates are filtered out here.' },
      { t: 'Coding round (for DSE / SP roles)', d: 'Higher roles add a coding round with one or two problems of medium level.' },
      { t: 'Technical interview', d: 'Questions on your language, OOP, DBMS, SQL and the project on your resume.' },
      { t: 'HR interview', d: 'Communication, location, joining and background verification topics.' },
    ],
    rounds: [
      { n: 'Online assessment', f: 'Timed sections for reasoning, maths, verbal and technical questions; coding appears for higher roles.', w: ['Logical and puzzle-style reasoning', 'Pseudocode and output prediction', 'Basic to medium coding'], p: 'Practise puzzles daily and solve pseudocode questions without running them.' },
      { n: 'Technical interview', f: '20 to 30 minutes. Some candidates also report a paper coding session or a code review.', w: ['DBMS: ACID properties, indexing, views, normalisation', 'OOP: inheritance types, polymorphism', 'A coding problem such as LRU cache or string DP (higher roles)'], p: 'Revise DBMS and OOP with examples, and practise writing code on paper.' },
      { n: 'HR interview', f: '10 to 15 minutes.', w: ['Clear communication', 'Stability and attitude', 'Questions about relocation and shifts'], p: 'Be honest, calm and brief. Prepare questions to ask the interviewer.' },
    ],
    faqs: [
      { q: 'Which technical topics are asked most?', a: 'Candidates repeatedly report ACID properties, indexing and views in DBMS, types of inheritance, and classic problems such as LRU cache and edit-distance style string questions.' },
      { q: 'Is the online assessment the hardest part?', a: 'Many write-ups describe being rejected at the assessment, so treat it seriously: timed practice matters more than reading theory.' },
      { q: 'What is the difference between System Engineer and Specialist Programmer?', a: 'Specialist Programmer and DSE roles expect stronger DSA and a harder coding round, with a higher package.' },
      { q: 'Do they ask SQL?', a: 'Yes. Be ready to write joins, group by with having, and simple subqueries.' },
    ],
    patterns: [
      { t: 'Arrays and strings', l: 'Easy–Medium', ex: ['Two-pointer and sliding-window basics', 'Frequency counting'] },
      { t: 'Dynamic programming (basic)', l: 'Medium', ex: ['Delete operation for two strings', 'Longest common subsequence idea'] },
      { t: 'Design-style coding', l: 'Medium', ex: ['LRU cache with a hash map and linked list'] },
      { t: 'DBMS', l: 'Easy', ex: ['ACID, indexing, views, normalisation, joins'] },
      { t: 'OOP', l: 'Easy', ex: ['Types of inheritance, overloading vs overriding'] },
    ],
    experiences: [
      exp('infosys', 'infosys-on-campus-oa-sedse-interview', 'Infosys on-campus OA to SE and DSE interview', 'Not selected'),
      exp('infosys', 'infosys-dse-interview-experience-selected', 'Infosys DSE interview experience', 'Selected'),
      exp('infosys', 'infosys-interview-experience-2-yoe', 'Infosys interview, 2 years experience', 'Experienced'),
      exp('infosys', 'infosys-oncampus-interview-experience-for-dsesp-role', 'Infosys on-campus interview, DSE and SP role', 'Fresher'),
      exp('infosys', 'infosys-specialist-programmer-l3-interview-experience', 'Infosys Specialist Programmer L3 interview', 'Specialist'),
    ],
    hub: hub('infosys'),
  },

  // ---------------------------------------------------------------- Wipro
  {
    id: 'wipro', name: 'Wipro', type: 'service', color: '#7C3AED',
    tagline: 'An online assessment with a written communication task, then technical and HR interviews.',
    glance: [['Hires', 'Freshers through campus and off-campus drives'], ['Entry roles', 'Project Engineer (Elite and Turbo style)'], ['Entry test', 'Online assessment with an essay'], ['Difficulty', 'Easy to medium']],
    process: [
      { t: 'Apply or campus drive', d: 'Register on the Wipro careers page or through your college placement cell.' },
      { t: 'Online assessment', d: 'Aptitude (quantitative, logical, verbal), a short coding section and a written communication task.' },
      { t: 'Technical interview', d: 'Fundamentals of your language, DBMS, OS and your project.' },
      { t: 'HR interview', d: 'Communication, location and flexibility questions, then the offer.' },
    ],
    rounds: [
      { n: 'Online assessment', f: 'Timed sections: aptitude, logical, verbal, coding and an essay or email-writing task.', w: ['Accuracy in aptitude', 'Simple coding with correct input and output', 'Clear writing with correct grammar'], p: 'Write one 200-word essay every day for two weeks and ask a friend to mark the grammar.' },
      { n: 'Technical interview', f: '15 to 30 minutes about your resume.', w: ['C, C++ or Java basics, DBMS and SQL', 'OS: scheduling and deadlocks', 'Your project'], p: 'Revise the core subjects named on your resume and be ready for simple code on paper.' },
      { n: 'HR interview', f: '10 to 15 minutes.', w: ['Communication and attitude', 'Reasons for choosing Wipro'], p: 'Prepare a short self-introduction and two honest strengths with examples.' },
    ],
    faqs: [
      { q: 'Is there an essay in the Wipro test?', a: 'Candidates commonly report a written communication task. Practise short, structured writing and avoid grammar mistakes.' },
      { q: 'What technical questions come up?', a: 'Mostly conceptual: language basics, DBMS and SQL, OS and simple networking.' },
      { q: 'Is the test name always the same?', a: 'No. The name and format change between years, so follow the instructions in your invite mail.' },
    ],
    patterns: [
      { t: 'Aptitude and reasoning', l: 'Easy–Medium', ex: ['Percentages, ratios, time and work', 'Series, coding-decoding and arrangement puzzles'] },
      { t: 'Basic coding', l: 'Easy', ex: ['Strings, arrays and number programs'] },
      { t: 'Technical concepts', l: 'Easy', ex: ['SQL queries, normalisation, OS scheduling, OOP'] },
    ],
    experiences: [],
    hub: hub('wipro'),
  },

  // ---------------------------------------------------------------- Cognizant
  {
    id: 'cognizant', name: 'Cognizant', type: 'service', color: '#0F766E',
    tagline: 'A multi-step GenC style process: assessment, communication check, technical and HR rounds.',
    glance: [['Hires', 'Freshers in campus and off-campus drives'], ['Entry roles', 'Programmer Analyst Trainee (GenC family)'], ['Entry test', 'Online assessment'], ['Difficulty', 'Easy to medium']],
    process: [
      { t: 'Registration', d: 'Apply through campus or the Cognizant careers page and complete your profile.' },
      { t: 'Online assessment', d: 'Aptitude, logical reasoning, communication and basic coding or technical questions.' },
      { t: 'Communication check', d: 'A spoken or written test that looks at clarity and confidence.' },
      { t: 'Technical interview', d: 'Programming basics, SQL and your project.' },
      { t: 'HR interview and offer', d: 'Background, location and joining discussion.' },
    ],
    rounds: [
      { n: 'Online assessment', f: 'Timed sections: aptitude, reasoning, English and coding.', w: ['Quantitative aptitude', 'Logical reasoning', 'Basic coding'], p: 'Take timed mocks and keep a notebook of the shortcuts that save you time.' },
      { n: 'Technical interview', f: '20 to 30 minutes.', w: ['One language, OOP, SQL', 'A simple coding question', 'Project explanation'], p: 'Revise SQL joins and group by; practise explaining your project in two minutes.' },
      { n: 'HR interview', f: '10 to 15 minutes.', w: ['Confidence and clarity', 'Willingness to learn'], p: 'Speak slowly, keep eye contact on camera and avoid memorised paragraphs.' },
    ],
    faqs: [
      { q: 'What is GenC?', a: 'It is Cognizant’s fresher hiring programme with different tracks for different pay and skill levels. Read the current job post for the exact tracks.' },
      { q: 'How important is spoken English?', a: 'Very. Cognizant puts clear communication up front, so practise speaking about yourself and your project.' },
      { q: 'What coding is asked?', a: 'Basic problems: strings, arrays, simple logic and SQL queries.' },
    ],
    patterns: [
      { t: 'Aptitude', l: 'Easy–Medium', ex: ['Percentages, profit and loss, time and distance'] },
      { t: 'Coding basics', l: 'Easy', ex: ['String and array problems with input handling'] },
      { t: 'SQL', l: 'Easy', ex: ['Joins, aggregate functions, subqueries'] },
    ],
    experiences: [],
    hub: hub('cognizant'),
  },

  // ---------------------------------------------------------------- Accenture
  {
    id: 'accenture', name: 'Accenture', type: 'consulting', color: '#9333EA',
    tagline: 'A cognitive and technical assessment, coding, then a communication-focused interview.',
    glance: [['Hires', 'Freshers and lateral hires'], ['Entry roles', 'Associate Software Engineer, Advanced Application Engineer'], ['Entry test', 'Cognitive and technical assessment'], ['Difficulty', 'Easy to medium']],
    reported: { source: 'interviewexperiences.in, 9 write-ups', text: 'Behavioural questions made up about 75% of reported questions and 75% were rated easy. Some processes were a short HR chat with no live coding.' },
    process: [
      { t: 'Online assessment', d: 'Cognitive ability (logic, maths, verbal) plus technical MCQs on pseudocode, networking, cloud and security basics.' },
      { t: 'Coding assessment', d: 'One or two problems in the language of your choice for higher roles.' },
      { t: 'Communication assessment', d: 'A spoken or written round that checks clarity and grammar.' },
      { t: 'Technical and HR interview', d: 'Often short. Tests basics, your project and your attitude.' },
    ],
    rounds: [
      { n: 'Cognitive and technical assessment', f: 'Timed MCQ sections.', w: ['Logical and numerical reasoning', 'Pseudocode and debugging', 'Cloud, networking and security basics'], p: 'Read a short overview of cloud, networking and cybersecurity: these show up as one-mark questions.' },
      { n: 'Coding round', f: 'One or two problems, timed.', w: ['Correct output for all test cases', 'Basic data structures'], p: 'Practise handling input and output and edge cases, not only the core logic.' },
      { n: 'HR / behavioural interview', f: '10 to 20 minutes, sometimes very short.', w: ['"Introduce yourself" and "Why Accenture?"', 'Strengths and weaknesses', 'Questions you ask the interviewer'], p: 'Prepare one story each for teamwork, learning fast and handling a mistake.' },
    ],
    faqs: [
      { q: 'What questions are repeated most?', a: 'Candidates keep reporting "Introduce yourself", "Why Accenture?", strengths and weaknesses, and "Do you have questions for us?".' },
      { q: 'Will there be live coding in the interview?', a: 'Not always. Some candidates report only a short HR and behavioural conversation, while others had a coding round earlier.' },
      { q: 'What should I read for the technical MCQs?', a: 'Basics of cloud computing, networking, security, OOP and pseudocode reading.' },
    ],
    patterns: [
      { t: 'Cognitive reasoning', l: 'Easy–Medium', ex: ['Series, blood relations, seating arrangement'] },
      { t: 'Pseudocode and MCQs', l: 'Easy', ex: ['Output prediction, loops, recursion'] },
      { t: 'Coding', l: 'Easy', ex: ['Strings and arrays with correct input and output'] },
      { t: 'Behavioural', l: 'Easy', ex: ['Teamwork, deadlines, conflict, learning from failure'] },
    ],
    experiences: [
      exp('accenture', 'accenture-campus-hiring-experience-2026', 'Accenture campus hiring experience 2026', 'Fresher'),
      exp('accenture', 'accenture-interview-experience-2026-oncampus-fresher-aase-role65-lpa-complete-process', 'Accenture on-campus interview 2026, AASE role', 'Selected'),
      exp('accenture', 'accenture-interview-experience-2024-fresher-ase-role-full-interview-process', 'Accenture interview 2024, ASE role, full process', 'Fresher'),
      exp('accenture', 'accenture-advanced-application-engineering-analyst-2024fte', 'Accenture Advanced Application Engineering Analyst 2024', 'Fresher'),
      exp('accenture', 'accenture-on-campus-interview-experience-internship', 'Accenture on-campus internship interview', 'Internship'),
    ],
    hub: hub('accenture'),
  },

  // ---------------------------------------------------------------- Capgemini
  {
    id: 'capgemini', name: 'Capgemini', type: 'consulting', color: '#0284C7',
    tagline: 'Game-based aptitude, pseudocode and a technical plus HR conversation.',
    glance: [['Hires', 'Freshers through campus and off-campus'], ['Entry roles', 'Analyst and Senior Analyst'], ['Entry test', 'Game-based and technical assessment'], ['Difficulty', 'Easy to medium']],
    process: [
      { t: 'Online assessment', d: 'Game-based aptitude and behavioural tasks, plus technical MCQs and pseudocode.' },
      { t: 'Communication test', d: 'A short English test (written and spoken) in many drives.' },
      { t: 'Technical interview', d: 'Fundamentals, SQL and your project.' },
      { t: 'HR interview', d: 'Attitude, location and joining.' },
    ],
    rounds: [
      { n: 'Online assessment', f: 'Game-style aptitude, pseudocode and technical MCQs.', w: ['Quick logical decisions', 'Pseudocode reading', 'DBMS, OOP and networking basics'], p: 'Try game-style practice so the format does not surprise you.' },
      { n: 'Technical interview', f: '15 to 30 minutes.', w: ['OOP and DBMS concepts', 'Basic coding', 'Project discussion'], p: 'Revise normalisation, OOP pillars and one clean explanation of your project.' },
      { n: 'HR interview', f: '10 to 15 minutes.', w: ['Communication and honesty', 'Flexibility on location'], p: 'Be positive about learning and clear about your goals.' },
    ],
    faqs: [
      { q: 'What is the game-based round?', a: 'A set of short interactive games that measure logic, memory and decision speed. They are not about coding.' },
      { q: 'Is a coding round included?', a: 'It depends on the role and year. Prepare basic coding anyway.' },
    ],
    patterns: [
      { t: 'Pseudocode', l: 'Easy–Medium', ex: ['Loops, arrays, recursion and output prediction'] },
      { t: 'Technical MCQs', l: 'Easy', ex: ['DBMS, OOP, networking, operating systems'] },
    ],
    experiences: [],
    hub: hub('capgemini'),
  },

  // ---------------------------------------------------------------- Deloitte
  {
    id: 'deloitte', name: 'Deloitte', type: 'consulting', color: '#16A34A',
    tagline: 'Assessment plus case and interview rounds that value structured thinking and communication.',
    glance: [['Hires', 'Freshers and experienced analysts'], ['Entry roles', 'Analyst, Associate Analyst (technology and consulting)'], ['Entry test', 'Online aptitude and technical test'], ['Difficulty', 'Medium']],
    process: [
      { t: 'Online assessment', d: 'Aptitude, logical reasoning and a technical or coding section depending on the role.' },
      { t: 'Group or case discussion', d: 'Some drives add a group discussion or a short case to see how you think and speak.' },
      { t: 'Technical interview', d: 'Depth in your domain: coding, SQL, cloud or analytics.' },
      { t: 'Managerial / HR interview', d: 'Professionalism, motivation and fit.' },
    ],
    rounds: [
      { n: 'Online assessment', f: 'Timed aptitude, reasoning and technical questions.', w: ['Numerical reasoning', 'Logical puzzles', 'Role-specific technical basics'], p: 'Do full mocks and review every wrong answer.' },
      { n: 'Technical interview', f: '20 to 40 minutes.', w: ['Your chosen domain in depth', 'Projects and tools', 'Problem solving aloud'], p: 'Choose two strong topics and be able to go deep on both.' },
      { n: 'Managerial / HR', f: '15 to 30 minutes.', w: ['Structured answers', 'Motivation and teamwork', 'Awareness of technology and business news'], p: 'Use a simple structure (situation, action, result) for every answer.' },
    ],
    faqs: [
      { q: 'Is there a group discussion?', a: 'In some drives, yes. Listen first, add a clear point, and summarise when the group gets stuck.' },
      { q: 'How technical is it?', a: 'It depends on the role. Technology roles ask coding, SQL and cloud basics; consulting roles weigh structured thinking more.' },
    ],
    patterns: [
      { t: 'Aptitude and data interpretation', l: 'Medium', ex: ['Charts, tables and percentage questions'] },
      { t: 'SQL and databases', l: 'Easy–Medium', ex: ['Joins, window functions basics, aggregation'] },
      { t: 'Coding basics', l: 'Easy–Medium', ex: ['Strings, arrays, hash maps'] },
    ],
    experiences: [],
    hub: hub('deloitte'),
  },

  // ---------------------------------------------------------------- Amazon
  {
    id: 'amazon', name: 'Amazon', type: 'product', color: '#EA580C',
    tagline: 'Coding assessment, DSA interviews and a strong leadership-principles round.',
    glance: [['Hires', 'SDE interns, freshers and experienced'], ['Entry roles', 'SDE I, SDE II, support engineering'], ['Entry test', 'Online assessment with coding and work-style questions'], ['Difficulty', 'Medium, with some hard problems']],
    reported: { source: 'interviewexperiences.in', text: 'Candidates reported a large pool of coding questions, mostly medium: graphs, dynamic programming, heaps, stacks and queues, binary search, sliding windows and LRU cache. Behavioural rounds are a major part of the process.' },
    process: [
      { t: 'Online assessment', d: 'Two coding problems and work-style or situational questions, timed.' },
      { t: 'Technical interviews', d: 'One to three rounds of data structures, algorithms and code quality.' },
      { t: 'Low-level or system design', d: 'More weight for experienced roles: design a rate limiter, parking lot or URL shortener.' },
      { t: 'Bar raiser / behavioural', d: 'A deep conversation about leadership principles and past projects, with detailed follow-ups.' },
    ],
    rounds: [
      { n: 'Online assessment', f: 'Timed coding plus situational judgement.', w: ['Correct solutions that pass all tests', 'Clean, readable code', 'Consistent work-style choices'], p: 'Solve medium problems under a timer and always test edge cases.' },
      { n: 'Coding interviews', f: '45 to 60 minutes each.', w: ['Graphs, trees, heaps, hashing, sliding window, DP', 'Talking through your approach', 'Time and space complexity'], p: 'State a brute force first, then improve, then code, then test with examples.' },
      { n: 'Leadership principles', f: '45 to 60 minutes of stories.', w: ['Ownership, customer focus, bias for action, dive deep', 'Conflict, failure and tight deadlines'], p: 'Write six to eight STAR stories and map each to two or three principles.' },
    ],
    faqs: [
      { q: 'What are the leadership principles?', a: 'A published list of values such as customer obsession, ownership, bias for action and dive deep. Read them on Amazon’s careers site and prepare stories for each.' },
      { q: 'What is the bar raiser?', a: 'An interviewer from another team who checks that a hire raises the overall bar. Candidates describe a long round of behavioural follow-ups.' },
      { q: 'Do freshers get system design?', a: 'Usually a lighter version: object-oriented or low-level design. Heavier system design is for experienced roles.' },
      { q: 'Which coding topics matter most?', a: 'Graphs (BFS, DFS, topological sort), dynamic programming, heaps, stacks and queues, binary search and sliding window.' },
    ],
    patterns: [
      { t: 'Graphs', l: 'Medium', ex: ['BFS and DFS on grids', 'Topological sort (course schedule)'] },
      { t: 'Heaps and sorting', l: 'Medium', ex: ['Top K frequent elements', 'Merge intervals'] },
      { t: 'Dynamic programming', l: 'Medium–Hard', ex: ['Knapsack-style and string DP'] },
      { t: 'Design-style coding', l: 'Medium', ex: ['LRU cache', 'Rate limiter', 'Parking lot (low-level design)'] },
    ],
    experiences: [],
    hub: `${IE}/company/amazon/interview-questions`,
  },

  // ---------------------------------------------------------------- Microsoft
  {
    id: 'microsoft', name: 'Microsoft', type: 'product', color: '#0078D4',
    tagline: 'An online assessment, then coding, design and behavioural rounds that value fundamentals.',
    glance: [['Hires', 'Interns, freshers and experienced'], ['Entry roles', 'SDE, SWE II'], ['Entry test', 'Online coding assessment'], ['Difficulty', 'Medium to hard']],
    reported: { source: 'interviewexperiences.in, 153 write-ups', text: 'Reported topics: DSA about 49%, system design about 30%, behavioural 8%. Questions were rated medium 55% and hard 35%. About 53% of candidates who shared a result reported an offer.' },
    process: [
      { t: 'Online assessment', d: 'A timed coding test, sometimes on HackerRank, with two or three problems.' },
      { t: 'Coding rounds', d: 'One or two interviews on data structures and algorithms.' },
      { t: 'Design round', d: 'Low-level design (classes and interfaces) and, for experienced roles, high-level system design.' },
      { t: 'Hiring manager / behavioural', d: 'Project deep dive, teamwork, growth mindset and "Why Microsoft?".' },
    ],
    rounds: [
      { n: 'Online assessment', f: 'Timed coding problems.', w: ['Medium-level DSA', 'Edge cases and correctness'], p: 'Practise 60-minute sets of two problems and review them afterwards.' },
      { n: 'Coding interviews', f: '45 to 60 minutes.', w: ['Arrays, linked lists, trees, graphs, heaps', 'Clear explanation before coding', 'Testing your own code'], p: 'Talk through a simple solution first, then improve it. Always dry-run your code.' },
      { n: 'Design and behavioural', f: '45 to 60 minutes each.', w: ['Rate limiter, elevator system, LRU cache', 'Ownership and learning from failure'], p: 'Practise designing small systems on paper with clear classes and methods.' },
    ],
    faqs: [
      { q: 'Which questions are asked again and again?', a: 'Candidates report "Why Microsoft?", design a rate limiter, design an elevator system, implement an LRU cache and meeting rooms II.' },
      { q: 'How much system design for a fresher?', a: 'Mostly low-level design. High-level design becomes more important from SDE II.' },
      { q: 'What do they look for beyond coding?', a: 'Communication, collaboration and a growth mindset: show how you learn from feedback.' },
    ],
    patterns: [
      { t: 'Arrays, strings and hashing', l: 'Medium', ex: ['Meeting rooms II', 'Two-sum style and sliding window'] },
      { t: 'Trees and graphs', l: 'Medium–Hard', ex: ['BFS and DFS, tree views and lowest common ancestor'] },
      { t: 'Design', l: 'Medium', ex: ['LRU cache', 'Rate limiter', 'Elevator system'] },
    ],
    experiences: [
      exp('microsoft', 'microsoft-sde-2-interview-experience-3-yoe-offer-received', 'Microsoft SDE-2, 3 years experience', 'Offer'),
      exp('microsoft', 'microsoft-interview-experience-3-years-experience-system-design-ood-dsa-rejected', 'Microsoft, system design, OOD and DSA', 'Rejected'),
      exp('microsoft', 'my-microsoft-on-campus-internship-interview-experience', 'Microsoft on-campus internship interview', 'Internship'),
      exp('microsoft', 'sde-2-microsoft-interview-experience', 'SDE 2 Microsoft interview experience', 'Experienced'),
      exp('microsoft', 'microsoft-swe-ii-frontend-oct-2026', 'Microsoft SWE II frontend, Oct 2026', 'Frontend'),
    ],
    hub: hub('microsoft'),
  },

  // ---------------------------------------------------------------- Google
  {
    id: 'google', name: 'Google', type: 'product', color: '#DC2626',
    tagline: 'Algorithm-heavy interviews that test how you think, communicate and improve a solution.',
    glance: [['Hires', 'Freshers, interns and experienced'], ['Entry roles', 'Software Engineer (L3 and above)'], ['Entry test', 'Online assessment or phone screen'], ['Difficulty', 'Medium to hard']],
    reported: { source: 'interviewexperiences.in, 300+ write-ups', text: 'Around 77% of reported questions were DSA (graphs and BFS appear often), about half medium and 41% hard. System design was rare (about 4%). Many rejections were attributed to bugs in code or trouble with BFS approaches.' },
    process: [
      { t: 'Recruiter conversation / screen', d: 'A call about your background, followed by an online assessment or a phone coding screen.' },
      { t: 'Virtual onsite loop', d: 'Several back-to-back technical interviews on algorithms and data structures.' },
      { t: 'Googleyness / behavioural', d: 'How you collaborate, handle ambiguity and treat others.' },
      { t: 'Hiring committee and team match', d: 'A committee reviews feedback; some candidates then speak to teams before an offer.' },
    ],
    rounds: [
      { n: 'Phone / online screen', f: 'About 45 minutes, one or two problems.', w: ['A correct, bug-free solution', 'Explaining trade-offs'], p: 'Practise in a plain editor with no autocomplete and speak your thoughts aloud.' },
      { n: 'Technical loop', f: 'Three to five interviews of 45 minutes.', w: ['Graphs, BFS and DFS, arrays and strings, stacks, geometry', 'Optimising a first solution', 'Handling hints well'], p: 'After every practice problem ask: can I make it faster or use less memory?' },
      { n: 'Behavioural', f: '30 to 45 minutes.', w: ['Collaboration, humility, handling ambiguity'], p: 'Prepare stories with a clear role for you and a real lesson learned.' },
    ],
    faqs: [
      { q: 'Which topics should I focus on?', a: 'Graphs and BFS/DFS first, then arrays, strings, hashing, stacks and heaps. Reports mention recurring problems such as top K frequent elements.' },
      { q: 'Is system design asked?', a: 'Rarely for entry roles. Coding dominates the process.' },
      { q: 'Why do people get rejected?', a: 'Candidates mention bugs in the final code and struggling with graph traversal. Test with examples before you say you are done.' },
    ],
    patterns: [
      { t: 'Graphs and BFS', l: 'Medium–Hard', ex: ['Grid and shortest-path problems', 'Connected components'] },
      { t: 'Heaps and hashing', l: 'Medium', ex: ['Top K frequent elements', 'Streaming data problems'] },
      { t: 'Arrays and strings', l: 'Medium', ex: ['Intervals, sliding window, two pointers'] },
      { t: 'Geometry and math', l: 'Medium–Hard', ex: ['Counting shapes or points on a plane'] },
    ],
    experiences: [],
    hub: hub('google'),
  },
]

// Official logos (SVG from Wikimedia Commons) in public/logos/. Trademarks of their owners, shown only to identify each company.
const LEVEL = { tcs: 2, infosys: 3, wipro: 2, cognizant: 2, accenture: 2, capgemini: 2, deloitte: 3, amazon: 4, microsoft: 4, google: 5 } // 1 easy .. 5 very hard
COMPANIES.forEach((c) => { c.logo = `/logos/${c.id}.svg`; c.level = LEVEL[c.id] || 3 })
