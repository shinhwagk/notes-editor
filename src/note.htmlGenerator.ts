import * as fs from 'fs';
import * as vscode from 'vscode';

const genNoteDocView = (doc) => {
  return doc ? "<button>ab</button>" : "<button>ab</button>";
}

const genNoteFileView = (file) => {
  return file ? "<button>ab</button>" : "<button>ab</button>";
}

const genNoteHtml = (cols: number) => (props: NoteNote) => {
  const v = (x) => fs.readFileSync(gloglpath + "/" + props.id + "/" + x, "utf-8")
  return '<tr>' + `<td>${props.id}</td>` + Array.from(Array.from({ length: cols }).keys()).map(idx => `<td><pre>${v(idx + 1)}</pre></td>`).join("") + '</tr>'
}

const genAddNoteUi = (nodePath, categoryIndex: number) => {
  return `<a href="${encodeURI('command:extension.addNote?' + JSON.stringify([nodePath, categoryIndex]))}"">add</a>`
}

const genCategoryHtml = (props: NoteCategory, categoryIndex: number) => {
  const genNoteHtmlFun = genNoteHtml(props.cols);
  return `<div><div>${props.name}${genAddNoteUi(gloglpath, categoryIndex)}</div>` + '<table border="1" style="width:100%">' + props.notes.map(note => genNoteHtmlFun(note)).join("") + '</table></div>'
}

let gloglpath: string;
const generateHtmlView = (nodeFsPath: string) => {
  gloglpath = nodeFsPath
  const indexContent = JSON.parse(nodeFsPath ? fs.readFileSync(nodeFsPath + "/" + ".index.json", "UTF-8") : `{"labels":[],"categorys":[]}`);

  return `
    <head>
    </head>
    <body>
        ${indexContent["categorys"].map((category, index) => genCategoryHtml(category, index)).join("")}
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
  doc?: boolean;
  file?: boolean;
  id: number;
}

export { generateHtmlView }