import * as fs from "node:fs/promises";
import { File } from "node:buffer";

/** Create ignore file from given ignore files (found with `findIgnoreFiles()`) */
export async function createIgnorefile(files: File[]) {
  let ignorefileContent = "";
  for (const file of files) {
    const text = await file.text();
    const section = file.name.replace(/^\./, "").replace(/ignore$/, "");
    const sectionNameValid = /^[\w]+$/.test(section);
    if (!sectionNameValid)
      throw new Error(`Ignore file name was not valid: ${file.name}`);
    ignorefileContent += `[${section}]\n`;
    ignorefileContent += text + "\n";
  }
  await fs.writeFile(".ignorefile", ignorefileContent);
  return ignorefileContent;
}

export async function findIgnorefile() {
  try {
    return new File(
      [await fs.readFile(".ignorefile", { encoding: "utf-8" })],
      ".ignorefile",
    );
  } catch (error) {
    return false;
  }
}
