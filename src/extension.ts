import * as vscode from 'vscode';

import { makeNoteProvider } from './vsnote.onView';
import { commandShowVscodeNote } from './vsnote.previewHtml';
import { addNoteDisposable, addCategoryDisposable, deleteNoteDisposable, modifyNoteDisposable, addLabelDisposable } from './vsnote.onCommond';
// import { getWorkspaceConfiguration } from './vsnote.setting';

export function activate(context: vscode.ExtensionContext) {
    // vscode.window.showInformationMessage(vscode.workspace.getConfiguration('vsnote').get<boolean>('switch').toString());
    const rootFsPath: string = vscode.workspace.workspaceFolders[0].uri.fsPath;

    const p = makeNoteProvider(rootFsPath)
 
    vscode.window.registerTreeDataProvider('vsnote', p);
    context.subscriptions.push(commandShowVscodeNote);
    context.subscriptions.push(addNoteDisposable);
    context.subscriptions.push(addLabelDisposable(rootFsPath, p));
    context.subscriptions.push(addCategoryDisposable(rootFsPath));
    context.subscriptions.push(deleteNoteDisposable(rootFsPath));
    context.subscriptions.push(modifyNoteDisposable);
}