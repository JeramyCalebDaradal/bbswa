import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import { common, createLowlight } from 'lowlight'

const lowlight = createLowlight(common)

/**
 * Custom TextIndent extension — adds margin-left via textStyle mark.
 */
const TextIndent = TextStyle.extend({
  name: 'textIndent',

  addAttributes() {
    return {
      ...this.parent?.(),
      textIndent: {
        default: null,
        parseHTML: (el) => el.style.marginLeft || null,
        renderHTML: (attrs) => {
          if (!attrs.textIndent) return {}
          return { style: `margin-left: ${attrs.textIndent}` }
        },
      },
    }
  },

  addCommands() {
    return {
      setTextIndent:
        (amount) =>
        ({ commands }) =>
          commands.setMark('textStyle', { textIndent: amount }),
      unsetTextIndent:
        () =>
        ({ commands }) =>
          commands.setMark('textStyle', { textIndent: null }),
    }
  },
})

export const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
    },
    codeBlock: false,
    history: {
      depth: 100,
    },
  }),
  Underline,
  TextStyle,
  Color,
  TextIndent,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      rel: 'noopener noreferrer',
      target: '_blank',
    },
  }),
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: 'javascript',
  }),
  Placeholder.configure({
    placeholder: 'Start writing your article content here...',
  }),
]

export { lowlight }