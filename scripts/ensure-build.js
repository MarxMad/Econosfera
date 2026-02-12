#!/usr/bin/env node
/**
 * Si falta .next/server/middleware-manifest.json (p. ej. después de clean),
 * ejecuta `npm run build` para que Next pueda arrancar en dev.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const manifestPath = path.join(process.cwd(), ".next", "server", "middleware-manifest.json");

if (!fs.existsSync(manifestPath)) {
  console.log("Build no encontrado. Ejecutando npm run build...");
  execSync("npm run build", { stdio: "inherit", cwd: process.cwd() });
}
