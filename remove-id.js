const fs = require("fs");
const path = require("path");

function flush(nodePath) {
  const indexFile = path.join(nodePath, ".index.json")
  const obj = JSON.parse(fs.readFileSync(indexFile, "UTF-8"))
  const categorys = obj["categorys"]
  let cId = 0
  for (const i in categorys) {
    const notes = categorys[i]["notes"]
    let idxId = 0
    for (const j in notes) {
      const note = notes[j]
      console.info(note)
      const id = note["id"]
      delete note["id"]
      note["d"] = note["doc"] ? 1 : 0;
      note["f"] = note["file"] ? 1 : 0;
      delete note["doc"]
      delete note["file"]
      fs.writeFileSync(indexFile, JSON.stringify(obj), "UTF-8")
      fs.renameSync(path.join(nodePath, id.toString()), path.join(nodePath, `${cId.toString()}-${idxId.toString()}`))
      idxId += 1
    }
    cId += 1
  }
  for (const label of obj["labels"]) {
    flush(path.join(nodePath, label))
  }
}

try {
  flush("./")
} catch (e) {
  console.info(e)
}