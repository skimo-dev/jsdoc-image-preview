import * as vscode from "vscode";
import * as path from "path";

/**
 * Convert relative path to absolute path
 * */
export const makeAbsolutePath = ({
  relativePath,
}: {
  relativePath: string;
}): string | undefined => {
  if (!vscode.workspace.workspaceFolders) {
    return;
  }
  const rootPath = vscode.workspace.workspaceFolders![0].uri.fsPath;
  const absolutePath = path.join(
    rootPath,
    relativePath.trim().replaceAll("'", "").replaceAll('"', "")
  );
  return absolutePath;
};

/**
 * Make absolute path and image preview markdown string
 * */
export const makeImagePreviewMarkdown = ({
  relativePath,
}: {
  relativePath: string;
}) => {
  const absolutePath = makeAbsolutePath({
    relativePath: relativePath,
  });
  const imagePreviewMarkdown = `![image preview](${absolutePath}|width=100)\n    *${relativePath}*`;
  return imagePreviewMarkdown;
};
