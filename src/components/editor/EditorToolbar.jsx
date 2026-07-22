import { useState, useEffect } from 'react'
import EditorToolbarColor from './EditorToolbarColor'
import EditorToolbarLink from './EditorToolbarLink'

/**
 * Map of shortcut keys to display labels for the toolbar.
 * Only includes shortcuts that differ from the default Tiptap ones
 * or are custom to this editor.
 */
const SHORTCUTS = {
  bold: 'Ctrl+B',
  italic: 'Ctrl+I',
  strike: 'Ctrl+Shift+S',
  underline: 'Ctrl+U',
  bulletList: 'Ctrl+Shift+8',
  orderedList: 'Ctrl+Shift+7',
  blockquote: 'Ctrl+Shift+B',
  codeBlock: 'Ctrl+Alt+C',
  link: 'Ctrl+K',
  color: 'Alt+Shift+C',
  indent: 'Tab',
  outdent: 'Shift+Tab',
}

function ToolbarButton({ editor, action, isActive, children, title, shortcut, disabled, className = '' }) {
  if (!editor) return null
  const label = shortcut ? `${title} (${shortcut})` : title
  return (
    <button
      type="button"
      onClick={() => action?.()}
      className={`flex cursor-pointer items-center justify-center rounded px-2 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 data-[active=true]:bg-amber-100 data-[active=true]:text-amber-700 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      data-active={isActive?.(editor) || false}
      title={label}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-gray-200" />
}

function HeadingDropdown({ editor }) {
  if (!editor) return null

  const levels = [
    { level: 0, label: 'Paragraph' },
    { level: 1, label: 'H1' },
    { level: 2, label: 'H2' },
    { level: 3, label: 'H3' },
    { level: 4, label: 'H4' },
    { level: 5, label: 'H5' },
    { level: 6, label: 'H6' },
  ]

  const current = levels.find((l) => {
    if (l.level === 0) return editor.isActive('paragraph')
    return editor.isActive('heading', { level: l.level })
  })

  return (
    <select
      value={current?.level ?? 0}
      onChange={(e) => {
        const val = Number(e.target.value)
        if (val === 0) {
          editor.chain().focus().setParagraph().run()
        } else {
          editor.chain().focus().toggleHeading({ level: val }).run()
        }
      }}
      className="cursor-pointer rounded border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
      title="Heading level (Ctrl+Alt+1–6)"
    >
      {levels.map((l) => (
        <option key={l.level} value={l.level}>
          {l.label}
        </option>
      ))}
    </select>
  )
}

function CodeBlockLanguageSelector({ editor }) {
  if (!editor || !editor.isActive('codeBlock')) return null

  const languages = [
    'javascript',
    'typescript',
    'python',
    'html',
    'css',
    'sql',
    'bash',
    'json',
    'yaml',
    'markdown',
    'php',
    'ruby',
    'go',
    'rust',
    'java',
    'csharp',
    'cpp',
    'plaintext',
  ]

  const currentLang = editor.getAttributes('codeBlock').language || 'javascript'

  return (
    <select
      value={currentLang}
      onChange={(e) => {
        editor.chain().focus().updateAttributes('codeBlock', { language: e.target.value }).run()
      }}
      className="cursor-pointer rounded border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
      title="Code language"
    >
      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {lang}
        </option>
      ))}
    </select>
  )
}

export default function EditorToolbar({ editor }) {
  if (!editor) return null

  // Force re-render whenever the editor selection changes so that
  // isActive() checks on every toolbar button are up to date.
  const [, forceRender] = useState(0)
  useEffect(() => {
    const onSelectionUpdate = () => forceRender((n) => n + 1)
    editor.on('selectionUpdate', onSelectionUpdate)
    return () => editor.off('selectionUpdate', onSelectionUpdate)
  }, [editor])

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-white px-3 py-2">
      {/* Heading select */}
      <HeadingDropdown editor={editor} />

      <Divider />

      {/* Text formatting */}
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleBold().run()}
        isActive={() => editor.isActive('bold')}
        title="Bold"
        shortcut={SHORTCUTS.bold}
      >
        <strong className="text-sm">B</strong>
      </ToolbarButton>

      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleItalic().run()}
        isActive={() => editor.isActive('italic')}
        title="Italic"
        shortcut={SHORTCUTS.italic}
      >
        <em className="text-sm">I</em>
      </ToolbarButton>

      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleStrike().run()}
        isActive={() => editor.isActive('strike')}
        title="Strikethrough"
        shortcut={SHORTCUTS.strike}
      >
        <span className="text-sm line-through">S</span>
      </ToolbarButton>

      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleUnderline().run()}
        isActive={() => editor.isActive('underline')}
        title="Underline"
        shortcut={SHORTCUTS.underline}
      >
        <span className="text-sm underline">U</span>
      </ToolbarButton>

      <Divider />

      {/* Lists */}
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleBulletList().run()}
        isActive={() => editor.isActive('bulletList')}
        title="Bullet list"
        shortcut={SHORTCUTS.bulletList}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={() => editor.isActive('orderedList')}
        title="Ordered list"
        shortcut={SHORTCUTS.orderedList}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h12M9 12h12M9 19h12M5 5v.01M5 12v.01M5 19v.01" />
        </svg>
      </ToolbarButton>

      <Divider />

      {/* Block elements */}
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={() => editor.isActive('blockquote')}
        title="Blockquote"
        shortcut={SHORTCUTS.blockquote}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l-2-2 4-4-4-4 2-2 6 6-6 6zM17 17l-2-2 4-4-4-4 2-2 6 6-6 6z" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={() => editor.isActive('codeBlock')}
        title="Code block"
        shortcut={SHORTCUTS.codeBlock}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </ToolbarButton>

      {/* Code block language selector — appears only when inside a code block */}
      <CodeBlockLanguageSelector editor={editor} />

      <Divider />

      {/* Indentation */}
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().setTextIndent('2em').run()}
        isActive={() => false}
        title="Increase indent"
        shortcut={SHORTCUTS.indent}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16M12 9l3 3-3 3" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().unsetTextIndent().run()}
        isActive={() => false}
        title="Decrease indent"
        shortcut={SHORTCUTS.outdent}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16M9 9l-3 3 3 3" />
        </svg>
      </ToolbarButton>

      <Divider />

      {/* Color picker */}
      <EditorToolbarColor editor={editor} />

      {/* Link */}
      <EditorToolbarLink editor={editor} />
    </div>
  )
}