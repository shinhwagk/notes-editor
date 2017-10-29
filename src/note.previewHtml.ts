import * as vscode from 'vscode';

let b = 1

class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    get onDidChange(): vscode.Event<vscode.Uri> {
        vscode.window.showInformationMessage("ffff3")
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
        vscode.window.showInformationMessage("ffff1")
        this._onDidChange.fire(uri);
    }

    async provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Promise<string> {
        if (b % 2 == 0) {
            b += 1
            return "333"
        } else {
            b += 1
            return "222"
        }

    }

}

const previewUri = vscode.Uri.parse('vscode-note://note/content?a=111');
const provider = new TextDocumentContentProvider();
vscode.workspace.registerTextDocumentContentProvider("vscode-note", provider);

vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.One, "aaadfdf")
    .then(success => { }, reason => vscode.window.showErrorMessage(reason))


export const disposable = vscode.commands.registerCommand('extension.showVscodeNotePreview', () => {
    provider.update(previewUri)
});