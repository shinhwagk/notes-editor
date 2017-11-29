const fs = require("fs");
const path = require("path");

function addId(nodePath) {
  const indexFile = path.join(nodePath, ".index.json")
  const obj = JSON.parse(fs.readFileSync(indexFile, "UTF-8"))
  const categorys = obj["categorys"]
  let id = 0
  for (let i = 0; i <= categorys.length; i++) {
    const notes = categorys[i]
    for (let j = 0; j <= notes.length; j++) {
      fs.renameSync()
    }
  }
}


addId("./")