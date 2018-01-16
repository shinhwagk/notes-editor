import * as fs from 'fs';
import * as path from 'path';

import * as vscode from 'vscode';

import { commandNameShowVsNotePreview } from './vsnote.setting'

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

export interface NoteNode {
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

  private genNodeFsPath = (nodePath) => path.join(this.workspaceRoot, nodePath)

  private genChildNoteNode = (label: string, parentPath: string) => { return { parent: parentPath, label: label, child: this.existChildCheck(this.genIndexPath(parentPath)) } }

  private existChildCheck = (indexPath: string) => fileToJson(indexPath)["labels"].length >= 1;

  public async getChildren(element?: NoteNode): Promise<NoteNode[]> {
    return element ? this.genNodeTree(element.parent) : this.genNodeTree()
  }

  public getTreeItem(element: NoteNode): vscode.TreeItem {
    const indexPath = this.genNodeFsPath(this.genNodePath()(element.parent))
    return {
      label: element.label,
      collapsibleState: element.child ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
      command: { title: "Show Vscode Note", command: commandNameShowVsNotePreview, arguments: [indexPath] }
    };
  }

}

const fileToJson: <T>(filePath: string) => T = (filePath: string) => JSON.parse(fs.readFileSync(filePath, "utf-8"));

function makeNoteProvider(rootPath: string) {
  return new NoteTreeProvider(rootPath);
}

export { makeNoteProvider }