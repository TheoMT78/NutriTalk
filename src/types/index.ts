export interface User {
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  gender: 'homme' | 'femme';
  activityLevel: 'sédentaire' | 'légère' | 'modérée' | 'élevée' | 'très élevée';
  goal: 'perte' | 'maintien' | 'prise';
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  avatar: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
}

export interface FoodEntry {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  meal: 'petit-déjeuner' | 'déjeuner' | 'dîner' | 'collation';
  timestamp: string;
}

export interface DailyLog {
  date: string;
  entries: FoodEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  water: number;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  unit: string;
  isFavorite?: boolean;
  isCustom?: boolean;
}