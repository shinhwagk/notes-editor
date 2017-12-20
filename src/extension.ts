'use strict';

import * as vscode from 'vscode';

import { makeNoteProvider } from './note.onView';
import { commandShowVscodeNote } from './note.previewHtml';
import { addNoteDisposable, addCategoryDisposable, deleteNoteDisposable, modifyNoteDisposable } from './note.onCommond';

export function activate(context: vscode.ExtensionContext) {
    const rootPath: string = vscode.workspace.workspaceFolders[0].uri.fsPath;

    vscode.window.registerTreeDataProvider('note', makeNoteProvider(rootPath));

    context.subscriptions.push(commandShowVscodeNote);
    context.subscriptions.push(addNoteDisposable);
    context.subscriptions.push(addCategoryDisposable(rootPath));
    context.subscriptions.push(deleteNoteDisposable(rootPath));
    context.subscriptions.push(modifyNoteDisposable);
}