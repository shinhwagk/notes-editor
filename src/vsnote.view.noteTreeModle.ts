import * as fs from "fs";
import * as path from "path";

import * as vscode from "vscode";

import { genNoteMate, jsonFileToObj } from "./vsnote.lib";
import { IIndex } from "./vsnote.note";
import { commandNameShowVsNotePreview } from "./vsnote.settings";
import { INoteNode } from "./vsnote.view.node";

export class NoteTreeModle {
  private workspaceRoot: string = vscode.workspace.workspaceFolders[0].uri.fsPath;

  public async getChildren(element?: INoteNode): Promise<INoteNode[]> {
    return element ? this.genNodeTree(element.parent) : this.genNodeTree();
  }

  public getTreeItem(element: INoteNode): vscode.TreeItem {
    vscode.window.showInformationMessage(JSON.stringify(element));
    console.info(JSON.stringify(element));
    const indexPath = this.genNodeFsPath(this.genNodePath(element.parent));
    return {
      collapsibleState: element.child ? 1 : 0,
      // vscode.TreeItemCollapsibleState
      command: { title: "Show Vscode Note", command: commandNameShowVsNotePreview, arguments: [indexPath] },
      label: element.label,
    };
  }

  private genNodeTree(parent?: string): INoteNode[] {
    const indexPath = this.genIndexPath(parent);
    const noteNodes = genNoteMate(indexPath).labels.map((label: string) => this.genChildNode(label, parent));
    return noteNodes;
  }

  private genIndexPath(parent?: string) {
    const paths = [this.workspaceRoot];
    if (parent) {
      paths.push(parent);
    }
    return path.join(...paths);
  }

  private genNodePath(label: string, parent?: string): string {
    return parent ? path.join(parent, label) : label;
  }

  private genNodeFsPath(nodePath): string {
    return path.join(this.workspaceRoot, nodePath);
  }

  private genChildNode(label: string, parent?: string) {
    const parentPath = parent || "";
    const indexPath = this.genIndexPath(parentPath);
    return { parent: parentPath, label, child: this.existChildCheck(indexPath) };
  }

  private existChildCheck(indexPath: string): boolean {
    return genNoteMate(indexPath).labels.length >= 1;
  }
}
