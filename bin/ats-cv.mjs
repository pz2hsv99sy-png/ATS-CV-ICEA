#!/usr/bin/env node
/* Sert l'application sur un port local. Aucune dépendance.
   Au démarrage, va chercher la dernière version publiée : le cache de
   `pnpm dlx` ne peut donc plus servir une page périmée. */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { spawn } from "node:child_process";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const SOURCE = "https://raw.githubusercontent.com/pz2hsv99sy-png/ATS-CV-ICEA/main/index.html";

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
ats-cv — ATS d'un seul fichier pour trier des CV

  ats-cv [--port <n>] [--open] [--offline]

  --port <n>   port d'écoute (par défaut 5173, ou $PORT)
  --open       ouvre le navigateur au démarrage
  --offline    n'interroge pas GitHub, sert la copie du paquet
  --help       affiche cette aide
`);
  process.exit(0);
}

const drapeau = (nom, defaut) => {
  const i = args.indexOf(nom);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : defaut;
};
const portDemande = Number(drapeau("--port", process.env.PORT || 5173));
const versionDe = (html) =>
  (html.match(/<meta name="app-version" content="([^"]+)"/) || [, "0"])[1];

/* On sert la plus récente des deux : celle du paquet et celle publiée.
   Ainsi ni le cache de pnpm, ni un cache réseau intermédiaire ne peuvent
   faire tourner une version périmée. */
const rang = (v) => v.split(".").map((n) => parseInt(n, 10) || 0);
const plusRecent = (a, b) => {
  const [A, B] = [rang(a), rang(b)];
  for (let i = 0; i < 3; i++) if ((A[i] || 0) !== (B[i] || 0)) return (A[i] || 0) > (B[i] || 0);
  return false;
};

let page = await readFile(join(racine, "index.html"), "utf8");
let version = versionDe(page);
let provenance = "copie du paquet";

if (!args.includes("--offline")) {
  try {
    /* Le CDN de raw.githubusercontent.com garde une copie quelques minutes ;
       un paramètre unique force une réponse fraîche. */
    const rep = await fetch(`${SOURCE}?t=${Date.now()}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
      headers: { "user-agent": "ats-cv", "cache-control": "no-cache" }
    });
    if (!rep.ok) throw new Error("HTTP " + rep.status);
    const frais = await rep.text();
    if (!frais.includes("</html>")) throw new Error("réponse incomplète");
    const vFrais = versionDe(frais);
    if (plusRecent(version, vFrais)) {
      provenance = `copie du paquet — la version en ligne (v${vFrais}) est plus ancienne`;
    } else {
      page = frais;
      version = vFrais;
      provenance = "dernière version en ligne";
    }
  } catch (err) {
    provenance = `copie du paquet — GitHub injoignable (${err.message})`;
  }
}

const corps = Buffer.from(page, "utf8");

const serveur = createServer((req, res) => {
  const chemin = (req.url || "/").split("?")[0];
  if (chemin === "/" || chemin === "/index.html") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
    res.end(corps);
  } else {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Introuvable");
  }
});

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
  console.log(`Présélection des CV — application v${version} · ${provenance}`);
  console.log(url);
  console.log("Ctrl+C pour arrêter.");
  if (args.includes("--open")) {
    const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
    try { spawn(cmd, [url], { stdio: "ignore", detached: true, shell: process.platform === "win32" }).unref(); }
    catch { /* pas de navigateur disponible : l'URL affichée suffit */ }
  }
}
serveur.listen(port, demarre);
