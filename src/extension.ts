import * as vscode from "vscode";
import { hoverPreviewProvider } from "./hover_preview/provider";
import { completionPreviewProvider } from "./completion_preview/provider";

const supportLanguages: string[] = [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact",
];

export function activate(context: vscode.ExtensionContext) {
  const hoverProvider = hoverPreviewProvider({
    supportLanguages: supportLanguages,
  });
  const completionProvider = completionPreviewProvider({
    languageArray: supportLanguages,
  });

  context.subscriptions.push(hoverProvider, completionProvider);
}

export function deactivate(): void {}
