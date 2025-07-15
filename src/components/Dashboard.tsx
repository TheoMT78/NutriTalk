import React from 'react';
import { Target, TrendingUp, Droplets, Trash2, Edit3, Coffee, Utensils, Moon as Dinner, Apple } from 'lucide-react';
import { User, DailyLog } from '../types';
import MacroChart from './MacroChart';
import StepProgress, { CALORIES_PER_STEP } from './StepProgress';
import CalorieProgress from './CalorieProgress';
import WeightChart from './WeightChart';

interface DashboardProps {
  user: User;
  dailyLog: DailyLog;
  onRemoveEntry: (id: string) => void;
  onUpdateWater: (amount: number) => void;
  onUpdateSteps: (amount: number) => void;
  onUpdateWeight: (delta: number) => void;
  weightHistory: { date: string; weight: number }[];
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  dailyLog,
  onRemoveEntry,
  onUpdateWater,
  onUpdateSteps,
  onUpdateWeight,
  weightHistory
}) => {
  const getMealIcon = (meal: string) => {
    switch (meal) {
      case 'petit-déjeuner': return Coffee;
      case 'déjeuner': return Utensils;
      case 'dîner': return Dinner;
      case 'collation': return Apple;
      default: return Utensils;
    }
  };

  const getGoalMessage = () => {
    const stepsCalories = Math.max(0, dailyLog.steps - 4000) * CALORIES_PER_STEP;
    const totalGoal = user.dailyCalories + stepsCalories;
    const caloriesRemaining = totalGoal - dailyLog.totalCalories;
    if (caloriesRemaining > 0) {
      return `Il vous reste ${caloriesRemaining.toFixed(0)} calories aujourd'hui`;
    }
    return `Vous avez dépassé votre objectif de ${Math.abs(caloriesRemaining).toFixed(0)} calories`;
  };

  const stepsCalories = Math.max(0, dailyLog.steps - 4000) * CALORIES_PER_STEP;
  const totalGoal = user.dailyCalories + stepsCalories;
  const caloriesRemaining = totalGoal - dailyLog.totalCalories;
  const extraCarbs = stepsCalories / 4;
  const totalCarbGoal = user.dailyCarbs + extraCarbs;

  const groupedEntries = dailyLog.entries.reduce((acc, entry) => {
    if (!acc[entry.meal]) {
      acc[entry.meal] = [];
    }
    acc[entry.meal].push(entry);
    return acc;
  }, {} as Record<string, typeof dailyLog.entries>);

  const mealOrder = ['petit-déjeuner', 'déjeuner', 'dîner', 'collation'];

  return (
    <div className="space-y-6">
      {/* Header avec message de motivation */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Bonjour {user.name} !</h2>
        <p className="text-blue-100 mb-4">{getGoalMessage()}</p>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Target size={16} />
            <span>Objectif: {user.goal}</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} />
            <span>{user.dailyCalories} kcal/jour</span>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Calories consommées</p>
              <p className="text-2xl font-bold text-blue-600">
                {dailyLog.totalCalories.toFixed(0)}
              </p>
              <p className="text-sm text-gray-500">reste {caloriesRemaining.toFixed(0)} / {totalGoal.toFixed(0)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Target className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Protéines</p>
              <p className="text-2xl font-bold text-green-600">
                {dailyLog.totalProtein.toFixed(0)}g
              </p>
              <p className="text-sm text-gray-500">/ {user.dailyProtein}g</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Glucides</p>
              <p className="text-2xl font-bold text-orange-600">
                {dailyLog.totalCarbs.toFixed(0)}g
              </p>
              <p className="text-sm text-gray-500">
                / {totalCarbGoal.toFixed(0)}g
              </p>
              {extraCarbs > 0 && (
                <p className="text-xs text-gray-500">+{extraCarbs.toFixed(0)}g après activité</p>
              )}
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <Apple className="text-orange-600 dark:text-orange-400" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lipides</p>
              <p className="text-2xl font-bold text-purple-600">
                {dailyLog.totalFat.toFixed(0)}g
              </p>
              <p className="text-sm text-gray-500">/ {user.dailyFat}g</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Droplets className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <CalorieProgress
          consumed={dailyLog.totalCalories}
          burned={stepsCalories}
          target={user.dailyCalories}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        />
        <MacroChart
          protein={dailyLog.totalProtein}
          carbs={dailyLog.totalCarbs}
          fat={dailyLog.totalFat}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        />
        <StepProgress
          current={dailyLog.steps}
          target={user.stepGoal}
          onUpdate={onUpdateSteps}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        />
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Poids</p>
          <p className="text-2xl font-bold mb-2">{user.weight.toFixed(1)} kg</p>
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            <button onClick={() => onUpdateWeight(-1)} className="px-2 py-1 border rounded">-1</button>
            <button onClick={() => onUpdateWeight(-0.5)} className="px-2 py-1 border rounded">-0.5</button>
            <button onClick={() => onUpdateWeight(-0.1)} className="px-2 py-1 border rounded">-0.1</button>
            <button onClick={() => onUpdateWeight(0.1)} className="px-2 py-1 border rounded">+0.1</button>
            <button onClick={() => onUpdateWeight(0.5)} className="px-2 py-1 border rounded">+0.5</button>
            <button onClick={() => onUpdateWeight(1)} className="px-2 py-1 border rounded">+1</button>
          </div>
          <WeightChart data={weightHistory.slice(-7)} />
        </div>
      </div>

      {/* Hydratation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Droplets className="text-blue-500 mr-2" size={20} />
            Hydratation
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {dailyLog.water}ml / {user.dailyWater}ml
          </span>
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((dailyLog.water / user.dailyWater) * 100, 100)}%` }}
            />
          </div>
          <span className="text-sm font-medium">
            {Math.round((dailyLog.water / user.dailyWater) * 100)}%
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onUpdateWater(1000)}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            +1L
          </button>
          <button
            onClick={() => onUpdateWater(500)}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            +500ml
          </button>
          <button
            onClick={() => onUpdateWater(250)}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            +250ml
          </button>
          <button
            onClick={() => onUpdateWater(-250)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            -250ml
          </button>
        </div>
      </div>

      {/* Journal alimentaire */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">Journal alimentaire</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {new Date(dailyLog.date).toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="p-6 space-y-6">
          {mealOrder.map((meal) => {
            const entries = groupedEntries[meal] || [];
            const MealIcon = getMealIcon(meal);
            const mealCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
            
            return (
              <div key={meal} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <MealIcon size={20} className="text-blue-500" />
                    <h4 className="font-medium capitalize">{meal}</h4>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {mealCalories.toFixed(0)} kcal
                  </span>
                </div>
                
                {entries.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Aucun aliment ajouté pour ce repas
                  </p>
                ) : (
                  <div className="space-y-2">
                    {entries.map((entry) => (
                      <div 
                        key={entry.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{entry.name}</span>
                            <span className="text-sm text-gray-500">
                              {entry.quantity} {entry.unit}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {entry.calories.toFixed(0)} kcal • 
                            P: {entry.protein.toFixed(0)}g • 
                            G: {entry.carbs.toFixed(0)}g • 
                            L: {entry.fat.toFixed(0)}g
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-1 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                            title="Modifier"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => onRemoveEntry(entry.id)}
                            className="p-1 text-gray-500 hover:text-red-500 transition-colors duration-200"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;