const vscode = require('vscode');

const { vsCodeUpdateSettingsFile } = require('./helpers')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    // Check if the workspace is already open when the extension is activated
    if (vscode.workspace.workspaceFolders) {
        vsCodeUpdateSettingsFile();
        setupWatcher(context);
    }

    // Listen for the onDidChangeWorkspaceFolders event
    context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders(async (event) => {
            if (event.added.length > 0) {
                vsCodeUpdateSettingsFile();
                setupWatcher(context);
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

let previousWatcher

/**
 * Listen for changes to OS settings files
 * @param {vscode.ExtensionContext} context
 */
function setupWatcher(context) {
    if (previousWatcher) {
        previousWatcher.dispose()
        previousWatcher = undefined
    }
    
    const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.workspace.workspaceFolders[0].uri, '.vscode/settings.*.json'))
    watcher.onDidChange(function() {
        vsCodeUpdateSettingsFile();
    })
    watcher.onDidCreate(function() {
        vsCodeUpdateSettingsFile();
    })
    watcher.onDidDelete(function() {
        vsCodeUpdateSettingsFile();
    })
    context.subscriptions.push(watcher)
    previousWatcher = watcher
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
