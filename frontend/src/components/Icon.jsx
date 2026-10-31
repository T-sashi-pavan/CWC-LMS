// Outline icon set (24px grid, 1.6 stroke) so we never rely on emoji.
const P = {
  route: (<><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h8a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h8" /></>),
  mic: (<><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>),
  bot: (<><rect x="4" y="8" width="16" height="12" rx="3" /><path d="M12 8V4M9 14h.01M15 14h.01M2 14v2M22 14v2" /></>),
  briefcase: (<><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>),
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  lock: (<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>),
  eye: (<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>),
  eyeOff: (<><path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 8 10 8a17.3 17.3 0 0 1-3.17 4.19M6.6 6.6A17 17 0 0 0 2 12s3.5 8 10 8a9.7 9.7 0 0 0 5.4-1.6" /><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24M2 2l20 20" /></>),
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>),
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  quote: <path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
}

export default function Icon({ name, size = 20, className = '' }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {P[name]}
    </svg>
  )
}
