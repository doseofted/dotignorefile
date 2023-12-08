#!/usr/bin/env node
import { echo, fs } from "zx";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as ignorefile from ".";

const files = await fs.readdir(".", { withFileTypes: true });
const ignoreFiles = files.filter(
  (file) => file.isFile() && file.name.endsWith("ignore"),
);

echo`It's a WIP: in the future, we'll create ignore files from your .ignorefile!\n`;
echo`Found ignore files (none were modified):\n\n${ignoreFiles
  .map((file) => file.name)
  .join("\n")}`;
