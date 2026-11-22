# Le Grimoire — consignes Codex

## Projet

- Application web Angular 21 standalone, interface en français.
- Démarrage local : `npm start` ; compilation de production : `npm run build`.
- Vérification TypeScript et templates Angular : `npx ngc --noEmit -p tsconfig.app.json`.
- À chaque développement ou modification d’une fonctionnalité, lancer les tests automatisés pertinents avant de terminer (au minimum `npm test`, et `npm run test:e2e` si le parcours utilisateur concerné est couvert par les tests E2E).
- À chaque génération ou modification de code applicatif, créer ou mettre à jour des tests automatisés qui couvrent le comportement ajouté ou modifié ; ne pas se limiter à exécuter les tests existants.
- Si des tests échouent, corriger l’implémentation et relancer les tests. Ne pas modifier ni supprimer les tests existants pour masquer un échec ou faire passer artificiellement la suite. Ne toucher aux tests que si l’utilisateur demande explicitement leur modification ou si le comportement attendu des tests doit réellement évoluer ; expliquer alors le changement.

## Structure utile

- `src/app/app.routes.ts` : routes principales et parcours de création.
- `src/app/features/` : écrans, dont `home`, `game-setup` et `role-summary`.
- `src/app/data/roles.ts` et `src/app/models /role.model.ts` : catalogue et modèle des rôles. Le dossier de modèle contient actuellement un espace dans son nom ; conserver le chemin existant ou le corriger explicitement dans tous ses imports.
- `src/app/features/game-setup/composition-engine.ts` : génération des compositions.
- `src/app/features/game-setup/game-session.ts` : état partagé entre les écrans de création.
- `public/assets/roles/` et `public/assets/images/` : illustrations locales.

## Conventions

- Garder les composants standalone et utiliser le routage Angular existant.
- Préférer les signaux Angular pour l’état réactif déjà utilisé dans les écrans.
- Respecter les types `Role` et `RoleTeam` ; éviter les rôles ou chemins d’images codés en dur dans les templates.
- Avant de changer le générateur, vérifier que le nombre de rôles distribués correspond au nombre de joueurs, en tenant compte des rôles collectifs et des cartes de réserve.
- Les équipes sont `village`, `loup`, `solitaire` et `ambigu` ; un rôle ambigu ou solitaire ne doit pas être assimilé automatiquement à un villageois.
- Garder l’interface en français et l’identité visuelle sombre, forêt et or déjà présente.
- Concevoir mobile d’abord, vérifier qu’une largeur de 375 px ne crée pas de débordement horizontal, puis adapter les écrans aux grands formats.
- Utiliser les dépendances déjà installées avant d’en ajouter une nouvelle.
- Pour les modifications applicatives, compiler avec `npx ngc --noEmit -p tsconfig.app.json`. Le build de production peut nécessiter l’accès réseau, car certaines feuilles de style importent Google Fonts.

## Parcours produit actuel

- Accueil → paramétrage → résumé de la composition.
- Le bouton « Choisir cette composition » doit conserver les joueurs et rôles dans `GameSession`, puis ouvrir le résumé.
- Si une étape suivante n’existe pas encore, la signaler clairement plutôt que de rediriger vers un écran sans rapport.
