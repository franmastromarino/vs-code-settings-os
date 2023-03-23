#VS Code Settings OS
This extension allows you to manage different settings based on your operating system. It simplifies maintaining separate settings for Windows, macOS, and Linux while working with Visual Studio Code.

##Features
The extension automatically copies the content of the following files, depending on the current operating system, into the .vscode/settings.json file:

`.vscode/settings.windows.json for Windows`
`.vscode/settings.macos.json for macOS`
`.vscode/settings.linux.json for Linux`

This makes it easier to switch between operating systems while maintaining a consistent development environment.

##Usage
Create the appropriate settings file(s) for your operating system(s) in your project's .vscode folder:

`.vscode/settings.windows.json for Windows`
`.vscode/settings.macos.json for macOS`
`.vscode/settings.linux.json for Linux`

Define your desired settings in each file, and save them.
The extension will automatically copy the contents of the corresponding file into .vscode/settings.json based on the operating system you're currently using.
##Example
If you are working on macOS and have the following files:

.vscode/settings.macos.json:
```json
{
  "editor.fontSize": 14,
  "workbench.colorTheme": "Solarized Dark"
}
```
After activating the extension, your .vscode/settings.json file will be updated to:
```json
{
  "editor.fontSize": 14,
  "workbench.colorTheme": "Solarized Dark"
}

Enjoy maintaining consistent settings across different operating systems!