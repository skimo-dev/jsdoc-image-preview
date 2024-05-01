import * as fs from "fs";
import * as jsoncParser from "jsonc-parser";
import path = require("path");
import * as vscode from "vscode";

export const getJSDocFromFile = async ({
  filePath,
  identifierName,
}: {
  filePath: string;
  identifierName: string;
}): Promise<string[]> => {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    const jsdocContents: string[] = [];
    const jsdocPattern =
      /\/\*\*[\s\S]+?\*\/\s*(export\s+)?(async\s+)?(function\s+[\w$]+|class\s+[\w$]+|const\s+[\w$]+|let\s+[\w$]+)/g;
    let match;

    while ((match = jsdocPattern.exec(data)) !== null) {
      const jsdocComment = match[0].match(/\/\*\*[\s\S]+?\*\//)![0];
      const codeLine = match[0].slice(jsdocComment.length).trim();

      const nameMatch = codeLine.match(
        /(function|class|const|let|var)\s+([\w$]+)/
      );
      if (nameMatch && nameMatch[2] === identifierName) {
        const adjustedComment = jsdocComment
          .replace(/\*\/$/, "")
          .replace(/\/\*\*[\s]*\*/, "")
          .trim();
        jsdocContents.push(
          ...adjustedComment
            .split("*")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
        );
      }
    }

    return jsdocContents;
  } catch (err) {
    vscode.window.showErrorMessage(`Error reading file: ${filePath}`);
    return [];
  }
};
