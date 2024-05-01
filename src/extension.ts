import * as vscode from "vscode";
import { hoverPreviewProvider } from "./hover_preview/provider";
// import { completionPreviewProviderResolved } from "./completion_preview/documentation_resolved/provider";
// import { completionPreviewProviderUnResolved } from "./completion_preview/documentation_unresolved/provider";

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
  //   const completionProvider = completionPreviewProvider({
  //     languageArray: supportLanguages,
  //   });

  context.subscriptions.push(
    hoverProvider
    // completionProvider
  );
}

export function deactivate(): void {}
