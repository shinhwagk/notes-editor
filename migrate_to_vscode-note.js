const fs = require("fs");
const path = require("path");

const objectPath = require("object-path")

const domains = {}

function reset_notes(nodePath) {
    const indexFile = path.join(nodePath, ".index.json");
    const idxObj = JSON.parse(fs.readFileSync(indexFile, "UTF-8"));
    for (const category of idxObj.categorys) {
        const cname = category.name
        const cnotes = category.notes
        const meta = { category: cname }
        for (const note of cnotes) {
            fs.writeFileSync(`./notes/${note.i}/.n.json`, JSON.stringify(meta), { encoding: "utf-8" })
        }
    }
    for (const label of idxObj.labels) {
        reset_notes(path.join(nodePath, label));
    }
}

// reset_notes("./indexs")

function reset_domain(nodePath) {
    const indexFile = path.join(nodePath, ".index.json");
    const idxObj = JSON.parse(fs.readFileSync(indexFile, "UTF-8"));
    const noteids = []
    for (const category of idxObj.categorys) {
        const cnotes = category.notes
        for (const note of cnotes) {
            noteids.push(note.i)
        }
    }


    console.info(nodePath)
    const paths = nodePath.substr(6).split("/").filter(p => !!p)
    paths.push(".notes")
    for (const label of idxObj.labels) {
        const p = nodePath.substr(6).split("/").filter(p => !!p)
        p.push(label)
        objectPath.set(domains, p, {})
        reset_domain(path.join(nodePath, label));
    }
    objectPath.set(domains, paths, noteids)
}
// reset_domain("indexs")
// fs.writeFileSync("./domains.json",JSON.stringify(domains),{encoding:"utf-8"})


for (const fi of fs.readdirSync("notes")) {
    for (const fj of fs.readdirSync(path.join("notes", fi))) {
        if (/[0-9]/.test(fj)) {
            console.info(fj)
            const h = ".txt"
            const source = path.join("notes", fi, fj)
            const target = path.join("notes", fi, `${fj}${h}`)
            fs.renameSync(source,target)
        }

        // path.join(notes, fi, fj), path.join(notes, fi, `fj${h}`))
    }
}