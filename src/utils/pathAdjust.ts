import * as vscode from "vscode";
import * as path from "path";

/**
 * Convert relative path to absolute path
 * */
export const makeAbsolutePath = ({
  relativePath,
  workspaceFolders,
}: {
  relativePath: string;
  workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined;
}): string => {
  const rootPath = workspaceFolders![0].uri.fsPath;
  const absolutePath = path.join(
    rootPath,
    relativePath.trim().replaceAll("'", "").replaceAll('"', "")
  );
  return absolutePath;
};

/**
 * Make absolute path to image preview markdown string
 * */
export const makeImagePreviewMarkdown = ({
  absolutePath,
}: {
  absolutePath: string;
}) => {
  const imagePreviewMarkdown = `![image preview](${absolutePath}|width=100)`;
  return imagePreviewMarkdown;
};
