import * as vscode from 'vscode';
import * as path from 'path';

export class NoteProvider implements vscode.TreeDataProvider<Dependency> {


  constructor(private workspaceRoot: string) { }

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No dependency in empty workspace');
      return Promise.resolve([]);
    }
    vscode.window.showInformationMessage('aaaa');

    return new Promise(resolve => resolve([new Dependency("aaaa", vscode.TreeItemCollapsibleState.None)]));
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

