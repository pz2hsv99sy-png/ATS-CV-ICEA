#!/usr/bin/env node
/* Sert l'application sur un port local. Aucune dépendance. */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { spawn } from "node:child_process";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
ats-cv — ATS d'un seul fichier pour trier des CV

  ats-cv [--port <n>] [--open]

  --port <n>   port d'écoute (par défaut 5173, ou $PORT)
  --open       ouvre le navigateur au démarrage
  --help       affiche cette aide
`);
  process.exit(0);
}

const drapeau = (nom, defaut) => {
  const i = args.indexOf(nom);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : defaut;
};
const portDemande = Number(drapeau("--port", process.env.PORT || 5173));
const page = await readFile(join(racine, "index.html"));

const serveur = createServer((req, res) => {
  const chemin = (req.url || "/").split("?")[0];
  if (chemin === "/" || chemin === "/index.html") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
    res.end(page);
  } else {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Introuvable");
  }
});

/* Si le port est pris, on essaie les suivants plutôt que de planter. */
let port = portDemande;
serveur.on("error", (err) => {
  if (err.code === "EADDRINUSE" && port < portDemande + 10) {
    serveur.listen(++port, demarre);
  } else {
    console.error("Impossible de démarrer le serveur :", err.message);
    process.exit(1);
  }
});

function demarre() {
  const url = `http://localhost:${port}`;
  console.log(`Présélection des CV — ${url}`);
  console.log("Ctrl+C pour arrêter.");
  if (args.includes("--open")) {
    const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
    try { spawn(cmd, [url], { stdio: "ignore", detached: true, shell: process.platform === "win32" }).unref(); }
    catch { /* pas de navigateur disponible : l'URL affichée suffit */ }
  }
}
serveur.listen(port, demarre);
