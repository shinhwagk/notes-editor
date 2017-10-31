import * as React from "react";
import * as ReactDOM from "react-dom";

const indexObj = JSON.parse((document.getElementById("indexContent") as HTMLTextAreaElement).value)

function Note(props) {
    const note = Array.from(Array.from({ length: props.cols }).keys()).map(idx => <td>{props.notes[idx]}</td>)
    return <tr>{note}</tr>
}


function Category(props) {
    const b = props.notes.map(note => <Note notes={note.notes} doc={note.doc} file={note.file} />)
    return <div>{props.name}<table>{b}</table></div>;
}

function Notes(categories) {
    const listItems = categories.map(c => <Category cols={c["cols"]} name={c["name"]} notes={c["notes"]} />);
    return <div></div>
}

const element = <Notes aaa={indexObj} />;

ReactDOM.render(
    element,
    document.getElementById("example")
);

interface Category {
    cols: number;
    name: string;
    notes: Note[];
}

interface Note {
    doc?: boolean;
    file?; boolean;
}