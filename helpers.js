const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const parser = require('jsonc-parser');

const PLATFORMS = {
	all: 'all',
	win32: 'windows',
	darwin: 'macos',
	linux: 'linux',
};

function getExtensionSetting(settingName, defaultValue) {
    return vscode.workspace.getConfiguration('vscode-settings-os.settings').get(settingName, defaultValue);
}

async function isValid() {
	const settingsFiles = Object.values(PLATFORMS).map(os => getSettingFilePath(os));
	const results = await Promise.all(settingsFiles.map(fileExists));
	return results.some(exists => exists);
}

function getSettingFilePath(os) {
	const fileName = os ? `settings.${os}.json` : 'settings.json';
	return path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode', fileName);
}

async function getSettingsFileContent(os, showError) {
	const filePath = getSettingFilePath(os);
	return getFileContent(filePath, showError)
}

function getOsName(showError) {
	const os = process.platform;
	if (PLATFORMS.hasOwnProperty(os)) {
		return PLATFORMS[os];
	} else {
		if (showError) {
			vscode.window.showErrorMessage(`Unsupported operating system: ${os}`);
		}
		return false;
	}
}

async function fileExists(filePath) {
	try {
		await fs.promises.access(filePath, fs.constants.F_OK);
		return true;
	} catch (error) {
		return false;
	}
}
  
async function getFileContent(filePath, showError) {
	if (await fileExists(filePath)) {
		try {
			const osSettings = parser.parse(await fs.promises.readFile(filePath, 'utf8'));
			return osSettings;
		} catch (error) {
			if (showError) {
				vscode.window.showErrorMessage(`Error reading settings file: ${error.message}`);
			}
		}
	} else {
		if (showError) {
			vscode.window.showErrorMessage(`Settings file not found: ${filePath}`);
		}
	}
}

async function getDefaultSettingsFileContent(showError) {
	const all = await getSettingsFileContent(PLATFORMS.all, showError);
	if (all) {
		return all;
	}

	const settings = await getSettingsFileContent(null, showError);
	if(settings) {
		return settings;
	}
}

async function updateSettingsFile(showError) {
	const filePath = getSettingFilePath();
	if (!await fileExists(filePath)) {
		await createFileIfNotExists(filePath, '{}');
	}

	const os = getOsName(showError);
	const currentSettings = await getSettingsFileContent(os, showError);
	const defaultSettings = await getDefaultSettingsFileContent(showError);
	const newSettings = deepMerge(defaultSettings, currentSettings);

	return new Promise((resolve, reject) => {
		fs.writeFile(filePath, JSON.stringify(newSettings, null, 4), 'utf8', (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

function deepMerge(target, source) {
	const output = Object.assign({}, target);
	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach(key => {
			if (isObject(source[key])) {
				if (!(key in target)) {
					Object.assign(output, { [key]: source[key] });
				} else {
					output[key] = deepMerge(target[key], source[key]);
				}
			} else {
				Object.assign(output, { [key]: source[key] });
			}
		});
	}
	return output;
}

function isObject(item) {
	return (item && typeof item === 'object' && !Array.isArray(item));
}

async function createFileIfNotExists(filePath, content = '') {
	try {
		const dirPath = path.dirname(filePath);
		await fs.promises.mkdir(dirPath, { recursive: true });
		await fs.promises.writeFile(filePath, content);
	} catch (error) {
		console.error(`Error creating file: ${error.message}`);
	}
}

async function vsCodeUpdateSettingsFile() {
	const showError = getExtensionSetting('showErrors', true);
	
	const os = getOsName(showError);
	if (!os) return;

	if (!await isValid()) {
		if (showError) {	
			vscode.window.setStatusBarMessage(`OS Settings: No settings.${os}.json file found.`, 5000);
		}
		return;
	}

	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) return;

	try {
		await updateSettingsFile(showError);
		vscode.window.setStatusBarMessage(`OS Settings: Updated settings.json for ${os}.`, 5000);
	} catch (error) {
		if (showError) {	
			vscode.window.showErrorMessage(`Error updating settings.json: ${error.message}`);
		}
	}
}

module.exports = {
	vsCodeUpdateSettingsFile
}
