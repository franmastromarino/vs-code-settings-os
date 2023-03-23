const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { getOsSettingsFileContent, updateSettingsFile, getOsName } = require('./helpers')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('vs-code-settings-os.updateSettings', async function () {

		const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder opened.');
            return;
        }

        const os = getOsName();
        const osSettings = await getOsSettingsFileContent();

        try {
            await updateSettingsFile(osSettings);
            vscode.window.showInformationMessage(`Updated settings.json for ${os} operating system.`);
        } catch (error) {
            vscode.window.showErrorMessage(`Error updating settings.json: ${error.message}`);
        }
		
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
