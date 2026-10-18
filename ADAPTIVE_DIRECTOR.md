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
- [ ] Matérialiser toutes les mutations adaptatives dans les meshes 3D
- [ ] Test E2E d'une mission adaptative complète avec déplacement FPS
- [ ] CI verte sur le commit final de branche

## Critère de DONE

Le moteur est considéré fonctionnel quand une décision adaptative produit un effet observable dans le monde 3D, que l'état survit à un rechargement, que le formateur peut intervenir et que la même seed sans override reproduit le même scénario.

## Politique de merge

Pas de merge vers `main` tant que les trois derniers blocs ne sont pas cochés et que Playwright n'est pas vert. Une seed doit permettre de rejouer exactement les mêmes décisions, hors overrides explicitement journalisés du formateur.
