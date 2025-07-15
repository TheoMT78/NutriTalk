# NutriTalk

Cette application React permet de suivre votre alimentation et vos objectifs nutritionnels.

## Nouveautés

- Recherche d'aliments en ligne via OpenFoodFacts lorsque la base interne ne suffit pas.
- Si aucun résultat n'est trouvé, chaque mot de votre requête est recherché séparément pour améliorer la détection d'aliments.
- Possibilité de scanner un code-barres pour importer automatiquement un aliment.
  Si le navigateur ne supporte pas l'API BarcodeDetector, un lecteur alternatif basé sur ZXing est utilisé.
- Calcul automatique des besoins quotidiens en calories et macronutriments à partir de l'âge, du poids, de la taille et du sexe avec ajustement selon la fréquence d'activité.
- Les macronutriments sont répartis sur 25% de protéines, 25% de lipides et 50% de glucides.
- Suivi du nombre de pas avec objectif personnalisable et calcul automatique des calories brûlées.
- Boutons rapides (+500 à +5000) pour mettre à jour les pas.
- Calcul des calories restantes en tenant compte des pas.
- Suivi du poids quotidien avec réglages rapides depuis le tableau de bord.
- Objectifs de poids déclinés en perte légère/modérée ou prise légère/modérée (±5 à ±10%).
- Les besoins quotidiens et l'objectif calorique se mettent à jour dès que l'objectif de poids est modifié.
- Personnalisation manuelle des objectifs caloriques et macronutriments.
- Connexion par email avec création de compte locale.
- Interface en mode sombre par défaut.
- Progression des calories ajustée automatiquement avec les pas effectués.
- Les glucides recommandés augmentent selon les calories brûlées.
- L'historique est vide au départ et se remplit avec vos entrées.
- Les barres de l'historique passent au vert si l'objectif journalier est respecté à ±5%.
- Suivi du poids sur 7 jours grâce à un graphique intégré au tableau de bord.
- Le suivi des pas affiche le pourcentage exact même au-delà de 100%.
- Base d'aliments enrichie avec encore plus de produits crus, légumineuses et fruits pour de meilleurs résultats lors des recherches.
- Ajout de nouveaux aliments comme la patate douce et le kiwi jaune pour améliorer la reconnaissance hors ligne.
- Historique enrichi avec graphiques du poids et du nombre de pas.
- Historique d'exemple d'un an pour visualiser immédiatement les graphiques.
- Historique vide par défaut et calendrier plus large avec cases réduites.
- Un clic sur la progression des calories affiche un tableau détaillé des macro et micronutriments.
- Les cartes Protéines, Glucides et Lipides affichent une barre de progression.
- Objectif d'hydratation personnalisable avec des boutons +1L, +500 ml, +250 ml et -250 ml.
- Nouvelle section "Recette" accessible depuis la barre de navigation.
- Les graphiques de l'historique permettent désormais de choisir la période (7 jours à un an) et les détails quotidiens sont affichés du plus récent au plus ancien.

Ces fonctionnalités reposent sur l'API publique OpenFoodFacts.
