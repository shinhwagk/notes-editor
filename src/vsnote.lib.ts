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

function genNodeIndexObj(idxFsPath): string {
    const nodeIndexFilePath = path.join(idxFsPath, ".index.json")
    return JSON.parse(fs.readFileSync(nodeIndexFilePath, "UTF-8"))
}

export { deleteFolderRecursive, genNodeIndexObj }