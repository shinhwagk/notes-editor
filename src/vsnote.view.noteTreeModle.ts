import * as fs from "fs";
import * as path from "path";

import * as vscode from "vscode";

import { jsonFileToObj } from "./vsnote.lib";
import { commandNameShowVsNotePreview } from "./vsnote.settings";
import { INoteNode } from "./vsnote.view.noteNode";

export class NoteTreeModle {
  private workspaceRoot: string = vscode.workspace.workspaceFolders[0].uri.fsPath;

  private indexName = ".index.json";

  public async getChildren(element?: INoteNode): Promise<INoteNode[]> {
    return this.genNodeTree(element.parent);
  }

  public getTreeItem(element: INoteNode): vscode.TreeItem {
    const indexPath = this.genNodeFsPath(this.genNodePath(element.parent));
    return {
      collapsibleState: element.child ? 1 : 0, // vscode.TreeItemCollapsibleState
      command: { title: "Show Vscode Note", command: commandNameShowVsNotePreview, arguments: [indexPath] },
      label: element.label,
    };
  }

  private genNodeTree(parent?: string): INoteNode[] {
    const indexPath = this.genIndexPath(parent).labels.map((label: string) => this.genChildNoteNode(label, parent));
    return jsonFileToObj(indexPath) as INoteNode[];
  }

  private genIndexPath(nodePath?: string) {
    const paths = [this.workspaceRoot, this.indexName];
    if (nodePath) {
      paths.splice(1, 0, nodePath);
    }
    return path.join(...paths);
  }

  private genNodePath(label: string, parent?: string): string {
    return parent ? path.join(parent, label) : label;
  }

  private genNodeFsPath(nodePath): string {
    return path.join(this.workspaceRoot, nodePath);
  }

  private genChildNoteNode(label: string, parent?: string) {
    const parentPath = this.genNodePath(label, parent);
    const indexPath = this.genIndexPath(parentPath);
    return { parent: parentPath, label, child: this.existChildCheck(indexPath) };
  }

  private existChildCheck(indexPath: string): boolean {
    return jsonFileToObj(indexPath).labels.length >= 1;
  }
}
