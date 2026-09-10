# ATS ICEA — tri visuel des CV

Un système de suivi des candidatures (ATS) en un seul fichier : `index.html`.
Aucune dépendance à installer, aucun serveur — ouvrez le fichier dans un navigateur.

## Ce que ça fait

- **Notation transparente.** Chaque CV reçoit un score sur 100 calculé à partir de cinq
  critères pondérés : compétences exigées, années d'expérience, formation, langues et
  proximité du poste. Les curseurs de la grille d'évaluation modifient les pondérations
  et reclassent tout le bassin en direct.
- **Tableau de bord.** Entonnoir de sélection par étape, distribution des scores avec
  médiane, couverture des compétences exigées, et quatre indicateurs clés.
- **Pipeline.** Cinq colonnes (nouveaux CV, présélection, entretien, offre, écartés) ;
  les fiches se déplacent au glisser-déposer.
- **Liste.** Tableau triable et filtrable, sélection multiple, déplacement en lot.
- **Fiche candidat.** Décomposition du score critère par critère, compétences obtenues
  et manquantes, extrait du CV, note du comité et commentaires.
- **Mode anonyme.** Masque nom, courriel et téléphone pendant la présélection pour
  limiter les biais.
- **Import.** Dépôt de fichiers PDF, TXT ou Markdown, ou collage direct du texte. Le
  CV est analysé (coordonnées, ville, années d'expérience, diplôme, compétences) puis
  noté selon la grille en vigueur.
- **Export.** CSV ou JSON, à copier dans un tableur ou un outil de suivi.

## Utilisation

```
# ouvrir directement
xdg-open index.html      # ou : open index.html

# ou servir localement
npx http-server . -p 8080
```

L'application démarre avec 16 candidatures fictives pour un poste de chargé·e de projet
en formation des adultes. « Recharger la démo » restaure ce jeu de données, « Tout
effacer » vide le dossier.

## Données

Tout est conservé dans le `localStorage` du navigateur (clé `icea-ats-v1`). Rien n'est
téléversé. L'extraction du texte des PDF utilise pdf.js, chargé depuis un CDN ; sans
connexion, les formats texte et le collage restent disponibles.

## Notation

| Critère | Poids par défaut | Calcul |
|---|---|---|
| Compétences exigées | 45 % | somme des poids des compétences détectées ÷ somme totale (33) |
| Années d'expérience | 25 % | années ÷ 6, plafonné à 100 % (minimum affiché : 4 ans) |
| Formation | 15 % | doctorat 100 %, maîtrise 95 %, bac 75 %, certificat 50 %, DEC 40 % |
| Langues | 10 % | français 60 % + anglais 40 % |
| Proximité du poste | 5 % | grand Montréal 100 %, ailleurs au Québec 55 %, hors Québec 30 % |

Les seuils de verdict : ≥ 80 fortement recommandé, ≥ 65 à rencontrer, ≥ 50 à revoir,
sinon hors profil.

Le poste, les dix compétences de la grille et les seuils sont déclarés en haut du
`<script>` de `index.html` (constantes `POSTE`, `SKILLS`, `CRITERES`) — c'est là qu'on
adapte l'outil à un autre affichage de poste.
