import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { NoteNode } from './note.onView';

export const disposable1 = vscode.commands.registerCommand('extension.modifyNote', (nodePath) => nodePath);
// export const disposable2 = vscode.commands.registerCommand('extension.deleteNote', (nodePath) => nodePath);

export const disposable13 = vscode.commands.registerCommand('extension.modifyCategory', (nodePath) => nodePath);
export const disposable23 = vscode.commands.registerCommand('extension.deleteCategory', (nodePath) => nodePath);

vscode.commands.registerCommand('extension.addLabel', (nodePath) => nodePath);
vscode.commands.registerCommand('extension.modifyLabel', (nodePath) => nodePath);
vscode.commands.registerCommand('extension.deleteLabel', (nodePath) => nodePath);

const deleteNoteDisposable = vscode.commands.registerCommand('extension.deleteNote', async (nodePath, cIdx, nIdx) => {

});
const addCategoryDisposable = (rootPath) => vscode.commands.registerCommand('extension.addCategory', async (noteNode: NoteNode) => {
    const indexFilePath = path.join(rootPath, noteNode.parent, ".index.json")
    const x = await vscode.window.showInputBox()

    vscode.window.showInformationMessage(x)
});

const addNoteDisposable = vscode.commands.registerCommand('extension.addNote', async (nodePath, cIdx) => {
    const itemPickList: vscode.QuickPickItem[] = [];
    itemPickList.push({ label: 'Doc,File', description: '' });
    itemPickList.push({ label: 'Doc', description: '' });
    itemPickList.push({ label: 'File', description: '' });
    itemPickList.push({ label: 'None', description: '' });
    let modeChoice = await vscode.window.showQuickPick(itemPickList);

    let note;
    switch (modeChoice.label) {
        case 'Doc,File': note = { d: 1, f: 1 }; break;
        case 'Doc': note = { d: 1, f: 0 }; break;
        case 'File': note = { d: 0, f: 1 }; break;
        default: note = { d: 0, f: 0 };
    }

    const indexFilePath = path.join(nodePath, ".index.json")
    const indexContent = JSON.parse(fs.readFileSync(indexFilePath, "UTF-8"))
    const category = indexContent["categorys"][cIdx]
    const cols: number = category["cols"]
    const notes = category["notes"]
    const cLength = notes.length

    const newDirPath = path.join(nodePath, `${cIdx}-${cLength}`)
    if (!fs.existsSync(newDirPath)) {
        fs.mkdirSync(newDirPath)
    }

    for (let i = 1; i <= cols; i++) {
        fs.writeFileSync(path.join(newDirPath, i.toString()), "", "UTF-8")
    }
    notes.push(note)
    fs.writeFileSync(indexFilePath, JSON.stringify(indexContent), { encoding: "UTF-8" })
    vscode.commands.executeCommand('extension.showVscodeNotePreview', nodePath).then(success => { }, reason => vscode.window.showErrorMessage(reason))
})

export { addNoteDisposable, addCategoryDisposable }