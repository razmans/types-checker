"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTsFiles = getTsFiles;
exports.findDuplicateInterfaces = findDuplicateInterfaces;
const path_1 = require("path");
const fs_1 = require("fs");
const ts_morph_1 = require("ts-morph");
// Get all TypeScript files in a directory recursively
function getTsFiles(dir) {
    const files = [];
    for (const file of (0, fs_1.readdirSync)(dir)) {
        const fullPath = (0, path_1.resolve)(dir, file);
        if ((0, fs_1.statSync)(fullPath).isDirectory()) {
            files.push(...getTsFiles(fullPath));
        }
        else if ((0, path_1.extname)(fullPath) === ".ts" || (0, path_1.extname)(fullPath) === ".tsx") {
            files.push(fullPath);
        }
    }
    return files;
}
// Serialize interface properties for comparison
function serializeInterface(iface) {
    return JSON.stringify(iface.properties.sort((a, b) => a.name.localeCompare(b.name)), ["name", "type"]);
}
// Find duplicate interfaces
function findDuplicateInterfaces(filePaths) {
    const project = new ts_morph_1.Project();
    const interfaces = [];
    // Load and parse interfaces from files
    for (const filePath of filePaths) {
        const sourceFile = project.addSourceFileAtPath(filePath);
        const interfaceDecls = sourceFile.getInterfaces();
        for (const iface of interfaceDecls) {
            const properties = iface.getProperties().map((prop) => ({
                name: prop.getName(),
                type: prop.getType().getText(),
            }));
            interfaces.push({
                name: iface.getName(),
                filePath,
                properties,
            });
        }
    }
    // Compare interfaces for duplicates
    const seen = new Map();
    for (const iface of interfaces) {
        const key = serializeInterface(iface);
        if (!seen.has(key)) {
            seen.set(key, []);
        }
        seen.get(key).push(iface);
    }
    // Output results
    let hasDuplicates = false;
    for (const [key, group] of seen) {
        if (group.length > 1) {
            hasDuplicates = true;
            console.log("Duplicate interfaces found:");
            for (const iface of group) {
                console.log(`- ${iface.name} (${iface.filePath})`);
            }
            console.log("\n");
            console.log("Suggested merge:");
            console.log(`interface ${group[0].name} {`);
            for (const prop of group[0].properties) {
                console.log(`  ${prop.name}: ${prop.type};`);
            }
            console.log("}\n");
        }
    }
    if (!hasDuplicates) {
        console.log("No duplicate interfaces found.");
    }
}
//# sourceMappingURL=helper.js.map