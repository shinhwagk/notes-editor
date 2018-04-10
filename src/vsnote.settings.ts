import { window, workspace, WorkspaceConfiguration } from "vscode";

// export function getWorkspaceConfiguration(): WorkspaceConfiguration {
//     window.showInformationMessage(workspace.getConfiguration("VsNote").get("vsnote.switch"))
//     return workspace.getConfiguration("VsNote");
// }

export const viewId: string = "vsnote";
export const indexFile: string = ".index.json";
export const commandNameShowVsNotePreview: string = "extension.showVsNotePreview";
export const commandNameaddNote: string = "extension.add.note";
export const workspaceRootPath = workspace.workspaceFolders[0].uri.fsPath;
