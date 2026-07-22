import { useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { extensions } from './editorExtensions'
import EditorToolbar from './EditorToolbar'
import DOMPurify from 'dompurify'

const ALLOWED_TAGS = [
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'em', 'u', 's', 'span', 'br', 'hr',
  'blockquote', 'pre', 'code',
  'a', 'ul', 'ol', 'li',
  'sub', 'sup', 'mark', 'small', 'del', 'ins',
  'svg', 'path',
]

const ALLOWED_ATTRS = [
  'href', 'target', 'rel', 'class', 'style', 'spellcheck', 'data-language', 'dir',
  'xmlns', 'width', 'height', 'viewbox', 'fill', 'd',
]

const PURIFY_CONFIG = {
  ALLOWED_TAGS,
  ALLOWED_ATTR: ALLOWED_ATTRS,
  ALLOW_DATA_ATTR: ['data-language', 'data-editor-arrow'],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:https?|mailto|ftp):)|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
}

export default function RichTextEditor({ content, onChange, editable = true, minHeight = 320 }) {
  const handleUpdate = useCallback(
    ({ editor }) => {
      const html = editor.getHTML()
      const sanitized = DOMPurify.sanitize(html, PURIFY_CONFIG)
      onChange?.(sanitized)
    },
    [onChange]
  )

  const editor = useEditor({
    extensions,
    content: content || '',
    editable,
    onUpdate: handleUpdate,
    onCreate: ({ editor }) => {
      // Adding a small delay ensures the cursor moves to the end after
      // the content is fully parsed, preventing false isActive detection.
      requestAnimationFrame(() => {
        editor.commands.setTextSelection(editor.state.doc.content.size)
      })
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none px-4 py-3',
        style: `min-height: ${minHeight}px`,
      },
    },
  })

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-amber-500/30">
      <EditorToolbar editor={editor} />
      <div className="border-t border-gray-100">
        <EditorContent editor={editor} />
      </div>
      {/* Hidden input for form compatibility */}
      <input type="hidden" value={content || ''} readOnly aria-hidden="true" />
    </div>
  )
}