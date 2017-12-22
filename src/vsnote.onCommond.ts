import * as path from 'path';
import * as fs from 'fs';

import * as vscode from 'vscode';

import { deleteFolderRecursive, genNodeIndexObj } from './vsnote.lib'
import { NoteNode } from './vsnote.onView';

const modifyNoteDisposable = vscode.commands.registerCommand('extension.modifyNote', async (nodeFsPath, cIdx) => {
    const indexContent = genNodeIndexObj(nodeFsPath)

    const category = indexContent["categorys"][cIdx]
    // const cols = category["cols"]

    // for (let i = 1; i <= cols; i++) {
    //     const uri = vscode.Uri.file(path.join(nodeFsPath, `n-1`, i.toString()))
    //     vscode.workspace.openTextDocument(uri).then(p => vscode.window.showTextDocument(p))
    // }
});
// // export const disposable2 = vscode.commands.registerCommand('extension.deleteNote', (nodePath) => nodePath);

// export const disposable13 = vscode.commands.registerCommand('extension.modifyCategory', (nodePath) => nodePath);
// export const disposable23 = vscode.commands.registerCommand('extension.deleteCategory', (nodePath) => nodePath);

// vscode.commands.registerCommand('extension.addLabel', (nodePath) => nodePath);
// vscode.commands.registerCommand('extension.modifyLabel', (nodePath) => nodePath);
// vscode.commands.registerCommand('extension.deleteLabel', (nodePath) => nodePath);

function addLabelDisposable(rootFsPath, m) {
    return vscode.commands.registerCommand('extension.addLabel', async (noteNode: NoteNode) => {
        const indexFilePath = path.join(rootFsPath, noteNode.parent)
        vscode.window.showInformationMessage(indexFilePath)

        const labelName = await vscode.window.showInputBox();

        const indexContent = genNodeIndexObj(indexFilePath);
        indexContent["labels"].push(labelName);
        vscode.window.showInformationMessage(JSON.stringify(indexContent))

        fs.mkdirSync(path.join(indexFilePath, labelName))
        fs.writeFileSync(path.join(indexFilePath, labelName, ".index.json"), JSON.stringify({ labels: [], categorys: [], seq: 1 }), { encoding: "UTF-8" })

        fs.writeFileSync(indexFilePath + "/.index.json", JSON.stringify(indexContent), { encoding: "UTF-8" })

        vscode.window.registerTreeDataProvider('vsnote', m);
    });
}

function deleteNoteDisposable(rootFsPath): vscode.Disposable {
    const commandHandler = async (noteNode, cIdx: number) => {
        const indexContent = genNodeIndexObj(noteNode)
        const notePickList: vscode.QuickPickItem[] = [];
        const category = indexContent["categorys"][cIdx.toString()]
        const notes: any[] = category["notes"]
        for (const nId in notes) {
            notePickList.push({ label: notes[nId].i.toString(), description: nId.toString() });
        }
        const noteId = await vscode.window.showQuickPick(notePickList);

        deleteFolderRecursive(path.join(noteNode, `n-${noteId.label}`))

        notes.splice(Number(noteId.description), 1)
        fs.writeFileSync(path.join(noteNode, ".index.json"), JSON.stringify(indexContent), { encoding: "UTF-8" })
        vscode.commands.executeCommand('extension.showVscodeNotePreview', noteNode).then(success => { }, reason => vscode.window.showErrorMessage(reason))
    }
    return vscode.commands.registerCommand('extension.deleteNote', commandHandler);
}

const addCategoryDisposable = (rootPath) => vscode.commands.registerCommand('extension.addCategory', async (noteNode: NoteNode) => {
    const indexFilePath = path.join(rootPath, noteNode.parent, ".index.json")
    const categoryName = await vscode.window.showInputBox()
    const categoryColNumberPickList: vscode.QuickPickItem[] = [];
    for (let i = 1; i <= 5; i++) {
        categoryColNumberPickList.push({ label: i.toString(), description: '' });
    }
    let categoryColNumber = await vscode.window.showQuickPick(categoryColNumberPickList);

    const indexContent = JSON.parse(fs.readFileSync(indexFilePath, "UTF-8"))
    indexContent["categorys"].push({ name: categoryName, cols: Number(categoryColNumber.label), notes: [] })
    fs.writeFileSync(indexFilePath, JSON.stringify(indexContent), { encoding: "UTF-8" })
    vscode.commands.executeCommand('extension.showVscodeNotePreview', noteNode.parent).then(success => { }, reason => vscode.window.showErrorMessage(reason))

});

const addNoteDisposable = vscode.commands.registerCommand('extension.addNote', async (nodePath, cIdx) => {
    const indexFilePath = path.join(nodePath, ".index.json")

    const itemPickList: vscode.QuickPickItem[] = [];
    itemPickList.push({ label: 'Doc,File', description: '' });
    itemPickList.push({ label: 'Doc', description: '' });
    itemPickList.push({ label: 'File', description: '' });
    itemPickList.push({ label: 'None', description: '' });
    let modeChoice = await vscode.window.showQuickPick(itemPickList);

    const indexContent = genNodeIndexObj(nodePath)
    let seq = indexContent["seq"]

    let note;
    switch (modeChoice.label) {
        case 'Doc,File': note = { d: 1, f: 1, i: seq }; break;
        case 'Doc': note = { d: 1, f: 0, i: seq }; break;
        case 'File': note = { d: 0, f: 1, i: seq }; break;
        default: note = { d: 0, f: 0, i: seq };
    }

    const category = indexContent["categorys"][cIdx]
    const cols: number = category["cols"]
    const notes = category["notes"]

    const newDirPath = path.join(nodePath, `n-${seq}`)
    if (!fs.existsSync(newDirPath)) {
        fs.mkdirSync(newDirPath)
    }
    indexContent["seq"] = seq + 1
    for (let i = 1; i <= cols; i++) {
        fs.writeFileSync(path.join(newDirPath, i.toString()), "", "UTF-8")
    }
    notes.push(note)
    fs.writeFileSync(indexFilePath, JSON.stringify(indexContent), { encoding: "UTF-8" })
    vscode.commands.executeCommand('extension.showVscodeNotePreview', nodePath).then(success => { }, reason => vscode.window.showErrorMessage(reason))
})

export { addNoteDisposable, addCategoryDisposable, deleteNoteDisposable, modifyNoteDisposable, addLabelDisposable }