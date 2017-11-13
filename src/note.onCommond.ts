import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export const disposable1 = vscode.commands.registerCommand('extension.modifyNote', (nodePath) => nodePath);
export const disposable2 = vscode.commands.registerCommand('extension.deleteNote', (nodePath) => nodePath);

export const disposable3 = vscode.commands.registerCommand('extension.addCategory', (nodePath) => nodePath);
export const disposable13 = vscode.commands.registerCommand('extension.modifyCategory', (nodePath) => nodePath);
export const disposable23 = vscode.commands.registerCommand('extension.deleteCategory', (nodePath) => nodePath);

vscode.commands.registerCommand('extension.addLabel', (nodePath) => nodePath);
vscode.commands.registerCommand('extension.modifyLabel', (nodePath) => nodePath);
vscode.commands.registerCommand('extension.deleteLabel', (nodePath) => nodePath);

export const activates = (context: vscode.ExtensionContext) => {
    context.subscriptions.push(vscode.commands.registerCommand('extension.addNote', async (nodePath, categoryIndex) => {
        const itemPickList: vscode.QuickPickItem[] = [];
        itemPickList.push({ label: 'Doc,File', description: '' });
        itemPickList.push({ label: 'Doc', description: '' });
        itemPickList.push({ label: 'File', description: '' });
        itemPickList.push({ label: 'None', description: '' });
        let modeChoice = await vscode.window.showQuickPick(itemPickList);

        let note;
        switch (modeChoice.label) {
            case 'Doc,File': note = { doc: true, file: true }; break;
            case 'Doc': note = { doc: true, file: false }; break;
            case 'File': note = { doc: false, file: true }; break;
            default: note = { doc: false, file: false };
        }

        const indexFilePath = path.join(nodePath, ".index.json")
        const indexContent = JSON.parse(fs.readFileSync(indexFilePath, "UTF-8"))
        indexContent["categorys"][categoryIndex]["notes"].push(note)
        // vscode.window.showInformationMessage(indexFilePath)
        vscode.window.showInformationMessage(JSON.stringify(indexContent))
        fs.writeFileSync(indexFilePath, JSON.stringify(indexContent), { encoding: "UTF-8" })
        vscode.window.showInformationMessage("Ok.")
    }));
}