import * as React from "react";
import * as ReactDOM from "react-dom";

const indexObj = JSON.parse((document.getElementById("indexContent") as HTMLTextAreaElement).value)
console.info(indexObj["labels"][0])

function Category(category) {
    return <div>{idxContent.aaa["labels"][0]}</div>;
}

function Notes(idxContent) {
    return <div>{idxContent.aaa["labels"][0]}</div>;
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