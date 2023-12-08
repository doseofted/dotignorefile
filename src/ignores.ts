import * as fs from "node:fs/promises";
import { File } from "node:buffer";

/** Find all `*ignore` files in a given directory */
export async function findIgnoreFiles() {
  const files = await fs.readdir(".", { withFileTypes: true });
  const ignoreFiles = files
    .filter((file) => file.isFile() && file.name.endsWith("ignore"))
    .map(async (file) => {
      const fileContents = await fs.readFile(file.name, "utf-8");
      return new File([fileContents], file.name);
    });
  return await Promise.all(ignoreFiles);
}

const ignores = `
# support .ignorefile
.*ignore
!.gitignore
`;

export async function appendIgnoresToGitignore() {
  if (await fs.stat(".gitignore")) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const gitignore = await fs.readFile(".gitignore", "utf-8");
    // TODO: check if already appended lines
  }
  try {
    await fs.appendFile(".gitignore", ignores);
    return true;
  } catch (error) {
    return false;
  }
}
