import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

class NoteTreeProvider implements vscode.TreeDataProvider<NoteNode> {

  private noteTreeModle: NoteTreeModle;

  constructor(private workspaceRoot: string) {
    this.noteTreeModle = new NoteTreeModle(workspaceRoot)
  }

  getTreeItem(element: NoteNode): vscode.TreeItem {
    return {
      label: element.label,
      collapsibleState: element.child ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
    };
  }

  async getChildren(element?: NoteNode): Promise<NoteNode[]> {
    return element ? this.noteTreeModle.makeLeafNodeTree(element.parent) : this.noteTreeModle.makeTopNodeTree()
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

  public makeTopNodeTree = () => fileToJson(this.topIndexPath)["labels"].map((label: string) => this.makeNoteNode(label, this.topNodePath(label)));

  public makeLeafNodeTree = (parent: string) => fileToJson(this.leafIndexPath(parent))["labels"].map((label: string) => this.makeNoteNode(label, this.leafNodePath(parent)(label)));

  private topIndexPath = path.join(this.workspaceRoot, this.indexName);

  private leafIndexPath = (nodePath: string) => path.join(this.workspaceRoot, nodePath, this.indexName);

  private topNodePath = (label: string) => label

  private leafNodePath = (parent: string) => (label: string) => path.join(parent, label)

  private makeNoteNode = (label: string, nodePath: string) => { return { parent: nodePath, label: label, child: this.existChildCheck(this.leafIndexPath(nodePath)) } }

  private existChildCheck = (indexPath: string) => fileToJson(indexPath)["labels"].length >= 1;
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