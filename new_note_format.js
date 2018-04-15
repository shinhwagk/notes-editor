const fs = require("fs");
const path = require("path");

let new_id = 1;

function mv_file_notes(oldName, nid) {
    fs.renameSync(oldName, `./notes/${nid}`)
}

function gen_old_note_path(nodePath, note_id) {
    return path.join(nodePath, "n-" + note_id);
}

function reset_data_format(nodePath) {
    const indexFile = path.join(nodePath, ".index.json");

    const idxObj = JSON.parse(fs.readFileSync(indexFile, "UTF-8"));
    const categorys = idxObj.categorys;
    for (let i = 0; i < categorys.length; i++) {
        const notes = categorys[i].notes;
        console.info("notes: ", JSON.stringify(notes))
        for (let j = 0; j < notes.length; j++) {
            console.info("note: ", notes[j])
            const old_note_path = gen_old_note_path(nodePath, notes[j].i);
            console.info("old_note_path: ", old_note_path, new_id);
            notes[j].i = new_id
            new_id += 1;
            mv_file_notes(old_note_path, new_id)
        }
    }
    delete idxObj.seq;
    console.info(JSON.stringify(idxObj))
    console.info(JSON.stringify(new_id))
    fs.writeFileSync(indexFile, JSON.stringify(idxObj), "UTF-8")
    for (const label of idxObj.labels) {
        reset_data_format(path.join(nodePath, label));
    }
}

reset_data_format("./")