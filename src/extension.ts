import * as path from "path";

import * as vscode from "vscode";

import * as commandHanlders from "./vsnote.onCommondHandlers";
import { provider } from "./vsnote.previewHtml";
import { NoteTreeProvider } from "./vsnote.view.onView";

export async function activate(context: vscode.ExtensionContext) {

    const p = new NoteTreeProvider();

    vscode.window.registerTreeDataProvider("vsnote", p);

    const handlers: Array<[string, (...args: any[]) => any]> = [
        ["extension.delete.note", commandHanlders.delete_note_handler],
        ["extension.update.note", commandHanlders.update_note_handler],
        ["extension.update.note.doc", commandHanlders.update_or_delete_note_doc_handler],
        ["extension.update.note.file", commandHanlders.update_or_delete_note_file_handler],
        ["extension.insert.note", commandHanlders.insert_note_handler],
        // ["extension.delete.category", commandHanlders.delete_category_handler],
        ["extension.update.category", commandHanlders.update_category_handler],
        ["extension.insert.category", commandHanlders.insert_category_handler],
        // ["extension.delete.label", hanlders.delete_label_command_handler],
        // ["extension.update.label", hanlders.update_label_command_handler],
        ["extension.insert.label", commandHanlders.insert_label_handler(p)],
        ["extension.showVsNotePreview", commandHanlders.view_vsnote_handler],
    ];

    for (const [name, handler] of handlers) {
        context.subscriptions.push(vscode.commands.registerCommand(name, handler));
    }
}
