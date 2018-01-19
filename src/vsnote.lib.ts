import * as fs from 'fs';
import * as path from 'path';

function deleteFolderRecursive(p): void {
    if (fs.existsSync(p)) {
        fs.readdirSync(p).forEach((file, index) => {
            var curPath = path.join(p, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(p);
    }
};

function genNodeIndexObj(nodeFsPath) {
    const indexFileFsPath = path.join(nodeFsPath, ".index.json")
    return JSON.parse(fs.readFileSync(indexFileFsPath, "UTF-8"))
}

export { deleteFolderRecursive, genNodeIndexObj }