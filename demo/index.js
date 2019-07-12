import 'core-js/stable'
import 'regenerator-runtime/runtime'
import CodeMirror from 'codemirror'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/lib/codemirror.css'
import '@teamwork/markdown-editor'
import '@teamwork/markdown-editor/theme/rich-text.css'
import '@teamwork/markdown-editor/theme/plain-text.css'
import './index.css'

const mode = {
    fencedCodeBlockHighlighting: false,
    highlightFormatting: true,
    name: 'markdown',
}
const value = `# awdawd

123 **bold** 456

\`\`\`markdown
**afef sef**
Some more text
\`\`\`
`
let theme = localStorage.getItem('theme') || 'default'
const themeSelect = document.getElementById('theme')
let richTextMarkdown = localStorage.getItem('richTextMarkdown') === 'true'
const richTextMarkdownCheckbox = document.getElementById('richTextMarkdown')
const codeMirror = CodeMirror(document.getElementById('editor'), {
    mode,
    value,
    theme,
    richTextMarkdown,
})

themeSelect.value = theme
themeSelect.addEventListener('change', () => {
    theme = themeSelect.value
    codeMirror.setOption('theme', theme)
    localStorage.setItem('theme', theme)
})

richTextMarkdownCheckbox.checked = richTextMarkdown
richTextMarkdownCheckbox.addEventListener('change', () => {
    richTextMarkdown = richTextMarkdownCheckbox.checked
    codeMirror.setOption('richTextMarkdown', richTextMarkdown)
    localStorage.setItem('richTextMarkdown', richTextMarkdown)
})

window.codeMirror = codeMirror
