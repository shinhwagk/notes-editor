import * as vscode from 'vscode';
import * as fs from 'fs';

import { generateHtmlView } from './note.htmlGenerator'

class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    constructor(private uri: vscode.Uri) { }
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    private indexFilePath: string;

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(indexPath: string): void {
        this.indexFilePath = indexPath
        this._onDidChange.fire(this.uri);
    }

    async provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Promise<string> {
        return generateHtmlView(this.indexFilePath);
    }
}

const previewUri = vscode.Uri.parse("vscode-note://note/content");
const provider = new TextDocumentContentProvider(previewUri)
vscode.workspace.registerTextDocumentContentProvider("vscode-note", provider);
vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.One, "aaadfdf")
    .then(success => { }, reason => vscode.window.showErrorMessage(reason))
export const disposable = vscode.commands.registerCommand('extension.showVscodeNotePreview', (query) => provider.update(query));

