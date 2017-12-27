import * as vscode from 'vscode';

import { deleteNoteCommandHandler, modifyNoteCommandHandler, addNoteCommandHandler } from './vsnote.onCommond';


const disposables = new Map();
disposables.set('extension.deleteNote', deleteNoteCommandHandler);
disposables.set('extension.modifyNote', modifyNoteCommandHandler);
disposables.set('extension.addNote', addNoteCommandHandler);

const items: [string, (...args: any[]) => any][] = [
    ['extension.deleteNote', deleteNoteCommandHandler],
    ['extension.modifyNote', modifyNoteCommandHandler],
    ['extension.addNote', addNoteCommandHandler]
];

export function activateRegister(rootFsPath: string, context: vscode.ExtensionContext) {
    for (let [name, handler] of new Map(items)) {
        context.subscriptions.push(vscode.commands.registerCommand(name, handler))
    }
}