import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

class NoteProvider implements vscode.TreeDataProvider<Dependency> {

  constructor(private workspaceRoot: string) { }

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    // if (!this.workspaceRoot) {
    // vscode.window.showInformationMessage('No dependency in empty workspace');
    // return Promise.resolve([]);
    // }
    const p = path.join(this.workspaceRoot, 'index.json');

    vscode.window.showInformationMessage(p);

    const packageJson = JSON.parse(fs.readFileSync("e:/github3/looke/index.json", 'utf-8'));
    vscode.window.showInformationMessage(JSON.stringify(packageJson["labels"]))

    const a: Dependency[] = packageJson["labels"].map(label => new Dependency(label, vscode.TreeItemCollapsibleState.Collapsed))

    return new Promise(resolve => resolve(a));
  }
}

class Dependency extends vscode.TreeItem {

  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
  }

  // iconPath = {
  //   light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'dependency.svg'),
  //   dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'dependency.svg')
  // };

  contextValue = 'dependency';

}

export const makeNoteProvider: (rootPath: string) => vscode.TreeDataProvider<Dependency> = (rootPath) => new NoteProvider(rootPath);