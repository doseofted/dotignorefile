#!/usr/bin/env node
// import * as ignorefile from ".";
import { $, echo, fs } from "zx";

const files = await fs.readdir(".", { withFileTypes: true });
const ignoreFiles = files.filter(
  (file) => file.isFile() && file.name.endsWith("ignore"),
);

echo`It's a WIP: in the future, we'll create ignore files from your .ignorefile!\n`;
echo`Found ignore files (none were modified):\n\n${ignoreFiles
  .map((file) => file.name)
  .join("\n")}`;
