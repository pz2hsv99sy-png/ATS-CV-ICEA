#!/usr/bin/env node
/* Vérifie la syntaxe du script embarqué dans index.html. */
import { readFile, writeFile, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { join } from "node:path";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const blocs = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
if (!blocs.length) {
  console.error("Aucun script embarqué trouvé dans index.html.");
  process.exit(1);
}
const fichier = join(tmpdir(), `ats-cv-check-${process.pid}.mjs`);
await writeFile(fichier, blocs.join("\n"));
try {
  await promisify(execFile)(process.execPath, ["--check", fichier]);
  console.log(`Syntaxe correcte — ${blocs.length} bloc(s), ${blocs.join("\n").split("\n").length} lignes.`);
} catch (err) {
  console.error(err.stderr || err.message);
  process.exitCode = 1;
} finally {
  await rm(fichier, { force: true });
}
