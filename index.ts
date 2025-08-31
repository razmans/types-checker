#!/usr/bin/env node
import { program } from "commander";
import { resolve } from "path";
import { statSync } from "fs";
import { findDuplicateInterfaces, getTsFiles } from "./functions/helper";

// CLI setup
program
  .version("1.0.0")
  .description("Detect duplicate TypeScript interfaces in a file or directory")
  .argument("<path>", "Path to a TypeScript file or directory")
  .action((path: string) => {
    const resolvedPath = resolve(path);
    const stats = statSync(resolvedPath);
    const files = stats.isDirectory()
      ? getTsFiles(resolvedPath)
      : [resolvedPath];

    if (files.length === 0) {
      console.error("No TypeScript files found.");
      process.exit(1);
    }

    findDuplicateInterfaces(files);
  });

/** Export the CLI program for programmatic usage */
export { program };

program.parse(process.argv);
