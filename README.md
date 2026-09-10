# Présélection des CV

Un ATS en un seul fichier : `index.html`. Zéro dépendance d'exécution.

Vous remplissez la grille de critères, vous déposez les CV, l'algorithme accepte, met à
revoir ou rejette chaque candidature, et vous explique pourquoi.

## Ouvrir en dix secondes, sans rien taper

1. Ouvrez la page du dépôt : <https://github.com/pz2hsv99sy-png/ATS-CV-ICEA>
2. Cliquez sur `index.html` dans la liste des fichiers.
3. Bouton **Download raw file** (l'icône de téléchargement, en haut à droite du fichier).
4. Double-cliquez le fichier téléchargé.

Ni Node, ni pnpm, ni terminal. Le fichier fonctionne ensuite hors ligne.

Pour les commandes ci-dessous, ne les recopiez pas à la main : sur la page du dépôt,
chaque bloc de code a un bouton « copier » à droite. Un tiret bas à la place d'un trait
d'union, ou `pnj` à la place de `png`, et GitHub répond 404.

## Le moteur de décision

Chaque CV reçoit un score sur 100 : cinq critères pondérés dont vous fixez vous-même les
poids et le contenu.

| Critère | Poids par défaut | Calcul |
|---|---|---|
| Compétences exigées | 45 % | somme des poids des compétences détectées ÷ somme des poids de la grille |
| Années d'expérience | 25 % | années ÷ « plein pointage à », plafonné à 100 % |
| Années de formation | 15 % | années d'études ÷ « 100 % à », plafonné à 100 % |
| Nombre de langues | 10 % | langues détectées ÷ « 100 % à », plafonné à 100 % |
| Lieu de travail | 5 % | 100 % si le lieu figure dans votre liste, 20 % sinon ; liste vide = critère neutre |

Les trois critères chiffrés — expérience, années de formation, nombre de langues — se
règlent de la même façon : un **minimum**, une **cible** qui vaut 100 %, et pour les deux
premiers un **plafond** facultatif (0 = aucun). Le diplôme reste affiché, mais c'est le
nombre d'années d'études qui note : certificat 1, technique 2, licence 3, master 5,
doctorat 8 — et un CV qui écrit « bac+4 » vaut 4.

Le score passe ensuite par deux seuils exprimés en pourcentage : au-dessus du **seuil
d'acceptation**, le CV est accepté ; sous le **seuil de rejet**, il est rejeté ; entre les
deux, il est mis à revoir.

Sept **règles éliminatoires**, activables une par une, passent avant le score — une seule
suffit à rejeter un CV :

- moins de X années d'expérience ;
- plus de X années d'expérience (surqualification) ;
- moins de X années de formation ;
- plus de X années de formation ;
- moins de X langues ;
- compétence marquée « obligatoire » absente du CV ;
- lieu hors de la liste acceptée.

Chaque règle affiche le nombre en vigueur dans son libellé, et le tableau de bord donne
les **taux d'acceptation et de rejet** en pourcentage.

La décision est recalculée en direct : déplacez un curseur de pondération ou cochez une
règle, et tous les tampons changent immédiatement. La fiche candidat indique toujours le
motif exact.

## Ce que ça fait d'autre

- **Onglet Critères.** Trois nombres suffisent pour démarrer : années d'expérience, années
  d'études, nombre de langues. En dessous, les compétences avec leurs mots-clés, puis une
  échelle en trois zones — rejeté, à revoir, accepté — pour placer les seuils. Le reste
  (plafonds, règles de rejet, pondérations) est replié tant que vous n'en avez pas besoin.
  Un aperçu montre l'effet de vos réglages et les principales causes de rejet.
- **Dépôt de CV.** PDF, TXT, Markdown ou texte collé. L'analyseur extrait coordonnées,
  lieu, années d'expérience, diplôme, langues et compétences, puis décide. Le classement
  dans le pipeline peut être automatique.
- **Tableau de bord.** Répartition des décisions, entonnoir de sélection, distribution des
  scores avec les deux seuils tracés, couverture des compétences exigées.
- **Pipeline.** Cinq colonnes en glisser-déposer. « Classer selon la décision » applique
  l'avis de l'algorithme aux nouveaux CV et aux écartés, sans toucher aux dossiers déjà
  engagés dans un processus humain.
- **Liste.** Tableau triable et filtrable — candidature, score, décision, compétences, étape,
  date — avec sélection multiple et déplacement en lot. Expérience, formation, langues et lieu
  se lisent dans la fiche.
- **Mode anonyme.** Masque nom, courriel et téléphone pendant la présélection, jusque dans
  l'export.
- **Export.** CSV ou JSON, décision et motif compris.

## Installation et lancement

Avec pnpm, depuis le dépôt :

```sh
pnpm install
pnpm dev      # sert l'application et ouvre le navigateur
pnpm start    # sert sans ouvrir le navigateur (http://localhost:5173)
pnpm check    # vérifie la syntaxe du script embarqué dans index.html
```

Sans cloner, directement depuis GitHub :

```sh
pnpm dlx github:pz2hsv99sy-png/ATS-CV-ICEA
```

Le nom du dépôt ne prend que des traits d'union. Un tiret bas donne
`ERR_PNPM_GIT_RESOLVE_FAILED` : GitHub ne trouve pas le dépôt et pnpm croit alors qu'il
est privé.

**Le cache ne peut plus vous servir du périmé.** `pnpm dlx` réutilise pendant 24 h ce
qu'il a téléchargé. Au démarrage, la commande lit la version du paquet, va chercher celle
publiée sur `main`, et **sert la plus récente des deux** — un cache réseau intermédiaire ne
peut donc pas non plus la faire régresser. Elle annonce toujours ce qu'elle sert :

```
Présélection des CV — application v1.2.0 · dernière version en ligne
Présélection des CV — application v1.2.0 · copie du paquet — GitHub injoignable (…)
```

`--offline` saute la requête et sert la copie du paquet directement.

La comparaison se fait sur `<meta name="app-version">` dans `index.html` : toute
modification de la page doit s'accompagner d'une montée de ce numéro et de celui de
`package.json`.

Une seule fois, si votre cache contient encore une version antérieure à 1.2.0, forcez le
rafraîchissement du paquet lui-même — ensuite la mise à jour est automatique :

```sh
pnpm --config.dlxCacheMaxAge=0 dlx github:pz2hsv99sy-png/ATS-CV-ICEA
```

Sur Windows, sans Node ni pnpm — un navigateur suffit :

```powershell
iwr "https://raw.githubusercontent.com/pz2hsv99sy-png/ATS-CV-ICEA/main/index.html" -OutFile ats-cv.html
start ats-cv.html
```

Ou en dépendance d'un projet existant :

```sh
pnpm add github:pz2hsv99sy-png/ATS-CV-ICEA
pnpm exec ats-cv --port 8080 --open
```

La commande `ats-cv` accepte `--port <n>`, `--open` et `--help`. Le serveur ne sert que
`index.html` et n'écrit rien sur le disque.

Le fichier reste utilisable seul, sans Node : `open index.html` suffit.

Pour publier le paquet sur le registre npm (`ats-cv` était disponible au moment de
l'écriture), ajoutez d'abord un champ `license` et un fichier `LICENSE`, puis
`pnpm publish`.

## Le dossier de démonstration

L'application démarre avec 16 candidatures fictives. « Recharger la démo » restaure ce jeu
de données sans toucher à votre grille ; « Tout effacer » vide le dossier.

## Données

Tout est conservé dans le `localStorage` du navigateur (clé `ats-cv-v1`) : les
candidatures comme la grille de critères. Rien n'est téléversé. L'extraction du texte des
PDF utilise pdf.js chargé depuis un CDN ; hors ligne, les formats texte et le collage
restent disponibles.
