import * as vscode from "vscode";

import { isLocalImagePath } from "../utils/validations";
import { makeAbsolutePath } from "../utils/pathAdjust";
import { closeWebView, openWebView } from "./webviewControll";
import { getJSDocFromFile } from "../utils/readFile";

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export const completionPreviewProvider = ({
  languageArray,
}: {
  languageArray: string[];
}): vscode.Disposable => {
  const provider = vscode.languages.registerInlineCompletionItemProvider(
    languageArray,
    {
      provideInlineCompletionItems: async (
        document,
        position,
        context,
        token
      ) => {
        if (context.selectedCompletionInfo) {
          const uri = document.uri;
          const selectedText = context.selectedCompletionInfo.text;

          const completions = vscode.commands.executeCommand(
            "vscode.executeCompletionItemProvider",
            uri,
            position,
            undefined,
            30 // need adjustment
          );

          const completionListItems = (
            (await completions) as vscode.CompletionList
          ).items;
          const completionList: vscode.CompletionItem[] = completionListItems;
          const matchedItemList: vscode.CompletionItem[] = [];
          let isHavingWebviewContents = false;

          completionList.forEach((completion) => {
            const isMatched = completion.insertText === selectedText;

            if (isMatched) {
              matchedItemList.push(completion);
            }
          });

          const webviewContentsListPromise: Promise<WebviewContents>[] =
            matchedItemList.map(async (matchedItem) => {
              const itemDocument = matchedItem?.documentation;

              const isItemDocumentString = typeof itemDocument === "string";

              let jsdocContext: string[] | undefined = isItemDocumentString
                ? itemDocument.split("\n")
                : itemDocument &&
                  ((itemDocument as any).value as string).split("\n");
              const itemArguments = matchedItem?.command?.arguments;

              if (!jsdocContext) {
                const importedPath =
                  itemArguments &&
                  (itemArguments![0] as any).tsEntry?.data?.fileName;

                if (importedPath) {
                  const jsdocDocumentation = await getJSDocFromFile({
                    filePath: importedPath,
                    identifierName: selectedText,
                  });
                  jsdocContext = jsdocDocumentation;
                }
              }

              const filteredJsDoc = jsdocContext?.filter((text) =>
                isLocalImagePath({ filePath: text })
              );

              const labelPath = (itemArguments![0] as any).label?.description;
              const webViewContents: WebviewContents = {
                insertText: selectedText,
                labelPath: labelPath
                  ? labelPath
                  : "Import Statement or Unknown Source",
                imagePathArray: filteredJsDoc ? filteredJsDoc : [],
              };
              if (webViewContents.imagePathArray.length > 0) {
                isHavingWebviewContents = true;
              }

              return webViewContents;
            });

          const webviewContentsList: WebviewContents[] = await Promise.all(
            webviewContentsListPromise
          );

          if (isHavingWebviewContents) {
            currentPanel = openWebView({
              currentPanel: currentPanel,
              panelTitle: selectedText,
              webviewContentsArray: webviewContentsList,
            });
          } else {
            currentPanel = openWebView({
              currentPanel: currentPanel,
              panelTitle: selectedText,
            });
          }
        } else {
          currentPanel = closeWebView({ currentPanel: currentPanel });
        }

        return [];
      },
    }
  );

  return provider;
};
