[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=franmastromarino.vs-code-settings-os)

#VS Code Settings for Mac Windows and Linux

## Manage Visual Studio Code Settings Across Mac, Windows, and Linux

This extension enables you to manage different settings based on your operating system, simplifying the process of maintaining separate settings for Windows, macOS, and Linux while working with Visual Studio Code.

## Key Features

- Automatically copies the content of OS-specific settings files into `.vscode/settings.json`
- Supports settings for Windows, macOS, and Linux
- Helps maintain a consistent development environment across different operating systems

## How to Use

1. Create the appropriate settings file(s) for your operating system(s) in your project's `.vscode` folder:

   - `.vscode/settings.windows.json` for Windows
   - `.vscode/settings.macos.json` for macOS
   - `.vscode/settings.linux.json` for Linux

2. Define your desired settings in each file and save them.
3. The extension will automatically copy the contents of the corresponding file into `.vscode/settings.json` based on the operating system you're currently using.

In order to enjoy autocompletion and validation of your operating system settings files, add the `"$schema"` key at the top of each file:

```json
{
  "$schema": "vscode://schemas/settings/user"
}
```

## Example

`.vscode/settings.json`:
```json
{
  "workbench.colorTheme": "Solarized Dark"
}
```

Suppose you are working on macOS and have the following settings:

`.vscode/settings.macos.json`:
```json
{
  "editor.fontSize": 14
}
```

After activating the extension, your .vscode/settings.json file will be updated to:

```json
{
  "editor.fontSize": 14,
  "workbench.colorTheme": "Solarized Dark"
}
```

To prevent commits of an updated settings.json file in your project, create a settings.all.json file containing common settings across all operating systems. 

Each time you open your project, the VS Code Settings for Mac Windows and Linux extension will update the settings.json file based on your operating system and the content of the settings.${os}.json file.

Now you can include the settings.json file in your .gitignore and enjoy maintaining consistent settings across different operating systems!

Simply copy and paste the code above into your Markdown editor, and it will render the improved content.

