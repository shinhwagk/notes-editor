import * as fs from "fs";
import * as path from "path";

import * as vscode from "vscode";

import { deleteFolderRecursive, genNoteMate } from "./vsnote.lib";
import { IIndex } from "./vsnote.note";
import { commandNameShowVsNotePreview, workspaceRootFsPath } from "./vsnote.settings";
import { INoteNode } from "./vsnote.view.node";

export const update_note_command_handler = async (nodeFsPath, cIdx) => {
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

    const _idxFile: string = noteNode ? path.join(workspaceRootFsPath, noteNode.parent) : workspaceRootFsPath;

    const _label: string = await vscode.window.showInputBox();
    if (!_label) { return; }
    const _idxObj = genNoteMate(_idxFile);
    _idxObj.labels.push(_label);
    vscode.window.showInformationMessage(JSON.stringify(_idxObj));

    fs.mkdirSync(path.join(_idxFile, _label));

    const _emptyIdxObj = { labels: [], categorys: [], seq: 1 };

    fs.writeFileSync(path.join(_idxFile, _label, ".index.json"), JSON.stringify(_emptyIdxObj), "UTF-8");
    fs.writeFileSync(path.join(_idxFile, ".index.json"), JSON.stringify(_idxObj), "UTF-8");

    vscode.window.registerTreeDataProvider("vsnote", m);
};

export const delete_note_command_handler = async (noteNode, cIdx: number) => {
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

export const inesrt_category_command_handler = async (noteNode: INoteNode) => {
    const indexFilePath = path.join(workspaceRootFsPath, noteNode.parent, ".index.json");
    const categoryName = await vscode.window.showInputBox();
    const categoryColNumberPickList: vscode.QuickPickItem[] = [];
    for (let i = 1; i <= 5; i++) {
        categoryColNumberPickList.push({ label: i.toString(), description: "" });
    }
    const categoryColNumber = await vscode.window.showQuickPick(categoryColNumberPickList);

    const indexContent = JSON.parse(fs.readFileSync(indexFilePath, "UTF-8"));
    indexContent.categorys.push({ name: categoryName, cols: Number(categoryColNumber.label), notes: [] });
    fs.writeFileSync(indexFilePath, JSON.stringify(indexContent), { encoding: "UTF-8" });
    refreshPreview(noteNode.parent);
};

export const insert_note_command_handler = async (nodePath, cIdx) => {
    const indexFile: string = path.join(nodePath, ".index.json");
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
    const notes = category.notes;

    const newDirPath = path.join(nodePath, `n-${seq}`);
    if (!fs.existsSync(newDirPath)) {
        fs.mkdirSync(newDirPath);
    }
    nodeMeta.seq = seq + 1;
    for (let i = 1; i <= cols; i++) {
        fs.writeFileSync(path.join(newDirPath, i.toString()), "", "UTF-8");
    }

    let note;
    switch (modeChoice.label) {
        case "Doc,File":
            note = { d: 1, f: 1, i: seq };
            fs.mkdirSync(path.join(newDirPath, "d"));
            fs.writeFileSync(path.join(newDirPath, "d", "README.md"), "", "UTF-8");
            fs.mkdirSync(path.join(newDirPath, "f"));
            break;
        case "Doc":
            note = { d: 1, f: 0, i: seq };
            fs.mkdirSync(path.join(newDirPath, "d"));
            fs.writeFileSync(path.join(newDirPath, "d", "README.md"), "", "UTF-8");
            break;
        case "File":
            note = { d: 0, f: 1, i: seq };
            fs.mkdirSync(path.join(newDirPath, "f"));
            break;
        default:
            note = { d: 0, f: 0, i: seq };
    }

    notes.push(note);
    fs.writeFileSync(indexFile, JSON.stringify(nodeMeta), "UTF-8");
    refreshPreview(nodePath);
};

function refreshPreview(nodeFsPath) {
    vscode.commands.executeCommand(commandNameShowVsNotePreview, nodeFsPath)
        .then(null, (reason) => vscode.window.showErrorMessage(reason));
}
