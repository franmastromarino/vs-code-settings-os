const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function getOsName() {
	const os = process.platform;
	switch (os) {
		case 'win32':
			return 'windows';
		case 'darwin':
			return 'macos';
		case 'linux':
			return 'linux';
		default:
			vscode.window.showErrorMessage(`Unsupported operating system: ${os}`);
			return {};
	}
}

async function getOsSettingsFileContent() {

	const os = getOsName();

	const filePath = path.join(vscode.workspace.workspaceFolders[0]?.uri.fsPath, '.vscode', `settings.${os}.json`);

	if (fs.existsSync(filePath)) {
		try {
			const osSettings = JSON.parse(await fs.promises.readFile(filePath, 'utf8'));
			return osSettings;
		} catch (error) {
			vscode.window.showErrorMessage(`Error reading settings file: ${error.message}`);
			return {};
		}
	} else {
		vscode.window.showErrorMessage(`Settings file not found: ${filePath}`);
		return {};
	}
}

async function updateSettingsFile(osSettings) {

	const filePath = path.join(vscode.workspace.workspaceFolders[0]?.uri.fsPath, '.vscode', `settings.json`);

	if (!fs.existsSync(filePath)) {
		await createFileIfNotExists(filePath, '{}');
	}

	const settings = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : {};
	const newSettings = deepMerge(settings, osSettings);

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
		// Ensure the directory exists
		const dirPath = path.dirname(filePath);
		await fs.mkdir(dirPath, { recursive: true });

		// Check if the file exists
		const fileExists = await fs.access(filePath)
			.then(() => true)
			.catch(() => false);

		// Create the file if it doesn't exist
		if (!fileExists) {
			await fs.writeFile(filePath, content);
			console.log(`File created: ${filePath}`);
		} else {
			console.log(`File already exists: ${filePath}`);
		}
	} catch (error) {
		console.error(`Error while creating file: ${error.message}`);
	}
}

module.exports = {
	getOsSettingsFileContent,
	updateSettingsFile,
	getOsName
}
