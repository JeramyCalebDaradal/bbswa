import { useState, useRef, useEffect } from 'react'

export default function EditorToolbarLink({ editor }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const ref = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  if (!editor) return null

  const isActive = editor.isActive('link')

  function handleOpen() {
    const previousUrl = editor.getAttributes('link').href || ''
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    )
    setUrl(previousUrl)
    setText(selectedText || '')
    setOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) {
      editor.chain().focus().unsetLink().run()
      setOpen(false)
      return
    }
    const href = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href })
      .run()
    setOpen(false)
  }

  function handleRemove() {
    editor.chain().focus().unsetLink().run()
    setOpen(false)
  }

  function isValidUrl(url) {
    const trimmed = url.trim()
    if (!trimmed) return true
    try {
      const u = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
      new URL(u)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleOpen}
        className="flex cursor-pointer items-center gap-1 rounded px-2 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 data-[active=true]:bg-gray-100 data-[active=true]:text-amber-700"
        data-active={isActive}
        title="Insert link"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">URL</label>
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {url.trim() && !isValidUrl(url) && (
                <p className="mt-1 text-xs text-red-500">Enter a valid URL</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Link text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Display text"
                className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled
              />
              <p className="mt-0.5 text-xs text-gray-400">Select text in the editor first</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={!isValidUrl(url)}
                className="flex-1 cursor-pointer rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editor.getAttributes('link').href ? 'Update' : 'Add'}
              </button>
              {editor.getAttributes('link').href && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="cursor-pointer rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  Remove
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  )
}