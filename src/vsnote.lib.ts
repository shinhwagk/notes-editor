import * as fs from "fs";
import * as path from "path";

import * as vscode from "vscode";

import { IIndex } from "./vsnote.note";
import { indexFile } from "./vsnote.settings";

export const workspaceRoot: string = vscode.workspace.workspaceFolders[0].uri.fsPath;

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

export function genNodeIndexPath(nodePath?: string): string {
    const paths = [workspaceRoot, "indexs", indexFile];
    if (nodePath) {
        paths.splice(2, 0, nodePath);
    }
    return path.join(...paths);
}

// delete futurity
export function genNoteMate(nodePath?: string): IIndex {
    const _idxFilePath = genNodeIndexPath(nodePath);
    return JSON.parse(fs.readFileSync(_idxFilePath, "UTF-8")) as IIndex;
}

export function saveNodeIndex(nodePath, nodeMeta): void {
    const nodeIndexPath: string = genNodeIndexPath(nodePath);
    const indexFileContent: string = JSON.stringify(nodeMeta);
    fs.writeFileSync(nodeIndexPath, indexFileContent, "UTF-8");
}

// export function genIdxObj(filePath): INoteIndex {
//     return jsonFileToObj<INoteIndex>(filePath);
// }

export const emptyNodeIdxObj = { labels: [], categorys: [], seq: 1 } as IIndex;
