#!/usr/bin/env node
import { question, echo } from "zx";
import { createIgnorefile, findIgnorefile } from "./create";
import { appendIgnoresToGitignore, findIgnoreFiles } from "./ignores";
import { createIgnores, splitIgnoreFile } from "./split";

echo`dotignorefile is in alpha: commit all changes prior to running this utility.\n`;

let found = await findIgnorefile();
if (!found) {
  const answer = await question("No .ignorefile found. Create one? [y/n] ", {
    choices: ["y", "n"],
  });
  const create = ["y", "yes"].includes(answer);
  if (create) {
    const ignoreFiles = await findIgnoreFiles();
    echo`Found ignore files:\n${ignoreFiles.map((f) => f.name).join("\n")}`;
    await createIgnorefile(ignoreFiles);
    await appendIgnoresToGitignore();
  }
}

found ||= await findIgnorefile();

if (!found) {
  echo`No .ignorefile given. Exiting.`;
  process.exit(0);
}

const answer = await question(
  "Ignore files will be created from your .ignorefile. Continue? [y/n] ",
  {
    choices: ["y", "yes"],
  },
);
const create = ["y", "yes"].includes(answer);
if (create) {
  const ignoreFiles = await splitIgnoreFile(found);
  await createIgnores(ignoreFiles);
  echo`Ignore files have been created from your .ignorefile`;
}
