import * as fs from "fs";
import * as path from "path";

import * as vscode from "vscode";

import { INoteNode } from "./vsnote.view.node";
import { NoteTreeModle } from "./vsnote.view.noteTreeModle";

export class NoteTreeProvider implements vscode.TreeDataProvider<INoteNode> {

  private noteTreeModle: NoteTreeModle = new NoteTreeModle();

  public getTreeItem(element: INoteNode): vscode.TreeItem {
    return this.noteTreeModle.getTreeItem(element);
  }

  public getChildren(element?: INoteNode): Promise<INoteNode[]> {
    return this.noteTreeModle.getChildren(element);
  }
}
