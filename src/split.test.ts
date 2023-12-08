import { File } from "node:buffer";
import { expect, test } from "vitest";
import * as ignorefile from "./split";

const gitignore = `
# .ignorefile-related
.*ignore
!.gitignore
# build-related
node_modules/
dist/
`;
const prettierignore = `
dist/
`;
const eslintignore = `
dist/
`;
const testIgnoreFile = `
[git]
${gitignore}
[prettier]
${prettierignore}
[eslint]
${eslintignore}
`;

test(".ignorefile contents gets split", async () => {
  const sections = ignorefile.splitIgnoreFileContent(testIgnoreFile);
  expect(sections).toBeTypeOf("object");
  expect(sections).toHaveProperty("git");
  // FIXME: `.toContain(...)` test should become `.toBe(...)` to match whitespace (but this does work regardless)
  expect(sections["git"]).toContain(gitignore);
  expect(sections).toHaveProperty("prettier");
  expect(sections["prettier"]).toContain(prettierignore);
  expect(sections).toHaveProperty("eslint");
  expect(sections["eslint"]).toContain(eslintignore);
});

test(".ignorefile split results in multiple files", async () => {
  const ignorefileFile = new File([Buffer.from(testIgnoreFile)], ".ignorefile");
  const files = await ignorefile.splitIgnoreFile(ignorefileFile);
  expect(files).toBeInstanceOf(Array);
  expect(files).toHaveLength(3);
});
