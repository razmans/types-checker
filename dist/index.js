#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const commander_1 = require("commander");
Object.defineProperty(exports, "program", { enumerable: true, get: function () { return commander_1.program; } });
const path_1 = require("path");
const fs_1 = require("fs");
const helper_1 = require("./functions/helper");
// CLI setup
commander_1.program
    .version("1.0.0")
    .description("Detect duplicate TypeScript interfaces in a file or directory")
    .argument("<path>", "Path to a TypeScript file or directory")
    .action((path) => {
    const resolvedPath = (0, path_1.resolve)(path);
    const stats = (0, fs_1.statSync)(resolvedPath);
    const files = stats.isDirectory()
        ? (0, helper_1.getTsFiles)(resolvedPath)
        : [resolvedPath];
    if (files.length === 0) {
        console.error("No TypeScript files found.");
        process.exit(1);
    }
    (0, helper_1.findDuplicateInterfaces)(files);
});
commander_1.program.parse(process.argv);
//# sourceMappingURL=index.js.map