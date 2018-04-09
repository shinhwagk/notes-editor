import * as fs from "fs";
import * as path from "path";

import * as vscode from "vscode";

import { emptyNodeIdxObj, genNodeIdxObj } from "./vsnote.lib";
import { ICategory, IIndex, INote } from "./vsnote.note";

export class ViewHtmlNote {
  private _nodePath: string;
  private _noteObj: IIndex;

  constructor(notePath: string) {
    this._nodePath = notePath;
    this._noteObj = genNodeIdxObj(notePath);
  }

  public htmlView() {
    return `
    <head></head>
    <body>${this._noteObj.categorys.map((category, idx) => this.genCategory(category, idx)).join("")}</body>`;
  }

  private genHref(command: string, ...args: any[]) {
    return encodeURI("command:extension." + command + "?" + JSON.stringify(args));
  }

  private genNoteDocView(doc) {
    return doc ? "<button>ab</button>" : "<button>ab</button>";
  }

  private genNoteFileView(file) {
    return file ? "<button>ab</button>" : "<button>ab</button>";
  }

  private genNote = (cols: number) => (props: INoteNote) => {
    const func = (n: string) => fs.readFileSync(path.join(this._nodePath, `n-${props.i}`, n), "utf-8");

    let noteHtml = "<tr>";
    noteHtml += `<td style="width:15px"><a>${props.i}</a></td>`;
    for (let i = 0; i < cols; i++) {
      noteHtml += `<td><pre>${func((i + 1).toString())}</pre></td>`;
    }
    noteHtml += `</tr>`;
    return noteHtml;
  }

  private genInsertNoteButton(cIdx: number) {
    const addUi = `<a style="color:red" href="${this.genHref("insert.note", this._nodePath, cIdx)}">add</a>`;
    // const delUi = `<a style="color:red" href="${this.genHref("delete.note", this._nodePath, cIdx)}">del</a>`;
    // const updUi = `<a style="color:red" href="${this.genHref("update.note", this._nodePath, cIdx)}">update</a>`;
    return "&nbsp;" + addUi;
  }

  private genCategory(props: ICategory, cIdx: number) {
    const genNoteHtmlFun = genNoteHtml(props.cols);
    return `<h3>${props.name}${genInsertNoteButton(cIdx)}</h3><table border="1" style="width:100%">` + props.notes.map((note) => genNoteHtmlFun(note)).join("") + "</table>";
  }

}
