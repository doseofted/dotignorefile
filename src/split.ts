import { File } from "node:buffer";
import * as fs from "node:fs/promises";

const defaultIgnoreSection = "git";
export function splitIgnoreFileContent(fileContents: string) {
  const ignoreFile = fileContents;
  let currentSection = null;
  let currentFile = "";
  const sections: Record<string, string> = {};
  const newlineRegex = /(\r?\n)/g;
  const lines = ignoreFile.split(newlineRegex);
  for (const [index, line] of lines.entries()) {
    const [, possibleSection] = line.match(/^\[(\w+)\]$/) || [];
    const newSection = possibleSection || index === lines.length - 1;
    if (newSection && currentFile) {
      sections[currentSection] = currentFile;
      currentSection = null;
      currentFile = "";
    }
    currentSection ||= possibleSection || defaultIgnoreSection;
    if (possibleSection) continue;
    if (possibleSection === defaultIgnoreSection && sections[currentSection])
      continue;
    currentFile += line;
  }
  return sections;
}

export async function splitIgnoreFile(file: File) {
  const ignoreFileContent = await file.text();
  const sections = splitIgnoreFileContent(ignoreFileContent);
  const files = Object.entries(sections).map(([name, fileContents]) => {
    return new File([fileContents], `.${name}ignore`);
  });
  return files;
}

export async function createIgnores(files: File[]) {
  for (const file of files) {
    await fs.writeFile(file.name, await file.text(), { encoding: "utf-8" });
  }
}
