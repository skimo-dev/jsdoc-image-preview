# JSDoc Comment Image Preview

Supports previewing image files( _.jpg, .jpeg, .png, .svg, .gif_ ) by local relative paths in JSDoc comments.

<div style="height:16px;"></div>

## Features

- Provides a preview of a local image when relative file paths are used in JSDoc comments.

- Hovering identifier displays a preivew in a hover popup.

- Focusing an item from the autocompletion list by keyboard displays a preview in a side webview.

- The side webview automatically closes if the autocomplete list cannot be generated.

- Supports multiple lines of image paths.

- Local image paths should not be mixed with any characters except for quotation marks(`'`,`"`) on the same line in JSDoc comments.

  ```typescript
  /**
   * images/example.png                        <- ✅ This is OK
   */
  export const exampleImage: string = "images/example.png";

  /**
   * 'images/example.png'                      <- ✅ This is OK
   */
  export const exampleImage: string = "images/example.png";

  /**
   * Example Image :
   * images/example1.png
   *
   * images/example2.png
   *
   * multiline comments and multiline images   <- ✅ This is OK
   */
  export const exampleImage: string = "images/example.png";

  /**
   * Example Image : images/example.png        <- ❌ Not Working
   */
  export const exampleImage: string = "images/example.png";
  ```

  > 🚨 **URL Path** and **Absolute Path** are also not working.

<div style="height:48px;"></div>

## Usage Example

### &nbsp;&nbsp;&nbsp;Copy & Paste Relative Path on the Doc comment

- Get Relative Path from the VSCode

### &nbsp;&nbsp;&nbsp;Hover Preview

- JS / JSX / TS / TSX

### &nbsp;&nbsp;&nbsp;Completion Preview

- JS / JSX / TS / TSX

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

<div style="height:48px;"></div>

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: Enable/disable this extension.
- `myExtension.thing`: Set to `blah` to do something.

<div style="height:48px;"></div>

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

<div style="height:48px;"></div>

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

<div style="height:48px;"></div>

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

<div style="height:48px;"></div>

## For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)
