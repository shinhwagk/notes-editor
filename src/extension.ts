import * as path from "path";

import * as vscode from "vscode";

import * as hanlders from "./vsnote.onCommondHandlers";
import { commandShowVscodeNote } from "./vsnote.previewHtml";
import { NoteTreeProvider } from "./vsnote.view.onView";

export async function activate(context: vscode.ExtensionContext) {

    const p = new NoteTreeProvider();

    vscode.window.registerTreeDataProvider("vsnote", p);
    context.subscriptions.push(commandShowVscodeNote());

    const handlers: Array<[string, (...args: any[]) => any]> = [
        ["extension.delete.note", hanlders.delete_note_command_handler],
        ["extension.update.note", hanlders.update_note_command_handler],
        ["extension.insert.note", hanlders.insert_note_command_handler],
        // ["extension.delete.category", hanlders.delete_category_command_handler],
        // ["extension.update.category", hanlders.update_category_command_handler],
        // ["extension.insert.category", hanlders.insert_category_command_handler],
        // ["extension.delete.label", hanlders.delete_label_command_handler],
        // ["extension.update.label", hanlders.update_label_command_handler],
        // ["extension.insert.label", hanlders.insert_label_command_handler],
    ];

    for (const [name, handler] of handlers) {
        context.subscriptions.push(vscode.commands.registerCommand(name, handler));
    }
}
