# Intégration Storyline 360 — MeliCases

Storyline 360 reste l’outil auteur du module final. Le jeu WebGL MeliCases est prévu pour être embarqué dans Storyline comme **Web Object / contenu web**, puis piloté par des variables Storyline.

> Important : Storyline 360 est un logiciel propriétaire. Le dépôt ne peut donc pas contenir l’application Storyline elle-même. Ce dossier contient la couche d’intégration et les instructions nécessaires.

## Architecture recommandée

1. Héberger le jeu WebGL sur un serveur HTTPS ou l’intégrer comme Web Object selon le mode de déploiement retenu.
2. Dans Storyline 360, créer une scène `Mission Logement` avec une slide contenant le Web Object. La séquence est exploratoire et ne doit comporter aucun compte à rebours.
3. Créer les variables Storyline documentées dans `VARIABLES.md`. Les variables
   `Escape*` historiques restent alimentées, mais les nouvelles variables `Meli*`
   permettent le suivi détaillé, la reprise et le débrief.
4. Utiliser `storyline/bridge.js` comme référence pour la communication entre le jeu et le player Storyline lorsque le contexte d’hébergement autorise l’accès au parent.
5. Dans Storyline, baser la validation de la séquence sur `MeliCompleted = True`. `EscapeCompleted` reste uniquement une variable de compatibilité avec les anciennes publications.
6. Publier ensuite le projet Storyline vers le LMS dans le format demandé par le client (SCORM/xAPI/cmi5 selon l’environnement).

## Randomisation

Le jeu doit générer une graine de session (`seed`) au lancement. Cette graine détermine :
- la position des anomalies ;
- les variantes d’indices ;
- l’ordre de résolution ;
- éventuellement le code final.

Ainsi, une même session reste reproductible avec sa graine, tandis qu’une nouvelle session produit une configuration différente.

## Variables et événements

Le jeu envoie les événements suivants via `CustomEvent` et `postMessage` :
- `melicases:ready`
- `melicases:decision`
- `melicases:progress`
- `melicases:suspend`
- `melicases:completed`
- `melicases:state`

La passerelle convertit directement ces événements en variables avec
`GetPlayer().SetVar(...)`. La slide peut aussi envoyer `pause`, `resume`, `reset`
ou `request-state` au Web Object. Voir `trigger-snippets.js`.

## Reprise de session

Chaque décision sérialise l’état dans `MeliSuspendData`. Storyline peut conserver
cette variable lors d’une reprise LMS. Au lancement, `getLaunchData()` expose la
graine, la difficulté, le nom de l’apprenant et les données suspendues au jeu.

## Validation de la slide

Le résultat est prêt lorsque `MeliCompleted = True`. `MeliPassed` applique le seuil
du serious game, tandis que `MeliScore`, `MeliSafety`, `MeliXP` et `MeliProgress`
alimentent l’écran de débrief ou les rapports LMS.

## Publication

Articulate indique que Storyline publie en HTML5 et prend en charge la diffusion LMS, notamment SCORM, xAPI et cmi5. Le jeu reste donc un composant web interactif, tandis que Storyline conserve le rôle d’enveloppe pédagogique, de suivi et de publication LMS.
