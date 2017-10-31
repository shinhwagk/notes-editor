import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

class NoteTreeProvider implements vscode.TreeDataProvider<NoteNode> {

  private noteTreeModle: NoteTreeModle;

  constructor(private workspaceRoot: string) {
    this.noteTreeModle = new NoteTreeModle(workspaceRoot)
  }

  getTreeItem(element: NoteNode): vscode.TreeItem {
    return this.noteTreeModle.getTreeItem(element)
  }

  async getChildren(element?: NoteNode): Promise<NoteNode[]> {
    return this.noteTreeModle.getChildren(element)
  }
}

interface NoteNode {
  parent: string
  label: string
  child?: boolean
}

class NoteTreeModle {
  constructor(private workspaceRoot: string) { }

  private indexName = ".index.json"

  private genNodeTree = (parent?: string) => fileToJson(this.genIndexPath(parent))["labels"].map((label: string) => this.genChildNoteNode(label, this.genNodePath(parent)(label)));

  private genIndexPath = (nodePath?: string) => nodePath ? path.join(this.workspaceRoot, nodePath, this.indexName) : path.join(this.workspaceRoot, this.indexName)

  private genNodePath = (parent?: string) => (label: string) => parent ? path.join(parent, label) : label;

  private genChildNoteNode = (label: string, parentPath: string) => { return { parent: parentPath, label: label, child: this.existChildCheck(this.genIndexPath(parentPath)) } }

  private existChildCheck = (indexPath: string) => fileToJson(indexPath)["labels"].length >= 1;

  public async getChildren(element?: NoteNode): Promise<NoteNode[]> {
    return element ? this.genNodeTree(element.parent) : this.genNodeTree()
  }

  public getTreeItem(element: NoteNode): vscode.TreeItem {
    const indexPath = this.genIndexPath(this.genNodePath()(element.parent))
    return {
      label: element.label,
      collapsibleState: element.child ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
      command: { title: "Show Vscode Note", command: "extension.showVscodeNotePreview", arguments: [indexPath] }
    };
  }

}

const fileToJson: <T>(filePath: string) => T = (filePath: string) => JSON.parse(fs.readFileSync(filePath, "utf-8"));


// class Dependency extends vscode.TreeItem {

//   constructor(
//     public readonly label: string,
//     public readonly collapsibleState: vscode.TreeItemCollapsibleState,
//     public readonly command?: vscode.Command
//   ) {
//     super(label, collapsibleState);
//   }

//   // iconPath = {
//   //   light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'dependency.svg'),
//   //   dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'dependency.svg')
//   // };

//   contextValue = 'dependency';

// }

export const makeNoteProvider: (rootPath: string) => vscode.TreeDataProvider<NoteNode> = (rootPath) => new NoteTreeProvider(rootPath);