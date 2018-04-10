import * as fs from "fs";
import * as path from "path";

import * as vscode from "vscode";

import { emptyNodeIdxObj, genNoteMate, workspaceRoot } from "./vsnote.lib";
import { ICategory, IIndex, INote } from "./vsnote.note";

export class HtmlNote {
  private _notePath: string;
  private _noteMeta: IIndex;

  constructor(notePath: string) {
    this._notePath = notePath;
    this._noteMeta = genNoteMate(notePath);
  }

  public generateHTML() {
    if (this._notePath) {
      const categorysHtml = this._noteMeta.categorys.map((category, idx) => this.category(category, idx)).join("");
      return `<body>${categorysHtml}</body>`;
    } else {
      return "";
    }
  }

  private category(category: ICategory, cIdx: number): string {
    const cols = category.cols;
    const notes = category.notes;
    const cName = category.name;
    return `<h3>${cName} &nbsp; ${this.insertNoteButton(cIdx)} ${this.updateCategoryButton(cIdx)}</h3><table border="1" style="width:100%">` +
      "<table border='1' width='100%'>" + notes.map((note) => this.note(cIdx, cols, note)).join("") + "</table>";
  }

  private note(cIdx: number, cols: number, note: INote): string {
    const func = (n: number) => {
      fs.readFileSync(path.join(workspaceRoot, this._notePath, `n-${note.i}`, n.toString()), "utf-8");
    };

    const noteHtml = ["<tr>"];
    noteHtml.push(`<td width="5%"><a>${note.i} ${this.viewDoc(note.d)} ${this.viewFile(note.f)}</a></td>`);
    for (let i = 1; i <= cols; i++) {
      noteHtml.push(`<td><pre>${func(i)}</pre></td>`);
    }
    noteHtml.push("<td>", this.updateNoteButton(cIdx, note.i, cols), this.deleteNoteButton(cIdx, note.i), "</td>");
    noteHtml.push("</tr>");

    return noteHtml.join("");
  }

  private href(command: string, ...args: any[]): string {
    return encodeURI("command:extension." + command + "?" + JSON.stringify(args));
  }

  private insertNoteButton(cIdx: number): string {
    return `<a style="color:red" href="${this.href("insert.note", this._notePath, cIdx)}">Insert</a>`;
  }

  private deleteNoteButton(cIdx: number, nIdx: number) {
    return `<a style="color:red" href="${this.href("delete.note", this._notePath, cIdx, nIdx)}">Delete</a>`;
  }

  private updateNoteButton(cIdx: number, nIdx: number, cols: number) {
    const buttons: string[] = [];
    for (let i = 1; i <= cols; i++) {
      buttons.push(`<a style="color:red" href="${this.href("update.note", this._notePath, cIdx, nIdx)}">Update-${i}</a><br/>`);
    }
    return buttons.join("");
  }

  private updateCategoryButton(cIdx: number) {
    return `<a style="color:red" href="${this.href("update.category", this._notePath, cIdx)}"></a>`;
  }

  private viewDoc(e: number) {
    return e ? "| <a>D</a>" : "";
  }

  private viewFile(e: number) {
    return e ? "| <a>F</a>" : "";
  }

}
