import * as path from "path";

import * as vscode from 'vscode';

import { NoteTreeProvider } from './vsnote.onView';
import { commandShowVscodeNote } from './vsnote.previewHtml';
import { addCategoryDisposable, addLabelDisposable } from './vsnote.onCommond';
import { activateRegister } from './vsnote.onRegister'

export async function activate(context: vscode.ExtensionContext) {
    const workspaceFsPath: string = vscode.workspace.workspaceFolders[0].uri.fsPath;

    const vsnoteRootIndexPath = path.join(workspaceFsPath, ".index.json")
    const userRootIndexPath = vscode.workspace.getConfiguration("vsnote").get("rootPath")
    if (vsnoteRootIndexPath === userRootIndexPath) {
        const p = new NoteTreeProvider();

        vscode.window.registerTreeDataProvider('vsnote', p);
        context.subscriptions.push(commandShowVscodeNote);
        context.subscriptions.push(addLabelDisposable(workspaceFsPath, p));
        context.subscriptions.push(addCategoryDisposable(workspaceFsPath));

        activateRegister(workspaceFsPath, context)
    } else {
        vscode.window.showInformationMessage(vsnoteRootIndexPath)
        vscode.window.showInformationMessage(vsnoteRootIndexPath)
        vscode.window.showInformationMessage("no vscode workspace.")
    }

    let disposable = vscode.commands.registerCommand('extension.openfolder', () => {
        vscode.window.showInformationMessage('Hello World!');
        let uri = vscode.Uri.parse('c:\\');
        vscode.commands.executeCommand('vscode.openFolder', uri, true)
    });

    context.subscriptions.push(disposable);
}