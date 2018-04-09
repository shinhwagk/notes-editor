import * as fs from "fs";
import * as path from "path";

import { IIndex } from "./vsnote.note";
import { indexFile } from "./vsnote.settings";

export function deleteFolderRecursive(p): void {
    if (fs.existsSync(p)) {
        fs.readdirSync(p).forEach((file, index) => {
            const curPath = path.join(p, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(p);
    }
}

// delete futurity
export function genNoteMate(nodePath?: string): IIndex {
    if (nodePath) {
        const _idxFilePath = path.join(nodePath, indexFile);
        return JSON.parse(fs.readFileSync(_idxFilePath, "UTF-8")) as IIndex;
    } else {
        return emptyNodeIdxObj;
    }
}

// export function genIdxObj(filePath): INoteIndex {
//     return jsonFileToObj<INoteIndex>(filePath);
// }

export function jsonFileToObj<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

export const emptyNodeIdxObj = { labels: [], categorys: [], seq: 1 } as IIndex;
