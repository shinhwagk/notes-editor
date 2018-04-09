import * as fs from "fs";
import * as path from "path";

import * as vscode from "vscode";

import { commandNameShowVsNotePreview } from "./vsnote.settings";
import { INoteNode } from "./vsnote.view.noteNode";
import { NoteTreeModle } from "./vsnote.view.noteTreeModle";

export class NoteTreeProvider implements vscode.TreeDataProvider<INoteNode> {

  private noteTreeModle: NoteTreeModle = new NoteTreeModle();

  public getTreeItem(element: INoteNode): vscode.TreeItem {
    return this.noteTreeModle.getTreeItem(element);
  }

  public async getChildren(element?: INoteNode): Promise<INoteNode[]> {
    return this.noteTreeModle.getChildren(element);
  }
}
