import { extname, resolve } from "path";
import { readdirSync, statSync } from "fs";
import { Project } from "ts-morph";
import type { InterfaceInfo } from "./interface";

// Get all TypeScript files in a directory recursively
export function getTsFiles(dir: string): string[] {
  const files: string[] = [];
  for (const file of readdirSync(dir)) {
    const fullPath = resolve(dir, file);
    if (statSync(fullPath).isDirectory()) {
      files.push(...getTsFiles(fullPath));
    } else if (extname(fullPath) === ".ts" || extname(fullPath) === ".tsx") {
      files.push(fullPath);
    }
  }
  return files;
}

// Serialize interface properties for comparison
function serializeInterface(iface: InterfaceInfo): string {
  return JSON.stringify(
    iface.properties.sort((a, b) => a.name.localeCompare(b.name)),
    ["name", "type"],
  );
}

// Find duplicate interfaces
export function findDuplicateInterfaces(filePaths: string[]): void {
  const project = new Project();
  const interfaces: InterfaceInfo[] = [];

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
  const seen = new Map<string, InterfaceInfo[]>();
  for (const iface of interfaces) {
    const key = serializeInterface(iface);
    if (!seen.has(key)) {
      seen.set(key, []);
    }
    seen.get(key)!.push(iface);
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
