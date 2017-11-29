const fs = require("fs");
const path = require("path");

function addId(nodePath) {
  const indexFile = path.join(nodePath, ".index.json")
  const obj = JSON.parse(fs.readFileSync(indexFile, "UTF-8"))
  const categorys = obj["categorys"]
  let id = 1
  for (let i = 0; i < categorys.length; i++) {
    const notes = categorys[i]["notes"]
    for (let j = 0; j < notes.length; j++) {
      const oldName = path.join(nodePath, `${i}-${j}`)
      const newName = path.join(nodePath, `n-${id}`)
      notes[j]["i"] = id
      fs.renameSync(oldName, newName)
      id += 1
    }
  }
  fs.writeFileSync(indexFile, JSON.stringify(obj), "UTF-8")
  for (const label of obj["labels"]) {
    const p = path.join(nodePath, label)
    addId(p)
  }
}

addId("./")