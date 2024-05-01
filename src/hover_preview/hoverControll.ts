import * as vscode from "vscode";
import { isImageFormat, isValidLocalImagePath } from "../utils/validations";
import {
  makeAbsolutePath,
  makeImagePreviewMarkdown,
} from "../utils/pathAdjust";

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

      if (isImageFormat({ filePath: contentValue })) {
        const imagePreviewMarkdown = convertFilePathToMarkDown({
          filePath: contentValue,
          workspaceFolders: workspaceFolders,
        });

        imagePreviewMarkdown && markDownArray.push(imagePreviewMarkdown);
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
        workspaceFolders: workspaceFolders,
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
  workspaceFolders,
}: {
  filePath: string;
  workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined;
}): string | undefined => {
  const imagePath = filePath
    .split("\n")
    .find((line) => isValidLocalImagePath({ filePath: line }));

  const absolutePath =
    imagePath &&
    makeAbsolutePath({
      workspaceFolders: workspaceFolders!,
      relativePath: imagePath,
    });

  const markdown =
    absolutePath &&
    makeImagePreviewMarkdown({
      absolutePath: absolutePath,
    });

  return markdown;
};
