import * as vscode from 'vscode';

export const disposable1 = vscode.commands.registerCommand('extension.modifyNote', (nodePath) => nodePath);
export const disposable2 = vscode.commands.registerCommand('extension.deleteNote', (nodePath) => nodePath);

export const disposable3 = vscode.commands.registerCommand('extension.addCategory', (nodePath) => nodePath);
export const disposable13 = vscode.commands.registerCommand('extension.modifyCategory', (nodePath) => nodePath);
export const disposable23 = vscode.commands.registerCommand('extension.deleteCategory', (nodePath) => nodePath);

vscode.commands.registerCommand('extension.addLabel', (nodePath) => nodePath);
vscode.commands.registerCommand('extension.modifyLabel', (nodePath) => nodePath);
vscode.commands.registerCommand('extension.deleteLabel', (nodePath) => nodePath);

export const activates = (context: vscode.ExtensionContext) => {
    context.subscriptions.push(vscode.commands.registerCommand('extension.addNote', (nodePath) => vscode.window.showInformationMessage(nodePath)));


}