const vscode = require('vscode');

const { vsCodeUpdateSettingsFile } = require('./helpers')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    // Check if the workspace is already open when the extension is activated
    if (vscode.workspace.workspaceFolders) {
        vsCodeUpdateSettingsFile();
    }

    // Listen for the onDidChangeWorkspaceFolders event
    context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders(async (event) => {
            if (event.added.length > 0) {
                vsCodeUpdateSettingsFile();
            }
        })
    );

    // Listen for the command updateSettings
	context.subscriptions.push(
        vscode.commands.registerCommand('vs-code-settings-os.updateSettings', async () => {
            vsCodeUpdateSettingsFile();
        })
    );
    
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
