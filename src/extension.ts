'use strict';

import * as vscode from 'vscode';

import { NoteProvider } from './note';

export function activate(context: vscode.ExtensionContext) {
    const rootPath = vscode.workspace.rootPath;

    const noteProvider = new NoteProvider(rootPath);

    vscode.window.registerTreeDataProvider('note', noteProvider);

    // context.subscriptions.push(disposable);

   vscode.commands.registerCommand('extension.sayHello', () => {
        vscode.window.showInformationMessage('Hello World!');
    });

    // context.subscriptions.push(disposable);
}


export function deactivate() {
}