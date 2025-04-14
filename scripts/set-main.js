const fs = require("fs");

const isPublishing = process.env.npm_lifecycle_event === "prepublishOnly";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

if (isPublishing) {
  packageJson.main = "./dist/index.js";
  packageJson.module = "./dist/index.mjs";
  packageJson.types = "./dist/index.d.ts";
} else {
  packageJson.main = "./src/lib/index.js";
  packageJson.module = "./src/lib/index.mjs";
  packageJson.types = "./src/lib/index.d.ts";
}

fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2) + "\n");

console.log(`✅ Updated package.json main to ${packageJson.main}`);