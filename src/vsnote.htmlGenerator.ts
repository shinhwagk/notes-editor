import * as fs from 'fs';
import * as path from 'path';

import * as vscode from 'vscode';

import { genNodeIndexObj } from './vsnote.lib';

const genHtmlHref = (command: string, ...args: any[]) => {
  return encodeURI("command:extension." + command + '?' + JSON.stringify(args))
}

const genNoteDocView = (doc) => {
  return doc ? "<button>ab</button>" : "<button>ab</button>";
}

const genNoteFileView = (file) => {
  return file ? "<button>ab</button>" : "<button>ab</button>";
}

const genNoteHtml = (cols: number) => (props: NoteNote) => {
  const func = (n: string) => fs.readFileSync(path.join(gloglpath, `n-${props.i}`, n), "utf-8")

  let noteHtml = '<tr>'
  noteHtml += `<td style="width:15px"><a>${props.i}</a></td>`
  for (let i = 0; i < cols; i++) {
    noteHtml += `<td><pre>${func((i + 1).toString())}</pre></td>`
  }
  noteHtml += `</tr>`
  return noteHtml
}

const genAddNoteUi = (nodeFsPath, cIdx: number) => {
  const addUi = `<a style="color:red" href="${genHtmlHref('add.note', nodeFsPath, cIdx)}">add</a>`
  const delUi = `<a style="color:red" href="${genHtmlHref('deleteNote', nodeFsPath, cIdx)}">del</a>`
  const updUi = `<a style="color:red" href="${genHtmlHref('modifyNote', nodeFsPath, cIdx)}">update</a>`
  return "&nbsp;" + addUi + "&nbsp;" + updUi + "&nbsp;" + delUi
}

const genCategoryHtml = (props: NoteCategory, cIdx: number) => {
  const genNoteHtmlFun = genNoteHtml(props.cols);
  return `<h3>${props.name}${genAddNoteUi(gloglpath, cIdx)}</h3><table border="1" style="width:100%">` + props.notes.map(note => genNoteHtmlFun(note)).join("") + '</table>'
}

let gloglpath: string;
const genHtmlView = (nodeFsPath: string) => {
  gloglpath = nodeFsPath
  const indexContent = nodeFsPath ? genNodeIndexObj(nodeFsPath) : JSON.parse(`{"labels":[],"categorys":[],"seq":1}`);

  return `
    <head></head>
    <body>${indexContent["categorys"].map((category, idx) => genCategoryHtml(category, idx)).join("")}</body>`
}

interface NoteIndex {
  labels: string[];
  categorys: NoteCategory[];
}

interface NoteCategory {
  cols: number;
  name: string;
  notes: NoteNote[];
}

interface NoteNote {
  d: number; // doc/markdown
  f: number; // files
  i: number; // id
}

export { genHtmlView }