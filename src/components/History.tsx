import React, { useState } from 'react';
import { Calendar, TrendingUp, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { User } from '../types';
import WeightChart from './WeightChart';
import StepHistoryChart from './StepHistoryChart';

interface HistoryProps {
  user: User;
  weightHistory: { date: string; weight: number }[];
}

const History: React.FC<HistoryProps> = ({ user, weightHistory }) => {
  const [currentView, setCurrentView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Historique vide au premier lancement
  interface HistoryDay {
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
    weight: number;
    steps: number;
    meals: number;
  }

  const [historyData] = useState<HistoryDay[]>([]);

  const getCurrentPeriodData = () => {
    const days = currentView === 'monthly' ? 30 : currentView === 'weekly' ? 7 : 7;
    return historyData.slice(-days);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const exportHistory = () => {
    const csvContent = [
      ['Date', 'Calories', 'Protéines', 'Glucides', 'Lipides', 'Eau', 'Poids', 'Repas'],
      ...historyData.map(day => [
        day.date,
        day.calories,
        day.protein,
        day.carbs,
        day.fat,
        day.water,
        day.weight,
        day.meals
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutritalk-historique-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePDF = () => {
    // Simulation de génération PDF
    alert('Génération du rapport PDF... Cette fonctionnalité sera disponible prochainement.');
  };

  const currentData = getCurrentPeriodData();
  const avgCalories = currentData.length
    ? Math.round(currentData.reduce((sum, day) => sum + day.calories, 0) / currentData.length)
    : 0;
  const avgProtein = currentData.length
    ? Math.round(currentData.reduce((sum, day) => sum + day.protein, 0) / currentData.length)
    : 0;
  const avgCarbs = currentData.length
    ? Math.round(currentData.reduce((sum, day) => sum + day.carbs, 0) / currentData.length)
    : 0;
  const avgFat = currentData.length
    ? Math.round(currentData.reduce((sum, day) => sum + day.fat, 0) / currentData.length)
    : 0;
  const avgWater = currentData.length
    ? Math.round(currentData.reduce((sum, day) => sum + day.water, 0) / currentData.length)
    : 0;
  const avgSteps = currentData.length
    ? Math.round(currentData.reduce((sum, day) => sum + day.steps, 0) / currentData.length)
    : 0;
  const avgWeight = currentData.length
    ? Math.round(currentData.reduce((sum, day) => sum + day.weight, 0) / currentData.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Historique nutritionnel</h2>
        <div className="flex space-x-2">
          <button
            onClick={exportHistory}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            <Download size={20} />
            <span>CSV</span>
          </button>
          <button
            onClick={generatePDF}
            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            <Download size={20} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Filtres de vue */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="text-blue-500" size={24} />
            <h3 className="text-lg font-semibold">Période d'analyse</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium">
              {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['daily', 'weekly', 'monthly'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentView === view
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {view === 'daily' ? 'Quotidien' : 
               view === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
            </button>
          ))}
        </div>
      </div>

      {/* Statistiques moyennes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="text-green-500" size={24} />
          <h3 className="text-lg font-semibold">Moyennes des 7 derniers jours</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{avgCalories}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Calories</div>
            <div className="text-xs text-gray-500">
              {avgCalories > user.dailyCalories ? '+' : ''}
              {avgCalories - user.dailyCalories} par rapport à l'objectif
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{avgProtein}g</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Protéines</div>
            <div className="text-xs text-gray-500">
              {avgProtein > user.dailyProtein ? '+' : ''}
              {avgProtein - user.dailyProtein}g par rapport à l'objectif
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{avgCarbs}g</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Glucides</div>
            <div className="text-xs text-gray-500">
              {avgCarbs > user.dailyCarbs ? '+' : ''}
              {avgCarbs - user.dailyCarbs}g par rapport à l'objectif
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{avgFat}g</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Lipides</div>
            <div className="text-xs text-gray-500">
              {avgFat > user.dailyFat ? '+' : ''}
              {avgFat - user.dailyFat}g par rapport à l'objectif
            </div>
          </div>
        </div>
      </div>

      {/* Graphique des calories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-6">Évolution des calories</h3>

        {historyData.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune donnée pour le moment</p>
        ) : (
        <div className="space-y-4">
          {historyData.slice(-14).map((day) => {
            const percentage = (day.calories / user.dailyCalories) * 100;
            const withinRange = percentage >= 95 && percentage <= 105;
            
            return (
              <div key={day.date} className="flex items-center space-x-4">
                <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(day.date)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{day.calories} kcal</span>
                    <span className={`text-sm ${withinRange ? 'text-green-500' : 'text-red-500'}`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        withinRange ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {day.meals} repas
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* Graphique des pas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-6">Évolution des pas</h3>
        {historyData.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune donnée pour le moment</p>
        ) : (
          <StepHistoryChart data={historyData.slice(-7).map(d => ({ date: d.date, steps: d.steps }))} />
        )}
        {historyData.length > 0 && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            Moyenne {avgSteps} pas/jour
          </p>
        )}
      </div>

      {/* Graphique du poids */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-6">Évolution du poids</h3>
        {weightHistory.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune donnée pour le moment</p>
        ) : (
          <WeightChart data={weightHistory.slice(-7)} />
        )}
        {weightHistory.length > 0 && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            Poids moyen {avgWeight} kg
          </p>
        )}
      </div>

      {/* Graphique de l'eau */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-6">Hydratation</h3>
        {historyData.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune donnée pour le moment</p>
        ) : (
          <StepHistoryChart data={historyData.slice(-7).map(d => ({ date: d.date, steps: d.water }))} />
        )}
        {historyData.length > 0 && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            Moyenne {avgWater} ml/jour
          </p>
        )}
      </div>

      {/* Tableau détaillé */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">Détails par jour</h3>
        </div>

        {historyData.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">Aucune donnée pour le moment</p>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Calories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Protéines
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Glucides
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lipides
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Eau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Poids
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {historyData.slice(-10).map((day) => (
                <tr key={day.date} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {new Date(day.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${
                      day.calories > user.dailyCalories ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {day.calories}
                    </span>
                    <span className="text-gray-500 ml-1">kcal</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {day.protein}g
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {day.carbs}g
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {day.fat}g
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {day.water}ml
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {day.weight}kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
};

export default History;
