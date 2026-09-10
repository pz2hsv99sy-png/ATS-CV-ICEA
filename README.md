# Présélection des CV

Un ATS en un seul fichier : `index.html`. Zéro dépendance d'exécution.

Vous remplissez la grille de critères, vous déposez les CV, l'algorithme accepte, met à
revoir ou rejette chaque candidature, et vous explique pourquoi.

## Le moteur de décision

Chaque CV reçoit un score sur 100 : cinq critères pondérés dont vous fixez vous-même les
poids et le contenu.

| Critère | Poids par défaut | Calcul |
|---|---|---|
| Compétences exigées | 45 % | somme des poids des compétences détectées ÷ somme des poids de la grille |
| Années d'expérience | 25 % | années ÷ « plein pointage à », plafonné à 100 % |
| Formation | 15 % | doctorat 100 %, master 95 %, licence 75 %, certificat 50 %, diplôme technique 40 % |
| Langues | 10 % | 75 % pour les langues exigées, 25 % pour les langues valorisées |
| Lieu de travail | 5 % | 100 % si le lieu figure dans votre liste, 20 % sinon ; liste vide = critère neutre |

Le score passe ensuite par deux seuils que vous réglez : au-dessus du **seuil
d'acceptation**, le CV est accepté ; sous le **seuil de rejet**, il est rejeté ; entre les
deux, il est mis à revoir.

Quatre **règles éliminatoires**, activables une par une, passent avant le score — une
seule suffit à rejeter un CV :

- expérience sous le minimum exigé ;
- compétence marquée « obligatoire » absente du CV ;
- formation sous le niveau minimal ;
- lieu hors de la liste acceptée.

La décision est recalculée en direct : déplacez un curseur de pondération ou cochez une
règle, et tous les tampons changent immédiatement. La fiche candidat indique toujours le
motif exact.

## Ce que ça fait d'autre

- **Onglet Critères.** Compétences ajoutables, renommables, pondérées, avec leurs
  mots-clés cherchés dans le texte du CV. Exigences du poste, seuils, règles.
  Un aperçu montre l'effet de vos réglages sur le bassin et les principales causes de rejet.
- **Dépôt de CV.** PDF, TXT, Markdown ou texte collé. L'analyseur extrait coordonnées,
  lieu, années d'expérience, diplôme, langues et compétences, puis décide. Le classement
  dans le pipeline peut être automatique.
- **Tableau de bord.** Répartition des décisions, entonnoir de sélection, distribution des
  scores avec les deux seuils tracés, couverture des compétences exigées.
- **Pipeline.** Cinq colonnes en glisser-déposer. « Classer selon la décision » applique
  l'avis de l'algorithme aux nouveaux CV et aux écartés, sans toucher aux dossiers déjà
  engagés dans un processus humain.
- **Liste.** Tableau triable et filtrable, sélection multiple, déplacement en lot.
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
pnpm dlx github:pz2hsv99sy-png/ATS-CV-ICEA#claude/ats-cv-sorting-ui-mkio3h
```

Ou en dépendance d'un projet existant :

```sh
pnpm add github:pz2hsv99sy-png/ATS-CV-ICEA#claude/ats-cv-sorting-ui-mkio3h
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
