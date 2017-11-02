import * as fs from 'fs';

const genNoteDocView = (doc) => {
  return doc ? "<button>ab</button>" : "<button>ab</button>";
}

const genNoteFileView = (file) => {
  return file ? "<button>ab</button>" : "<button>ab</button>";
}

const genNoteHtml = (cols: number) => (props: NoteNote) => {
  return '<tr>' + Array.from(Array.from({ length: cols }).keys()).map(idx => `<td>${idx}</td>`).join("") + '</tr>'
}

const genCategoryHtml = (props: NoteCategory) => {
  const genNoteHtmlFun = genNoteHtml(props.cols);
  return `<div><div>${props.name}</div>` + '<table border="1" style="width:100%">' + props.notes.map(note => genNoteHtmlFun(note)).join("") + '</table></div>'
}

const generateHtmlView = (indexFilePath: string) => {
  const indexContent = JSON.parse(indexFilePath ? fs.readFileSync(indexFilePath, "UTF-8") : `{"labels":[],"categorys":[]}`);

  return `
    <head>
    </head>
    <body>
        ${indexContent["categorys"].map(category => genCategoryHtml(category)).join("")}
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
}

export { generateHtmlView }