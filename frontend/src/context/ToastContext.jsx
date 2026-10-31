import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastCtx = createContext(null)
export const useToast = () => useContext(ToastCtx)

const ICONS = {
  info: <path d="M12 8h.01M11 12h1v5h1M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />,
  success: <path d="M8 12.5l3 3 5-6M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />,
  error: <path d="M12 8v5M12 16.5h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />,
}

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const id = useRef(0)

  const dismiss = useCallback((i) => setItems((l) => l.filter((t) => t.id !== i)), [])

  const toast = useCallback(
    (message, { type = 'info', title, duration = 4500 } = {}) => {
      const i = ++id.current
      setItems((l) => [...l.slice(-3), { id: i, message, type, title }])
      if (duration) setTimeout(() => dismiss(i), duration)
    },
    [dismiss],
  )

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="toasts" aria-live="polite" aria-atomic="false">
        {items.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`} role={t.type === 'error' ? 'alert' : 'status'}>
            <svg className="toast__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {ICONS[t.type]}
            </svg>
            <div className="toast__body">
              {t.title && <strong>{t.title}</strong>}
              <span>{t.message}</span>
            </div>
            <button className="toast__close" onClick={() => dismiss(t.id)} aria-label="Dismiss">×</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
