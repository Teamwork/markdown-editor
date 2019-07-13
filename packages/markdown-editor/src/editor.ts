import CodeMirror from 'codemirror'
import createDebug from 'debug'

const debug = createDebug('@teamwork/markdown-editor')
const richTextMarkdownMap = new WeakMap<CodeMirror.Editor, RichTextMarkdown>()
const markOptions = {
    collapsed: true,
    selectLeft: false,
}

CodeMirror.defineOption(
    'richTextMarkdown',
    false,
    (editor: CodeMirror.Editor, value: boolean): void => {
        if (value) {
            if (!richTextMarkdownMap.has(editor)) {
                richTextMarkdownMap.set(editor, new RichTextMarkdown(editor))
            }
        } else {
            const richTextMarkdown = richTextMarkdownMap.get(editor)

            if (richTextMarkdown) {
                richTextMarkdown.destroy()
                richTextMarkdownMap.delete(editor)
            }
        }
    },
)

class RichTextMarkdown {
    private marks: Set<CodeMirror.TextMarker> = new Set()

    public constructor(private readonly codeMirror: CodeMirror.Editor) {
        debug('init', this.codeMirror)

        this.codeMirror.on('optionChange', this.onOptionChange as any)
        this.codeMirror.on('swapDoc', this.onSwapDoc as any)
        this.codeMirror.on('change', this.onChange as any)

        this.init()
    }

    public destroy(): void {
        debug('destroy', this.codeMirror)

        this.codeMirror.off('optionChange', this.onOptionChange as any)
        this.codeMirror.off('swapDoc', this.onSwapDoc as any)
        this.codeMirror.off('change', this.onChange as any)

        this.clear()
    }

    private init(): void {
        const modeOption = this.codeMirror.getOption('mode')

        if (
            modeOption &&
            modeOption.name === 'markdown' &&
            modeOption.highlightFormatting &&
            !modeOption.fencedCodeBlockHighlighting &&
            !modeOption.allowAtxHeaderWithoutSpace
        ) {
            for (
                let i = 0, l = this.codeMirror.getDoc().lineCount();
                i < l;
                ++i
            ) {
                this.initLine(i)
            }
        }
    }

    private clear(): void {
        this.marks.forEach(mark => mark.clear())
    }

    private initLine(lineIndex: number): void {
        const lineTokens = this.codeMirror.getLineTokens(lineIndex, true)

        for (let i = 0, l = lineTokens.length; i < l; ++i) {
            const token = lineTokens[i]

            if (this.shouldHide(token, i, lineTokens)) {
                const mark = this.codeMirror
                    .getDoc()
                    .markText(
                        { line: lineIndex, ch: token.start },
                        { line: lineIndex, ch: token.end },
                        markOptions,
                    )

                mark.on('hide', () => mark.clear())
                mark.on('clear', () => this.marks.delete(mark))
                this.marks.add(mark)
            }
        }
    }

    private clearLine(lineIndex: number): void {
        const marks = this.codeMirror
            .getDoc()
            .findMarks(
                { line: lineIndex, ch: 0 },
                { line: lineIndex, ch: Infinity },
            )

        for (let i = 0, l = marks.length; i < l; ++i) {
            const mark = marks[i]

            if (this.marks.has(mark)) {
                mark.clear()
            }
        }
    }

    private shouldHide(
        token: CodeMirror.Token,
        _index: number,
        _tokens: CodeMirror.Token[],
    ): boolean {
        if (token.type == null) {
            // plain text
            return false
        }

        // `token.state.formatting` is always `false` for tokens retrieved using
        // `this.codeMirror.getLineTokens`. `this.codeMirror.getTokensAt` returns
        // a correct state, however, it is less efficient, so we rely on `token.type`.
        // if (!token.state.formatting) {
        if (!/(^|\s)formatting($|\s)/.test(token.type)) {
            // styled text
            return false
        }

        if (token.state.header === token.string.length) {
            // '#' header formatting characters not followed by a space
            return false
        }

        return true
    }

    private onOptionChange = (
        _codeMirror: CodeMirror.Editor,
        option: string,
    ): void => {
        if (option === 'mode') {
            this.clear()
            this.init()
        }
    }

    private onSwapDoc = (
        _codeMirror: CodeMirror.Editor,
        _oldDoc: CodeMirror.Doc,
    ): void => {
        this.clear()
        this.init()
    }

    private onChange = (
        _doc: CodeMirror.Doc,
        change: CodeMirror.EditorChange,
    ): void => {
        for (
            let i = change.from.line, l = CodeMirror.changeEnd(change).line + 1;
            i < l;
            ++i
        ) {
            this.clearLine(i)
            this.initLine(i)
        }
    }
}
