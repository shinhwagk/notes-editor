import * as fs from "fs";
import * as path from "path";

import * as vscode from "vscode";

import { genNoteMate } from "./vsnote.lib";
import { IIndex } from "./vsnote.note";
import { commandNameShowVsNotePreview } from "./vsnote.settings";
import { INoteNode } from "./vsnote.view.node";

export class NoteTreeModle {
  private workspaceRoot: string = vscode.workspace.workspaceFolders[0].uri.fsPath;

  public async getChildren(element?: INoteNode): Promise<INoteNode[]> {
    return this.genNodeTree(element);
  }

  public getTreeItem(element: INoteNode): vscode.TreeItem {
    return {
      collapsibleState: element.child ? 1 : 0, // vscode.TreeItemCollapsibleState
      command: {
        arguments: [path.join(element.parent, element.label)],
        command: commandNameShowVsNotePreview,
        title: "Show Vscode Note",
      },
      label: element.label,
    };
  }

  private genNodeTree(element?: INoteNode): INoteNode[] {
    let _parent = "";
    if (element) {
      _parent = element.parent ? path.join(element.parent, element.label) : element.label;
    }

    const nodeMate = _parent ? genNoteMate(_parent) : genNoteMate();
    const noteNodes = nodeMate.labels.map((label: string) => this.genChildNode(_parent, label));
    return noteNodes;
  }

  private genChildNode(parent: string, label: string) {
    // const indexPath = this.genIndexPath(parentPath);
    return { parent, label, child: this.existChildCheck(parent, label) };
    // return { parent, label, child: false };
  }

  private existChildCheck(parent: string, label: string): boolean {
    return genNoteMate(path.join(parent, label)).labels.length >= 1;
  }
}
