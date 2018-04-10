import * as fs from "fs";
import * as path from "path";

import * as vscode from "vscode";

import { deleteFolderRecursive, emptyNodeIdxObj, genNoteMate } from "./vsnote.lib";
import { IIndex, INote } from "./vsnote.note";
import { provider } from "./vsnote.previewHtml";
import { commandNameShowVsNotePreview, workspaceRootPath } from "./vsnote.settings";
import { INoteNode } from "./vsnote.view.node";

export const update_note_handler = async (nodeFsPath, cIdx) => {
    const indexContent = genNoteMate(nodeFsPath);

    const category = indexContent.categorys[cIdx];

    const notePickList: vscode.QuickPickItem[] = [];
    const notes: any[] = category.notes;
    for (const nId of notes) {
        notePickList.push({ label: notes[nId].i.toString(), description: nId.toString() });
    }

    const noteId = await vscode.window.showQuickPick(notePickList);

    const cols = category.cols;
    for (let i = 1; i <= cols; i++) {
        const uri = vscode.Uri.file(path.join(nodeFsPath, `n-${noteId.label}`, i.toString()));
        // vscode.workspace.openTextDocument;
        vscode.window.showTextDocument(uri, { preview: false, viewColumn: vscode.ViewColumn.Two });
    }
    const note = notes[Number(noteId.label)];
    if (note.d) {
        const uri = vscode.Uri.file(path.join(nodeFsPath, `n-${noteId.label}`, "d", "README.md"));
        // vscode.workspace.openTextDocument
        vscode.window.showTextDocument(uri, { preview: false, viewColumn: vscode.ViewColumn.Two });
    }
};

export const insert_label_handler = (m) => async (noteNode?: INoteNode) => {
    const _idxPath: string = noteNode ? path.join(noteNode.parent, noteNode.label) : workspaceRootPath;
    const _label: string = await vscode.window.showInputBox();
    if (!_label) { return; }
    const _idxObj = genNoteMate(_idxPath);
    _idxObj.labels.push(_label);
    vscode.window.showInformationMessage(JSON.stringify(_idxObj));

    fs.mkdirSync(path.join(workspaceRootPath, _idxPath, _label));

    fs.writeFileSync(path.join(workspaceRootPath, _idxPath, _label, ".index.json"), JSON.stringify(emptyNodeIdxObj), "UTF-8");
    fs.writeFileSync(path.join(workspaceRootPath, _idxPath, ".index.json"), JSON.stringify(_idxObj), "UTF-8");

    vscode.window.registerTreeDataProvider("vsnote", m);
};

export const delete_note_handler = async (noteNode, cIdx: number) => {
    const nodeMeta = genNoteMate(noteNode);
    const notePickList: vscode.QuickPickItem[] = [];
    const category = nodeMeta.categorys[cIdx];
    const notes = category.notes;
    notes.forEach((note, idx) => notePickList.push({ label: notes[idx].i.toString(), description: idx.toString() }));

    const noteId = await vscode.window.showQuickPick(notePickList);

    deleteFolderRecursive(path.join(noteNode, `n-${noteId.label}`));

    notes.splice(Number(noteId.description), 1);
    fs.writeFileSync(path.join(noteNode, ".index.json"), JSON.stringify(nodeMeta), { encoding: "UTF-8" });
    refreshPreview(noteNode);
};

export const insert_category_handler = async (noteNode: INoteNode) => {
    const _categoryName = await vscode.window.showInputBox();
    if (!_categoryName) { return; }
    const categoryColNumberPickList: vscode.QuickPickItem[] = [];
    for (let i = 1; i <= 5; i++) {
        categoryColNumberPickList.push({ label: i.toString(), description: "" });
    }
    const categoryColNumber = await vscode.window.showQuickPick(categoryColNumberPickList);
    if (!categoryColNumber) { return; }

    const _noteMeta = genNoteMate(noteNode.parent);
    _noteMeta.categorys.push({ name: _categoryName, cols: Number(categoryColNumber.label), notes: [] });
    fs.writeFileSync(path.join(workspaceRootPath, noteNode.parent, ".index.json"), JSON.stringify(_noteMeta), "UTF-8");
    refreshPreview(noteNode.parent);
};

export const insert_note_handler = async (nodePath: string, cIdx: number) => {
    const itemPickList: vscode.QuickPickItem[] = [];
    itemPickList.push({ label: "Doc,File", description: "" });
    itemPickList.push({ label: "Doc", description: "" });
    itemPickList.push({ label: "File", description: "" });
    itemPickList.push({ label: "None", description: "" });
    const modeChoice = await vscode.window.showQuickPick(itemPickList);

    const nodeMeta: IIndex = genNoteMate(nodePath);
    const seq = nodeMeta.seq;

    const category = nodeMeta.categorys[cIdx];
    const cols: number = category.cols;
    const notes: INote[] = category.notes;

    const noteFolder = path.join(workspaceRootPath, nodePath, `n-${seq}`);
    if (!fs.existsSync(noteFolder)) {
        fs.mkdirSync(noteFolder);
    }
    nodeMeta.seq = seq + 1;

    for (let i = 1; i <= cols; i++) {
        fs.writeFileSync(path.join(noteFolder, i.toString()), "", "UTF-8");
    }

    let note;
    switch (modeChoice.label) {
        case "Doc,File":
            note = { d: 1, f: 1, i: seq };
            fs.mkdirSync(path.join(noteFolder, "d"));
            fs.writeFileSync(path.join(noteFolder, "d", "README.md"), "", "UTF-8");
            fs.mkdirSync(path.join(noteFolder, "f"));
            break;
        case "Doc":
            note = { d: 1, f: 0, i: seq };
            fs.mkdirSync(path.join(noteFolder, "d"));
            fs.writeFileSync(path.join(noteFolder, "d", "README.md"), "", "UTF-8");
            break;
        case "File":
            note = { d: 0, f: 1, i: seq };
            fs.mkdirSync(path.join(noteFolder, "f"));
            break;
        default:
            note = { d: 0, f: 0, i: seq };
    }

    notes.push(note);
    fs.writeFileSync(path.join(workspaceRootPath, nodePath, ".index.json"), JSON.stringify(nodeMeta), "UTF-8");
    refreshPreview(nodePath);
};

export const update_category_handler = async (nodePath: string, cIdx: number) => {
    const _newCategoryName = await vscode.window.showInputBox();
    if (!_newCategoryName) { return; }
    const _nodeMeta: IIndex = genNoteMate(nodePath);
    _nodeMeta.categorys[cIdx].name = _newCategoryName;
    fs.writeFileSync(path.join(workspaceRootPath, nodePath, ".index.json"), JSON.stringify(_nodeMeta), "UTF-8");
    refreshPreview(nodePath);
};

function refreshPreview(nodeFsPath) {
    vscode.commands.executeCommand(commandNameShowVsNotePreview, nodeFsPath)
        .then(null, (reason) => vscode.window.showErrorMessage(reason));
}

export const view_vsnote_handler = async (nodePath: string) => provider.update(nodePath);
