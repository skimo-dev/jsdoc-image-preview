import * as vscode from "vscode";
import { makeAbsolutePath } from "../utils/pathAdjust";

export const openWebView = ({
  currentPanel,
  panelTitle,
  webviewContentsArray = [],
}: // isImage = false,
{
  currentPanel: vscode.WebviewPanel | undefined;
  panelTitle: string;
  webviewContentsArray?: WebviewContents[];
  // isImage?: boolean;
}): vscode.WebviewPanel | undefined => {
  const activeEditor = vscode.window.activeTextEditor;
  let columnToShowIn = (activeEditor?.viewColumn ?? vscode.ViewColumn.One) + 1;
  const isHavingImagePath = webviewContentsArray.length > 0;

  // 현재 활성화된 에디터가 세번째 column 이면 다시 웹뷰를 첫번째 column으로 설정
  if (columnToShowIn > vscode.ViewColumn.Three) {
    columnToShowIn = vscode.ViewColumn.One;
  }

  // currentPanel이 이미 존재하면 웹뷰를 재사용
  if (currentPanel) {
    currentPanel.title = panelTitle;
    currentPanel.webview.html = getWebviewPannel({
      webviewContentsArray: webviewContentsArray,
      currentPanel: currentPanel,
      isImagePanel: isHavingImagePath,
    }); // 내용 업데이트
    currentPanel.reveal(columnToShowIn, true); // 현재 에디터 포커스 유지
    return currentPanel;
  } else {
    if (isHavingImagePath) {
      // 새 웹뷰 패널 생성
      currentPanel = vscode.window.createWebviewPanel(
        "doc-image-webview-for-preview",
        panelTitle,
        { viewColumn: columnToShowIn, preserveFocus: true }, // 현재 에디터 포커스 유지
        {}
      );

      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        null,
        []
      );

      currentPanel.webview.html = getWebviewPannel({
        webviewContentsArray: webviewContentsArray,
        currentPanel: currentPanel,
        isImagePanel: isHavingImagePath,
      });
    }

    return currentPanel;
  }
};

export const closeWebView = ({
  currentPanel,
}: {
  currentPanel: vscode.WebviewPanel | undefined;
}): vscode.WebviewPanel | undefined => {
  if (currentPanel) {
    currentPanel.dispose();
    return undefined;
  }
  return currentPanel;
};

const getWebviewHtml = ({ body }: { body: string }): string => {
  return `<!DOCTYPE html>
            <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Web View</title>
              </head>
              <body>
                  ${body}
              </body>
            </html>`;
};

const getWebviewPannel = ({
  webviewContentsArray,
  currentPanel,
  isImagePanel,
}: {
  webviewContentsArray: WebviewContents[];
  currentPanel: vscode.WebviewPanel;
  isImagePanel: boolean;
}): string => {
  let webviewBody = "<h2>❌ No local image doc comment</h2>";
  if (isImagePanel) {
    const convertToHtmlContents: string[] = webviewContentsArray.map(
      (webviewContents) => {
        const imagePathArray = webviewContents.imagePathArray;
        let imageHtml = `<div style="margin-left: 16px;">
                           <p style="color: gray; font-style: italic;">🔍  Nothing to Preview</p>
                         </div>`;

        if (imagePathArray.length > 0) {
          const imagePathHtmlArray: string[] = imagePathArray.map(
            (imagePath) => {
              const absolutePath = makeAbsolutePath({
                relativePath: imagePath,
              });
              return `<div style="margin-left: 16px; margin-bottom: 48px;">
                       <p style="font-style: italic;">👇  ${imagePath}</p>
                       <img src="${currentPanel.webview.asWebviewUri(
                         vscode.Uri.file(absolutePath!)
                       )}" height="200" alt="Image" />
                      </div>`;
            }
          );
          imageHtml = imagePathHtmlArray.join("");
        }

        return `<h3>📍  ${webviewContents.insertText} from '${webviewContents.labelPath}'</h3>
                ${imageHtml}
                <br/><br/>`;
      }
    );

    webviewBody = convertToHtmlContents.join("");
  }
  return getWebviewHtml({ body: webviewBody });
};
