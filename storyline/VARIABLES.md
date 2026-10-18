# Variables Storyline 360

Créer ces variables dans Storyline avant d’insérer le Web Object.

| Variable | Type | Défaut | Usage |
|---|---|---:|---|
| `MeliVersion` | Texte | vide | Version du contrat d’intégration |
| `MeliSeed` | Texte | vide | Identifiant reproductible de mission |
| `MeliLearnerName` | Texte | vide | Nom transmis par Storyline au jeu |
| `MeliDifficulty` | Texte | `standard` | `initiation`, `standard` ou `expert` |
| `MeliStatus` | Texte | `not-started` | État de la tentative |
| `MeliTopic` | Texte | vide | Domaine technique courant |
| `MeliScore` | Nombre | `0` | Précision globale, de 0 à 100 |
| `MeliProgress` | Nombre | `0` | Progression, de 0 à 100 |
| `MeliSafety` | Nombre | `100` | Indicateur de sécurité |
| `MeliXP` | Nombre | `0` | Expérience acquise |
| `MeliAttempts` | Nombre | `0` | Nombre total de décisions |
| `MeliLastQuestion` | Texte | vide | Dernière situation traitée |
| `MeliLastResult` | Texte | vide | `correct` ou `incorrect` |
| `MeliConfidence` | Texte | vide | Confiance déclarée |
| `MeliSuspendData` | Texte | vide | État JSON pour la reprise |
| `MeliCompleted` | Vrai/Faux | `False` | Mission terminée |
| `MeliPassed` | Vrai/Faux | `False` | Seuil pédagogique atteint |

Les variables historiques `EscapeSeed`, `EscapeSolved`, `EscapeScore`,
`EscapeLastCase` et `EscapeCompleted` restent synchronisées.

## Déclencheurs conseillés

1. Afficher la slide de réussite si `MeliCompleted == True` et `MeliPassed == True`.
2. Afficher la remédiation si `MeliCompleted == True` et `MeliPassed == False`.
3. Reporter `MeliScore` dans la variable de résultat Storyline.
4. Conserver `MeliSuspendData` lors d’une reprise du module LMS.
