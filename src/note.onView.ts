import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
fs.readFileSync
class NoteTreeProvider implements vscode.TreeDataProvider<NoteNode> {

  constructor(private workspaceRoot: string) { }

  getTreeItem(element: NoteNode): vscode.TreeItem {
    return {
      label: element.label,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed
    };
  }

  getChildren(element?: NoteNode): Thenable<NoteNode[]> {
    let p: string;
    let dependencies: NoteNode[];

    if (element) {
      p = path.join(this.workspaceRoot, "index", element.parent, element.label + ".json");
      const nodeJson = JSON.parse(fs.readFileSync(p, 'utf-8'));
      dependencies = nodeJson["labels"].map(label => { return { parent: path.join(element.parent, element.label), label: label } })
    } else {
      p = path.join(this.workspaceRoot, 'index.json');
      const nodeJson = JSON.parse(fs.readFileSync(p, 'utf-8'));
      dependencies = nodeJson["labels"].map(label => { return { parent: "", label: label } })
    }




    return new Promise(resolve => resolve(dependencies));
  }
}

interface NoteNode {
  parent: string
  label: string
}

const makeNoteNodePath = (parent: string, label: string) => path.join(this._parent, this.label);

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

export const makeNoteProvider: (rootPath: string) => vscode.TreeDataProvider<NoteNode> = (rootPath) => new NoteTreeProvider(rootPath);