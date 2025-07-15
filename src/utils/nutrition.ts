export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function calculateTDEE({ weight, height, age, gender, activityLevel, goal }:
  { weight: number; height: number; age: number; gender: 'homme' | 'femme'; activityLevel: string; goal: 'perte' | 'maintien' | 'prise'; }): number {
  // Formule de Mifflin-St Jeor
  const bmr = gender === 'homme'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  const activityMultipliers: Record<string, number> = {
    'sédentaire': 1.2,
    'légère': 1.375,
    'modérée': 1.55,
    'élevée': 1.725,
    'très élevée': 1.9
  };

  const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

  // Ajustement selon l'objectif (±5 % du TDEE)
  const goalMultiplier = goal === 'perte' ? 0.95 : goal === 'prise' ? 1.05 : 1;

  return Math.round(tdee * goalMultiplier);
}

export function calculateMacroTargets(calories: number): Omit<MacroTargets, 'calories'> {
  const proteinCalories = calories * 0.3; // 30% protein
  const fatCalories = calories * 0.25; // 25% fat
  const carbsCalories = calories - proteinCalories - fatCalories; // rest carbs
  return {
    protein: Math.round(proteinCalories / 4),
    carbs: Math.round(carbsCalories / 4),
    fat: Math.round(fatCalories / 9)
  };
}

export function computeDailyTargets(user: { weight: number; height: number; age: number; gender: 'homme' | 'femme'; activityLevel: string; goal: 'perte' | 'maintien' | 'prise'; }): MacroTargets {
  const calories = calculateTDEE(user);
  const macros = calculateMacroTargets(calories);
  return { calories, ...macros };
}
