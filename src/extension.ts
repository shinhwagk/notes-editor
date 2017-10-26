'use strict';

import * as vscode from 'vscode';

import { makeNoteProvider } from './note.onView';

export function activate(context: vscode.ExtensionContext) {
    const rootPath: string = vscode.workspace.workspaceFolders[0].uri.toString();

    vscode.window.registerTreeDataProvider('note', makeNoteProvider(rootPath));
}