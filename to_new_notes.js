const fs = require("fs");
const path = require("path");
const jsyaml = require("js-yaml");

function abc(paths, dm) {
  const notes = dm[".notes"] || [];
  const tag = "/" + paths.join("/");
  for (const id of notes) {
    const meta = readMeta(id);
    const category = meta["category"] || "default";
    const metanew = readNewMeta(id);
    console.log(metanew, id);
    if (metanew["tags"] === "aa") metanew["tags"] = [];
    metanew["tags"].push({ tag: tag, category: category });
    fs.writeFileSync(
      path.join("notes", id.toString(), ".n.yml"),
      jsyaml.safeDump(metanew)
    );
  }
  for (const d of Object.keys(dm).filter(d => d !== ".notes")) {
    abc(paths.concat(d), dm[d]);
  }
}

function readMeta(id) {
  return JSON.parse(
    fs.readFileSync(path.join("notes", id.toString(), ".n.json"))
  );
}

function readNewMeta(id) {
  const metaPath = path.join("notes", id.toString(), ".n.yml");
  if (!fs.existsSync(metaPath)) fs.writeFileSync(metaPath, "tags: ");
  return jsyaml.safeLoad(fs.readFileSync(metaPath));
}

abc([], JSON.parse(fs.readFileSync("domains.json")));
