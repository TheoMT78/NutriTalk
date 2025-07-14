import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FoodSearch from './components/FoodSearch';
import Profile from './components/Profile';
import History from './components/History';
import AIChat from './components/AIChat';
import FloatingAIButton from './components/FloatingAIButton';
import { useLocalStorage } from './hooks/useLocalStorage';
import { User, FoodEntry, DailyLog } from './types';
import { computeDailyTargets } from './utils/nutrition';

function App() {
  const defaultUser = {
    name: 'Utilisateur',
    email: 'user@example.com',
    age: 30,
    weight: 70,
    height: 175,
    gender: 'homme' as const,
    activityLevel: 'modérée' as const,
    goal: 'maintien' as const,
    avatar: 'https://images.pexels.com/photos/1310474/pexels-photo-1310474.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    theme: 'light' as const,
    notifications: true,
    stepGoal: 10000
  };

  const targets = computeDailyTargets(defaultUser);

  const [user, setUser] = useLocalStorage<User>('nutritalk-user', {
    ...defaultUser,
    dailyCalories: targets.calories,
    dailyProtein: targets.protein,
    dailyCarbs: targets.carbs,
    dailyFat: targets.fat
  });

  const [dailyLog, setDailyLog] = useLocalStorage<DailyLog>('nutritalk-daily-log', {
    date: new Date().toISOString().split('T')[0],
    entries: [],
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    water: 0,
    steps: 0
  });

  const [currentView, setCurrentView] = useState('dashboard');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (user.theme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (user.theme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, [user.theme]);

  const addFoodEntry = (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    const updatedLog = {
      ...dailyLog,
      entries: [...dailyLog.entries, newEntry],
      totalCalories: dailyLog.totalCalories + entry.calories,
      totalProtein: dailyLog.totalProtein + entry.protein,
      totalCarbs: dailyLog.totalCarbs + entry.carbs,
      totalFat: dailyLog.totalFat + entry.fat
    };

    setDailyLog(updatedLog);
  };

  const removeFoodEntry = (id: string) => {
    const entryToRemove = dailyLog.entries.find(entry => entry.id === id);
    if (!entryToRemove) return;

    const updatedLog = {
      ...dailyLog,
      entries: dailyLog.entries.filter(entry => entry.id !== id),
      totalCalories: dailyLog.totalCalories - entryToRemove.calories,
      totalProtein: dailyLog.totalProtein - entryToRemove.protein,
      totalCarbs: dailyLog.totalCarbs - entryToRemove.carbs,
      totalFat: dailyLog.totalFat - entryToRemove.fat
    };

    setDailyLog(updatedLog);
  };

  const updateWater = (amount: number) => {
    setDailyLog(prev => ({
      ...prev,
      water: Math.max(0, prev.water + amount)
    }));
  };

  const updateSteps = (amount: number) => {
    setDailyLog(prev => ({
      ...prev,
      steps: Math.max(0, prev.steps + amount)
    }));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            dailyLog={dailyLog}
            onRemoveEntry={removeFoodEntry}
            onUpdateWater={updateWater}
            onUpdateSteps={updateSteps}
          />
        );
      case 'search':
        return <FoodSearch onAddFood={addFoodEntry} />;
      case 'profile':
        return <Profile user={user} onUpdateUser={setUser} />;
      case 'history':
        return <History user={user} />;
      default:
        return (
          <Dashboard
            user={user}
            dailyLog={dailyLog}
            onRemoveEntry={removeFoodEntry}
            onUpdateWater={updateWater}
            onUpdateSteps={updateSteps}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Header 
        user={user} 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isDarkMode={isDarkMode}
        onToggleTheme={() => {
          const newTheme = isDarkMode ? 'light' : 'dark';
          setUser(prev => ({ ...prev, theme: newTheme }));
        }}
      />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {renderView()}
      </main>

      <FloatingAIButton onClick={() => setIsAIChatOpen(true)} />
      
      {isAIChatOpen && (
        <AIChat 
          onClose={() => setIsAIChatOpen(false)} 
          onAddFood={addFoodEntry}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default App;