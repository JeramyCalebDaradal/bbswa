import { useState, useRef, useEffect, useCallback } from 'react'

const PRESET_COLORS = [
  { label: 'Default', value: '#000000' },
  { label: 'Dark Gray', value: '#4B5563' },
  { label: 'Gray', value: '#6B7280' },
  { label: 'BBS Orange', value: '#ffa800' },
  { label: 'Dark', value: '#2b2a2a' },
  { label: 'Muted', value: '#2d2626' },
  { label: 'Red', value: '#DC2626' },
  { label: 'Orange', value: '#EA580C' },
  { label: 'Amber', value: '#D97706' },
  { label: 'Green', value: '#16A34A' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Blue', value: '#2563EB' },
  { label: 'Indigo', value: '#4F46E5' },
  { label: 'Purple', value: '#7C3AED' },
  { label: 'Pink', value: '#DB2777' },
  { label: 'Teal', value: '#0D9488' },
  { label: 'Cyan', value: '#0891B2' },
]

const HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/

export default function EditorToolbarColor({ editor }) {
  const [open, setOpen] = useState(false)
  const [hexInput, setHexInput] = useState('')
  const [hexError, setHexError] = useState('')
  const ref = useRef(null)
  const btnRef = useRef(null)
  const hexInputRef = useRef(null)

  // Alt+Shift+C (or Cmd+Shift+C on Mac) toggles the color picker.
  // Note: Ctrl+Shift+C is reserved by Chrome DevTools and cannot be
  // prevented by JavaScript, so we use Alt+Shift+C instead.
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.altKey || e.metaKey) && e.shiftKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault()
        e.stopPropagation()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setHexInput('')
        setHexError('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (open && hexInputRef.current) {
      hexInputRef.current.focus()
    }
  }, [open])

  if (!editor) return null

  const currentColor = editor.getAttributes('textStyle').color || '#000000'

  const applyColor = useCallback(
    (color) => {
      editor.chain().focus().setColor(color).run()
      setOpen(false)
      setHexInput('')
      setHexError('')
    },
    [editor]
  )

  const handleHexSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const raw = hexInput.trim()
      if (!raw.startsWith('#')) {
        setHexError('Enter a hex value like #ffa800')
        return
      }
      if (!HEX_REGEX.test(raw)) {
        setHexError('Invalid hex color — use format #RGB or #RRGGBB')
        return
      }
      applyColor(raw)
    },
    [hexInput, applyColor]
  )

  const handleHexChange = useCallback((e) => {
    const val = e.target.value
    setHexInput(val)
    if (val && !HEX_REGEX.test(val)) {
      setHexError('Invalid format')
    } else {
      setHexError('')
    }
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-1 rounded px-2 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 data-[active=true]:bg-gray-100 data-[active=true]:text-amber-700"
        data-active={open}
        title="Text color (Alt+Shift+C)"
      >
        <span className="flex items-center gap-1">
          <span className="text-xs font-semibold">A</span>
          <span
            className="inline-block h-1 w-4 rounded-full"
            style={{ backgroundColor: currentColor === '#000000' ? '#6B7280' : currentColor }}
          />
        </span>
        <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <div className="mb-2 text-xs font-medium text-gray-500">Text Color</div>

          {/* Preset color grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {PRESET_COLORS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => applyColor(value)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-gray-200 transition-transform hover:scale-110"
                style={{ backgroundColor: value }}
                title={label}
                aria-label={label}
              >
                {currentColor === value && (
                  <svg className="h-3.5 w-3.5 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Custom hex input */}
          <form onSubmit={handleHexSubmit} className="mt-3 border-t border-gray-100 pt-2">
            <label className="mb-1 block text-xs font-medium text-gray-500">Custom hex</label>
            <div className="flex items-center gap-2">
              <input
                ref={hexInputRef}
                type="text"
                value={hexInput}
                onChange={handleHexChange}
                placeholder="#ffa800"
                maxLength={7}
                className="min-w-0 flex-1 rounded-md border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Custom hex color"
              />
              <button
                type="submit"
                disabled={!hexInput.trim() || !!hexError}
                className="shrink-0 cursor-pointer whitespace-nowrap rounded-md bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Apply
              </button>
            </div>
            {hexError && <p className="mt-1 text-xs text-red-500">{hexError}</p>}
          </form>

          {/* Reset */}
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().unsetColor().run()
              setOpen(false)
              setHexInput('')
              setHexError('')
            }}
            className="mt-2 w-full cursor-pointer rounded px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100"
          >
            Reset to default
          </button>
        </div>
      )}
    </div>
  )
}