import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'codemirror/lib/codemirror.css'
import './index.css'
// import { editor } from '@teamwork/markdown-editor'
import CodeMirror from 'codemirror'
import 'codemirror/mode/markdown/markdown'

const initialValue = `# awdawd

awd awd

\`\`\`markdown
**afef sef**
\`\`\`
`
const codeMirror = CodeMirror(document.getElementById('editor'), {
    mode: {
        name: 'markdown',
        highlightFormatting: true,
    },
    value: initialValue,
})

window.codeMirror = codeMirror
