import * as fs from "fs";
import * as path from "path";

import * as vscode from "vscode";

import { HtmlNote } from "./vsnote.htmlGenerator";

class HtmlDocumentContentProvider implements vscode.TextDocumentContentProvider {

    public _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    private nodePath: string;

    constructor(private uri: vscode.Uri) { }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(nodePath: string): void {
        this.nodePath = nodePath;
        this._onDidChange.fire(this.uri);
    }

    public async provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Promise<string> {
        return (new HtmlNote(this.nodePath)).generateHTML();
    }
}

const previewUri = vscode.Uri.parse("vscode-note://note/content");
export const provider = new HtmlDocumentContentProvider(previewUri);
vscode.workspace.registerTextDocumentContentProvider("vscode-note", provider);

vscode.commands.executeCommand("vscode.previewHtml", previewUri, vscode.ViewColumn.One, "vscode-note");
