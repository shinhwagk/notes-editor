import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    constructor(private uri: vscode.Uri) { }
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    private indexfile;

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(indexPath: string): void {
        this.indexfile = indexPath
        this._onDidChange.fire(this.uri);
    }

    async provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Promise<string> {
        return this.generateHtmlView(uri);
    }

    private generateHtmlView(uri: vscode.Uri) {
        const indexContent: string = this.indexfile ? fs.readFileSync(this.indexfile, "UTF-8") : "{}";

        return `
        <head>
        </head>
        <body>
            <textarea id="indexContent" hidden>${indexContent}</textarea>
            <div id="example"></div>
            <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
            <script type="text/javascript" src="file:///E:/github3/vscode-note/out/views/bundle.js"></script>
        </body>`
    }

    private getStyleSheetPath(resourceName: string): string {
        return vscode.Uri.file(path.join(__dirname, '..', '..', '..', 'resources', resourceName)).toString();
    }
}

const previewUri = vscode.Uri.parse("vscode-note://note/content");
const provider = new TextDocumentContentProvider(previewUri)
vscode.workspace.registerTextDocumentContentProvider("vscode-note", provider);
vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.One, "aaadfdf")
    .then(success => { }, reason => vscode.window.showErrorMessage(reason))
export const disposable = vscode.commands.registerCommand('extension.showVscodeNotePreview', (query) => provider.update(query));

interface NoteIndex {
    labels: string[];
    categorys: NoteCategory[];
}

interface NoteCategory {
    cols: number;
    name: string;
    notes: NoteNote[];
}

interface NoteNote {
    doc?: boolean;
    file?: boolean;
}