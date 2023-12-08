#!/usr/bin/env node
import { question, echo, argv } from "zx";
import { createIgnorefile, findIgnorefile } from "./create";
import { appendIgnoresToGitignore, findIgnoreFiles } from "./ignores";
import { createIgnores, splitIgnoreFile } from "./split";
import { version } from "../package.json";

echo`dotignorefile is in alpha: commit all changes prior to running this utility.\n`;

if (argv.help || argv.h) {
  echo`Usage: dotignorefile [options]`;
  echo``;
  echo`Options:`;
  echo`  -h, --help     Show this help message`;
  echo`  -v, --version  Show version number`;
  echo``;
  echo`Run without arguments to generate an .ignorefile from your existing ignore files.`;
  echo`If an .ignorefile already exists, generate ignore files from it.`;
  process.exit(0);
}

if (argv.version || argv.v) {
  echo`v${version}`;
  process.exit(0);
}

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
  await appendIgnoresToGitignore();
  echo`Ignore files have been created from your .ignorefile`;
}
