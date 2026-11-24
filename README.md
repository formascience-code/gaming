# UE2 - Synthèse des protéines · formaScience Gaming

Exploration jouable d’une cellule animale illustrée en coupe 2D. Cliquez dans le compartiment ou utilisez les flèches pour vous déplacer. Le repère du pore et le bouton de mission ouvrent le premier quiz. La bonne réponse déverrouille le passage vers le noyau. Les autres repères ouvrent des fiches pédagogiques.

## Démarrage et déploiement

Node.js 22 ou supérieur.

- `npm ci` pour installer les dépendances.
- `npm run dev` pour le développement.
- `npm run build` pour vérifier TypeScript et générer le site statique dans `out/`.
- Sur Vercel, importer le projet Next.js depuis le dossier qui contient `package.json`. Aucune variable d’environnement requise.

L’illustration vectorielle et les repères sont dans `app/atlas.tsx`. La navigation et la progression locale sont dans `app/page.tsx`. La scène représente des échelles relatives. Le pore franchissable est volontairement agrandi pour le jeu.

Le parcours contient cinq missions et 16 questions, avec une variante par notion, deux indices et un corrigé consultable à la demande. Un stéthoscope est gagné automatiquement après chaque bonne réponse. Si le corrigé est ouvert avant la réussite, un défi équivalent permet de gagner le stéthoscope. Le compteur ouvre le bilan. Les stéthoscopes et le recours aux aides sont enregistrés localement. La banque JSON est dans `app/data/questions.json`. Elle s’appuie sur les deux parties du chapitre BS-UE2-Ch5 (2627) et sur le cours Traduction 2025 transmis par formaScience.

## Réutiliser l’en-tête

Renseigner le titre dans `app/game-info.ts`. Le composant `GameHeader` porte le logo et la signature GAMING, communs aux jeux.
