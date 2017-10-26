'use strict';

import * as vscode from 'vscode';

import { makeNoteProvider } from './note.onView';

export function activate(context: vscode.ExtensionContext) {
    const rootPath: string = vscode.workspace.workspaceFolders[0].uri.fsPath;

    vscode.window.registerTreeDataProvider('note', makeNoteProvider(rootPath));
}