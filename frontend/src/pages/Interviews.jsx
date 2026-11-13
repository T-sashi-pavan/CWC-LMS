import { PageHead } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { useToast } from '../context/ToastContext.jsx'

const INCLUDED = [
  { icon: 'mic', title: 'Personalized 1-on-1 mock interview', text: 'An individual interview built around your target job role, experience level and preparation needs.' },
  { icon: 'route', title: 'Multiple domains and roles', text: 'Python, Java, MERN, Full Stack Development, Data Science, Data Analytics, AI/ML, DevOps, Software Testing, MIS and other relevant roles.' },
  { icon: 'star', title: 'Structured performance evaluation', text: 'Assessed on role-specific technical knowledge, problem-solving, communication, confidence and project explanation.' },
  { icon: 'sparkle', title: 'Feedback and improvement plan', text: 'Understand your strengths, find what needs work, and get practical guidance to prepare for real interviews.' },
  { icon: 'briefcase', title: 'Company referral consideration', text: 'Candidates who clear the mock evaluation may be considered for relevant company interview opportunities, subject to role fit, eligibility and available openings.' },
]

const STEPS = [
  { t: 'Register and pay ₹499', d: 'Select your preferred domain and target role.' },
  { t: 'Attend your 1-on-1 mock interview', d: 'Take part in a structured, role-specific interview simulation.' },
  { t: 'Receive your evaluation', d: 'Get assessed on your performance and receive actionable feedback.' },
  { t: 'Clear the evaluation', d: 'Candidates who meet the criteria move to the referral consideration stage.' },
  { t: 'Be considered for opportunities', d: 'Eligible candidates may be referred for suitable company openings when available.' },
]

const WHO = [
  'Freshers preparing for their first technical or non-technical interview.',
  'Experienced professionals looking to change jobs or prepare for a new role.',
  'Candidates who want an objective assessment of their interview readiness.',
  'Job seekers who need help improving technical answers, communication or project explanations.',
]

export default function Interviews() {
  const toast = useToast()
  const book = () => toast('Booking opens very soon. We will let you know here.', { title: '1-on-1 mock interview' })
  return (
    <>
      <PageHead eyebrow="CWC ecosystem" title="1-on-1 mock interview program">
        Get interview-ready. Get evaluated. Get referred.
      </PageHead>

      <section className="mockhero">
        <div>
          <span className="eyebrow">Program fee</span>
          <h2>₹499</h2>
          <p>
            Prepare for your next opportunity with a personalized, one-on-one mock interview designed around your target role and domain.
            Get a realistic interview experience, a structured evaluation and actionable feedback to close your skill gaps.
          </p>
        </div>
        <button className="btn btn--lg" onClick={book}>Book your mock interview <Icon name="arrow" size={18} /></button>
      </section>

      <section className="section">
        <div className="section__head"><h2>What’s included</h2></div>
        <div className="mockgrid">
          {INCLUDED.map((x) => (
            <article key={x.title} className="card mockcard">
              <span className="tile__icon"><Icon name={x.icon} size={22} /></span>
              <h3>{x.title}</h3>
              <p className="muted">{x.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head"><h2>How the process works</h2></div>
        <ol className="mocksteps">
          {STEPS.map((s, i) => (
            <li key={s.t}><span className="mocksteps__n">{i + 1}</span><div><strong>{s.t}</strong><p className="muted">{s.d}</p></div></li>
          ))}
        </ol>
      </section>

      <section className="section">
        <div className="section__head"><h2>Who should join?</h2></div>
        <ul className="mockwho">
          {WHO.map((w) => <li key={w}><Icon name="star" size={16} /> {w}</li>)}
        </ul>
      </section>

      <section className="section">
        <div className="section__head"><h2>Why choose this program?</h2></div>
        <p className="mockwhy">
          A mock interview is more than a practice session. It shows how you perform under interview conditions, gives you focused feedback,
          and helps you work on the gaps that may affect your results. Our goal is to make you more confident, prepared and aligned with relevant job opportunities.
        </p>
        <p className="mocknote"><strong>Important note:</strong> The ₹499 fee covers the 1-on-1 mock interview and performance evaluation. Company referrals are considered only for candidates who clear the evaluation and are subject to eligibility, role suitability and available openings. Participation does not guarantee a job, interview call or placement.</p>
      </section>

      <section className="bigcta">
        <h2>Ready to test your interview skills?</h2>
        <p>Book your 1-on-1 mock interview · Program fee ₹499</p>
        <div className="hero__cta"><button className="btn btn--lg" onClick={book}>Book now</button></div>
      </section>
    </>
  )
}
