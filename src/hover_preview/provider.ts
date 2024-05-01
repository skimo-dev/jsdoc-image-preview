import * as vscode from "vscode";
import { extractImageLineAndMakePreview } from "./hoverControll";

let isHovering: boolean = false;

export const hoverPreviewProvider = ({
  supportLanguages,
}: {
  supportLanguages: string[];
}): vscode.Disposable => {
  const provider = vscode.languages.registerHoverProvider(supportLanguages, {
    async provideHover(document, position, token) {
      if (isHovering) {
        return;
      }
      isHovering = true;

      try {
        const originalHovers = (await vscode.commands.executeCommand(
          "vscode.executeHoverProvider",
          document.uri,
          position
        )) as vscode.Hover[];

        if (originalHovers.length > 0) {
          const copiedHoverContents = originalHovers[0].contents;
          const imageContentLine = extractImageLineAndMakePreview({
            hoverContents: copiedHoverContents,
          });

          if (imageContentLine) {
            const hoverImagePopup: vscode.Hover = new vscode.Hover(
              imageContentLine
            );
            return hoverImagePopup;
          }
        }
      } finally {
        isHovering = false;
      }

      return undefined;
    },
  });

  return provider;
};
