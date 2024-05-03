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
  const hoverProvider: vscode.Disposable = hoverPreviewProvider({
    supportLanguages: supportLanguages,
  });

  const configListener: vscode.Disposable =
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (
        e.affectsConfiguration("jsdocCommentImagePreview.completionPreview")
      ) {
        updateCompletionProvider(context);
      }
    });
  context.subscriptions.push(hoverProvider, configListener);

  // initial register of completion provider
  updateCompletionProvider(context);
}

export function deactivate(): void {}

const updateCompletionProvider = (context: vscode.ExtensionContext) => {
  // delete the current jsdocCommentImagePreviewCompletionProvider
  const existingCompletionProviderIndex: number =
    context.subscriptions.findIndex(
      (sub) => (sub as any).tag === "jsdocCommentImagePreviewCompletionProvider"
    );
  if (existingCompletionProviderIndex !== -1) {
    context.subscriptions[existingCompletionProviderIndex].dispose();
    context.subscriptions.splice(existingCompletionProviderIndex, 1);
  }

  // get user config -> jsdocCommentImagePreview property value (default : true)
  const config: vscode.WorkspaceConfiguration =
    vscode.workspace.getConfiguration("jsdocCommentImagePreview");
  const enableCompletionPreview: boolean = config.get<boolean>(
    "completionPreview",
    true
  );
  if (enableCompletionPreview) {
    const completionProvider: vscode.Disposable = completionPreviewProvider({
      languageArray: supportLanguages,
    });
    (completionProvider as any).tag =
      "jsdocCommentImagePreviewCompletionProvider"; // add tag for identifying
    context.subscriptions.push(completionProvider);
  }
};
