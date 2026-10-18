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
- [ ] Brancher le directeur au runtime 3D
- [ ] Matérialiser les pannes dépendantes dans l'appartement
- [ ] Déplacer/masquer les indices en temps réel
- [ ] Séquences sûres vanne/disjoncteur/équipement
- [ ] Console formateur avec télémétrie du directeur
- [ ] Override formateur sans casser la seed
- [ ] Sauvegarde/reprise de l'état adaptatif
- [ ] Tests multi-seeds et fuzzing de scénarios
- [ ] Test E2E d'une mission adaptative complète
- [ ] CI verte sur toute la branche

## Politique de merge

Pas de merge vers `main` tant que les gros blocs ne sont pas tous cochés et que Playwright n'est pas vert. Une seed doit permettre de rejouer exactement les mêmes décisions, hors overrides explicitement journalisés du formateur.
