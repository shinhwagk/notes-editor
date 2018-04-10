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

// delete futurity
export function genNoteMate(nodePath?: string): IIndex {
    const _idxFilePath = nodePath ? path.join(workspaceRoot, nodePath, indexFile) : path.join(workspaceRoot, indexFile);
    return JSON.parse(fs.readFileSync(_idxFilePath, "UTF-8")) as IIndex;
}

// export function genIdxObj(filePath): INoteIndex {
//     return jsonFileToObj<INoteIndex>(filePath);
// }

export function jsonFileToObj<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

export const emptyNodeIdxObj = { labels: [], categorys: [], seq: 1 } as IIndex;
