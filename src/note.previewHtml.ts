import * as fs from 'fs';
import * as path from 'path';

import * as vscode from 'vscode';

import { generateHtmlView } from './note.htmlGenerator'

class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    
    constructor(private uri: vscode.Uri) { }

    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    private indexFilePath: string;

    private nodePath: string;

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(nodePath: string): void {
        this.nodePath = nodePath;
        this.indexFilePath = path.join(nodePath, ".index.json")
        this._onDidChange.fire(this.uri);
    }

    async provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Promise<string> {
        return generateHtmlView(this.nodePath);
    }
}

const previewUri = vscode.Uri.parse("vscode-note://note/content");
const provider = new TextDocumentContentProvider(previewUri);
vscode.workspace.registerTextDocumentContentProvider("vscode-note", provider);

vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.One, "vscode-note")
    .then(success => { }, reason => vscode.window.showErrorMessage(reason))

export const commandShowVscodeNote = vscode.commands.registerCommand('extension.showVscodeNotePreview', (nodePath) => provider.update(nodePath));

