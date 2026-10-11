import {rm} from "node:fs/promises";
import {basename, resolve} from "node:path";

const buildDirectory = resolve(process.cwd(), ".next");

if (basename(buildDirectory) !== ".next") {
  throw new Error(`Refusing to remove unexpected path: ${buildDirectory}`);
}

await rm(buildDirectory, {recursive: true, force: true});
