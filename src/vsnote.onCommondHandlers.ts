import * as fs from "fs";
import * as path from "path";

import * as vscode from "vscode";

import { deleteFolderRecursive, emptyNodeIdxObj, genNoteMate } from "./vsnote.lib";
import { IIndex, INote } from "./vsnote.note";
import { provider } from "./vsnote.previewHtml";
import { commandNameShowVsNotePreview, workspaceRootPath } from "./vsnote.settings";
import { INoteNode } from "./vsnote.view.node";

export const update_note_handler = async (nId: number, nNum: number) => {
    const _note_file: string = path.join(workspaceRootPath, "notes", nId.toString(), nNum.toString());
    const uri = vscode.Uri.file(_note_file);
    const document = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.Two, preview: false });
};

export const insert_label_handler = (m) => async (noteNode?: INoteNode) => {
    const _idxPath: string = noteNode ? path.join(noteNode.parent, noteNode.label) : "";
    const _label: string = await vscode.window.showInputBox();
    if (!_label) { return; }
    const _idxObj = genNoteMate(_idxPath);
    _idxObj.labels.push(_label);

    fs.mkdirSync(path.join(workspaceRootPath, _idxPath, _label));

    fs.writeFileSync(path.join(workspaceRootPath, _idxPath, _label.trim(), ".index.json"), JSON.stringify(emptyNodeIdxObj), "UTF-8");
    fs.writeFileSync(path.join(workspaceRootPath, _idxPath, ".index.json"), JSON.stringify(_idxObj), "UTF-8");

    vscode.window.registerTreeDataProvider("vsnote", m);
};

export const delete_note_handler = async (nodePath: string, cIdx: number, nId: number) => {
    const _note_folder = path.join(workspaceRootPath, "notes", nId.toString());
    const _idxObj = genNoteMate(nodePath);
    const notePickList: vscode.QuickPickItem[] = [{ label: "YES", description: "" }, { label: "NO", description: "" }];
    const category = _idxObj.categorys[cIdx];
    const notes: INote[] = category.notes;

    const del = await vscode.window.showQuickPick(notePickList);
    if (del.label === "YES") {
        category.notes = notes.filter((note) => note.i !== nId);
        vscode.window.showInformationMessage(path.join(workspaceRootPath, nodePath, ".index.json"));
        fs.writeFileSync(path.join(workspaceRootPath, nodePath, ".index.json"), JSON.stringify(_idxObj), "UTF-8");
        deleteFolderRecursive(_note_folder);
        refreshPreview(nodePath);
    }
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

    const _noteMeta = genNoteMate(path.join(noteNode.parent, noteNode.label));
    _noteMeta.categorys.push({ name: _categoryName.trim(), cols: Number(categoryColNumber.label), notes: [] });
    fs.writeFileSync(path.join(workspaceRootPath, noteNode.parent, noteNode.label, ".index.json"), JSON.stringify(_noteMeta), "UTF-8");
    refreshPreview(path.join(noteNode.parent, noteNode.label));
};

export const insert_note_handler = async (nodePath: string, cIdx: number) => {
    const nodeMeta: IIndex = genNoteMate(nodePath);

    const category = nodeMeta.categorys[cIdx];
    const cols: number = category.cols;
    const notes: INote[] = category.notes;

    const note_id: number = Number(fs.readFileSync(path.join(workspaceRootPath, "notes", "seq")));

    const noteFolder: string = path.join(workspaceRootPath, "notes", note_id.toString());
    if (!fs.existsSync(noteFolder)) {
        fs.mkdirSync(noteFolder);
    }

    for (let i = cols; i >= 1; i--) {
        fs.writeFileSync(path.join(noteFolder, i.toString()), "", "UTF-8");
        vscode.workspace.openTextDocument(vscode.Uri.file(path.join(noteFolder, i.toString()))).then((document) => {
            vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.Two, preview: false });
        });
    }

    const note = { d: 0, f: 0, i: note_id };

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

export const update_or_delete_note_doc_handler = async (nodePath: string, cIdx: number, nId: number) => {
    const nodeMeta: IIndex = genNoteMate(nodePath);
    const note = nodeMeta.categorys[cIdx].notes.filter((n) => n.i === nId)[0];
    note.d = 1;

    const _note_doc_folder = path.join(workspaceRootPath, "notes", nId.toString(), "d");
    if (!fs.existsSync(_note_doc_folder)) {
        fs.mkdirSync(_note_doc_folder);
        fs.writeFileSync(path.join(_note_doc_folder, "README.md"), "", "utf-8");
    }
    fs.writeFileSync(path.join(workspaceRootPath, nodePath, ".index.json"), JSON.stringify(nodeMeta), "UTF-8");
    const uri = vscode.Uri.file(_note_doc_folder);
    await vscode.commands.executeCommand("vscode.openFolder", uri, true);
};

export const update_or_delete_note_file_handler = async (nodePath: string, nId: number) => {
    const _note_folder = path.join(workspaceRootPath, nodePath, `n-${nId}`, "f");
    if (!fs.existsSync(_note_folder)) {
        fs.mkdirSync(_note_folder);
        fs.writeFileSync(path.join(_note_folder, "README.md"), "", "utf-8");
    }
    vscode.window.showInformationMessage(_note_folder);
    const uri = vscode.Uri.file(_note_folder);
    await vscode.commands.executeCommand("vscode.openFolder", uri, true);
};

export const preview_note_doc_handler = async (nId: number) => {
    const _doc_readme_uri = vscode.Uri.file(path.join(workspaceRootPath, "notes", nId.toString(), "d", "README.md"));
    await vscode.commands.executeCommand("vscode.open", _doc_readme_uri);
    await vscode.commands.executeCommand("markdown.showPreviewToSide", _doc_readme_uri, { sideBySide: true });
};

function refreshPreview(nodeFsPath) {
    vscode.commands.executeCommand(commandNameShowVsNotePreview, nodeFsPath)
        .then(null, (reason) => vscode.window.showErrorMessage(reason));
}

export const view_vsnote_handler = async (nodePath: string) => provider.update(nodePath);
