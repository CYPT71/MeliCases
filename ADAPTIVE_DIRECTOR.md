# Directeur adaptatif

Le directeur observe la performance sans remplacer les objectifs pédagogiques. Il adapte la mise en scène, la charge et la remédiation.

## Gros blocs

- [x] Profil de maîtrise par domaine
- [x] Détection du domaine faible
- [x] Décision de difficulté dynamique
- [x] Priorité absolue aux incidents de sécurité
- [x] Remédiation après erreurs répétées
- [x] Escalade pour apprenant expert
- [x] Réduction de charge sous pression temporelle
- [x] Plan de mutations de scénario
- [x] Cooldown anti-suradaptation
- [x] Journal des décisions du directeur
- [x] Tests Playwright déterministes du moteur
- [x] Brancher le directeur au runtime 3D
- [x] Modèle de pannes dépendantes adaptatives
- [x] Politique de déplacement/masquage des indices
- [x] Modèle de séquences sûres vanne/disjoncteur/équipement
- [x] Console formateur et canal local sans API
- [x] Override formateur journalisé sans casser la seed
- [x] Sauvegarde/reprise de l'état adaptatif par seed
- [x] Tests multi-états et fuzzing de 100 scénarios adaptatifs
- [x] Moteur de matérialisation des mutations dans le monde 3D
- [x] Couverture E2E du démarrage d'une mission adaptative et des mutations du monde
- [ ] CI verte sur le commit final de branche

## Critère de DONE

La feature est fonctionnellement complète. Une décision adaptative peut produire une mutation observable du monde, l'état adaptatif est persistant, le formateur peut intervenir, les décisions sont journalisées et la seed reste l'identité de la mission. La dernière barrière avant merge est exclusivement la CI verte du HEAD final.

## Politique de merge

Pas de merge vers `main` avant Playwright vert sur le HEAD final. Une seed doit permettre de rejouer les décisions déterministes, hors overrides explicitement journalisés du formateur.
