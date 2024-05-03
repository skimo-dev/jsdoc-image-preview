import * as vscode from "vscode";
import { isImageFormat, isLocalImagePath } from "../utils/validations";
import { makeImagePreviewMarkdown } from "../utils/pathAdjust";

export const extractImageLineAndMakePreview = ({
  hoverContents,
}: {
  hoverContents: (vscode.MarkdownString | vscode.MarkedString)[];
}): string | string[] | undefined => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return undefined;
  }

  if (Array.isArray(hoverContents)) {
    const markDownArray: string[] = [];
    for (const content of hoverContents) {
      const contentValue: string =
        typeof content === "string" ? content : content.value;

      const isContentHasImageData = isImageFormat({ filePath: contentValue });
      // get the paragraph which contains image format from the hover contents
      if (isContentHasImageData) {
        const docImageContextArray = contentValue.split("\n");
        // make paragraph as line
        docImageContextArray.forEach((line) => {
          const isLineHasImage = isImageFormat({ filePath: line });
          if (isLineHasImage) {
            const imagePreviewMarkdown = convertFilePathToMarkDown({
              filePath: line,
            });
            imagePreviewMarkdown && markDownArray.push(imagePreviewMarkdown);
          }
        });
      }
    }
    if (markDownArray.length > 0) {
      return markDownArray;
    }
  } else {
    const contentValue =
      typeof hoverContents === "string" ? String(hoverContents) : hoverContents;

    if (isImageFormat({ filePath: contentValue })) {
      const imagePreviewMarkdown = convertFilePathToMarkDown({
        filePath: contentValue,
      });

      if (imagePreviewMarkdown) {
        return imagePreviewMarkdown;
      }
    }
  }
  return undefined;
};

/**
 * Make image markdown with absolute path
 * */
const convertFilePathToMarkDown = ({
  filePath,
}: {
  filePath: string;
}): string | undefined => {
  const imagePath = filePath
    .split("\n")
    .find((line) => isLocalImagePath({ filePath: line }));

  const markdown =
    imagePath &&
    makeImagePreviewMarkdown({
      relativePath: imagePath,
    });

  return markdown;
};
