import { WorkspaceConfiguration, window, workspace } from 'vscode';

export function getWorkspaceConfiguration(): WorkspaceConfiguration {
    window.showInformationMessage(workspace.getConfiguration("VsNote").get("vsnote.switch"))
    return workspace.getConfiguration("VsNote");
}



const viewId: string = "vsnote";
const commandShowVscodeNotePreview: string = "extension.showVscodeNotePreview";