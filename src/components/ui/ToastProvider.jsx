import { useCallback, useMemo, useRef, useState } from 'react'
import { ToastContext } from './toastContext'

function buildToastStyles(type) {
  if (type === 'error') {
    return {
      wrapper: 'border-red-500 bg-red-50 text-red-900',
      badge: 'bg-red-100 text-red-800',
      label: 'Error',
    }
  }

  return {
    wrapper: 'border-green-500 bg-green-50 text-green-900',
    badge: 'bg-green-100 text-green-800',
    label: 'Success',
  }
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef(new Map())

  const remove = useCallback((id) => {
    const timer = timersRef.current.get(id)
    if (timer) window.clearTimeout(timer)
    timersRef.current.delete(id)
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    ({ type = 'success', message, durationMs = 3000 } = {}) => {
      const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`
      setToasts((prev) => [{ id, type, message: String(message || '') }, ...prev].slice(0, 4))

      const timer = window.setTimeout(() => remove(id), Math.max(800, Number(durationMs || 0)))
      timersRef.current.set(id, timer)

      return id
    },
    [remove]
  )

  const api = useMemo(
    () => ({
      push,
      success: (message, opts) => push({ ...(opts || {}), type: 'success', message }),
      error: (message, opts) => push({ ...(opts || {}), type: 'error', message }),
      remove,
      clear: () => {
        for (const timer of timersRef.current.values()) {
          window.clearTimeout(timer)
        }
        timersRef.current.clear()
        setToasts([])
      },
    }),
    [push, remove]
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toasts.length ? (
        <section className="pointer-events-none fixed bottom-4 right-4 z-[9999] flex w-[min(92vw,420px)] flex-col gap-3">
          {toasts.map((t) => {
            const styles = buildToastStyles(t.type)
            return (
              <section
                key={t.id}
                className={`pointer-events-auto overflow-hidden rounded-xl border-l-4 ${styles.wrapper} shadow-[0px_8px_24px_rgba(0,0,0,0.12)]`}
              >
                <section className="flex items-start gap-3 p-4">
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}>
                    {styles.label}
                  </span>
                  <p className="flex-1 text-sm leading-5">
                    {t.message || (t.type === 'error' ? 'Action failed.' : 'Action successful.')}
                  </p>
                  <button
                    type="button"
                    className="shrink-0 rounded-md px-2 py-1 text-sm text-current/70 hover:bg-black/5 hover:text-current"
                    onClick={() => remove(t.id)}
                    aria-label="Close toast"
                  >
                    ×
                  </button>
                </section>
              </section>
            )
          })}
        </section>
      ) : null}
    </ToastContext.Provider>
  )
}
