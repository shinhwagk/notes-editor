import * as fs from "fs";
import * as path from "path";

import * as vscode from "vscode";

import { emptyNodeIdxObj, genNoteMate } from "./vsnote.lib";
import { ICategory, IIndex, INote } from "./vsnote.note";

export class HtmlNote {
  private _nodePath: string;
  private _noteMeta: IIndex;

  constructor(notePath: string) {
    this._nodePath = notePath;
    this._noteMeta = genNoteMate(notePath);
  }

  public generateHTML() {
    const categorysHtml = this._noteMeta.categorys.map((category, idx) => this.category(category, idx)).join("");
    return `<body>${categorysHtml}</body>`;
  }

  private category(category: ICategory, cIdx: number) {
    const cols = category.cols;
    const notes = category.notes;
    const cName = category.name;
    return `<h3>${cName}${this.insertNoteButton(cIdx)}</h3><table border="1" style="width:100%">` +
      "<table>" + notes.map((note) => this.note(cols, note)).join("") + "</table>";
  }

  private note = (cols: number, note: INote) => {
    const func = (n: number) => fs.readFileSync(path.join(this._nodePath, `n-${note.i}`, n.toString()), "utf-8");

    const noteHtml = ["<tr>"];
    noteHtml.push(`<td style="width:15px"><a>${note.i}</a></td>`);
    for (let i = 1; i <= cols; i++) {
      noteHtml.push(`<td><pre>${func(i)}</pre></td>`);
    }
    noteHtml.push("</tr>");
    return noteHtml.join("");
  }

  private href(command: string, ...args: any[]) {
    return encodeURI("command:extension." + command + "?" + JSON.stringify(args));
  }

  private doc(doc: number) { // 0 or 1
    return doc ? `<a href="${this.href("")}">doc</a>` : "<a>ab</a>";
  }

  private file(file: number) { // 0 or 1
    return file ? "<a>file</a>" : "<a>ab</a>";
  }

  private insertNoteButton(cIdx: number) {
    const addUi = `<a style="color:red" href="${this.href("insert.note", this._nodePath, cIdx)}">add</a>`;
    // const delUi = `<a style="color:red" href="${this.genHref("delete.note", this._nodePath, cIdx)}">del</a>`;
    // const updUi = `<a style="color:red" href="${this.genHref("update.note", this._nodePath, cIdx)}">update</a>`;
    return "&nbsp;" + addUi;
  }

}
