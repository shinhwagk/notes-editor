import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';

const genNoteDocView = (doc) => {
  return doc ? "<button>ab</button>" : "<button>ab</button>";
}

const genNoteFileView = (file) => {
  return file ? "<button>ab</button>" : "<button>ab</button>";
}

const genNoteHtml = (cols: number) => (props: NoteNote) => {
  const v = (x: string) => fs.readFileSync(path.join(gloglpath, `n-${props.i}`, x), "utf-8")
  return '<tr>' + `<td style="width:15px">${props.i}</td>` + Array.from(Array.from({ length: cols }).keys()).map(idx => `<td><pre>${v((idx + 1).toString())}</pre></td>`).join("") + `<td><a style="color:red" href="${encodeURI('command:extension.modifyNote?' + JSON.stringify([gloglpath, 0]))}">U</a></td>` + '</tr>'
}

const genAddNoteUi = (nodePath, cIdx: number) => {
  const addUi = `<a style="color:red" href="${encodeURI('command:extension.addNote?' + JSON.stringify([nodePath, cIdx]))}">add</a>`
  const delUi = `<a style="color:red" href="${encodeURI('command:extension.deleteNote?' + JSON.stringify([nodePath, cIdx]))}">del</a>`
  return "&nbsp;" + addUi + "&nbsp;" + delUi
}

const genCategoryHtml = (props: NoteCategory, cIdx: number) => {
  const genNoteHtmlFun = genNoteHtml(props.cols);
  return `<h3>${props.name}${genAddNoteUi(gloglpath, cIdx)}</h3><table border="1" style="width:100%">` + props.notes.map(note => genNoteHtmlFun(note)).join("") + '</table>'
}

let gloglpath: string;
const generateHtmlView = (nodeFsPath: string) => {
  gloglpath = nodeFsPath
  const indexContent = JSON.parse(nodeFsPath ? fs.readFileSync(nodeFsPath + "/" + ".index.json", "UTF-8") : `{"labels":[],"categorys":[]}`);

  return `
    <head>
    </head>
    <body>
        ${indexContent["categorys"].map((category, idx) => genCategoryHtml(category, idx)).join("")}
    </body>`
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

export { generateHtmlView }