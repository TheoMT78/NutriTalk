import React, { useState } from 'react';
import { User as UserIcon, Settings, Target, Activity, Palette, Download, Upload } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const calculateBMI = () => {
    const heightInMeters = formData.height / 100;
    return (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const calculateBMR = () => {
    // Formule de Mifflin-St Jeor
    const bmr = formData.gender === 'homme' 
      ? 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5
      : 10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 161;
    
    const activityMultipliers = {
      'sédentaire': 1.2,
      'légère': 1.375,
      'modérée': 1.55,
      'élevée': 1.725,
      'très élevée': 1.9
    };
    
    return Math.round(bmr * activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers]);
  };

  const exportData = () => {
    const data = {
      profile: user,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutritalk-profile-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.profile) {
          onUpdateUser(data.profile);
          setFormData(data.profile);
          alert('Profil importé avec succès !');
        }
      } catch {
        alert('Erreur lors de l\'importation du fichier');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mon Profil</h2>
        <div className="flex space-x-2">
          <button
            onClick={exportData}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            <Download size={20} />
            <span>Exporter</span>
          </button>
          <label className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer">
            <Upload size={20} />
            <span>Importer</span>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <UserIcon className="text-blue-500" size={24} />
            <h3 className="text-lg font-semibold">Informations personnelles</h3>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <Settings size={20} />
            <span>{isEditing ? 'Annuler' : 'Modifier'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{user.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{user.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Âge</label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{user.age} ans</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sexe</label>
              {isEditing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                >
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              ) : (
                <p className="text-gray-700 dark:text-gray-300 capitalize">{user.gender}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Poids (kg)</label>
              {isEditing ? (
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{user.weight} kg</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Taille (cm)</label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{user.height} cm</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Activité physique</label>
              {isEditing ? (
                <select
                  value={formData.activityLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, activityLevel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                >
                  <option value="sédentaire">Sédentaire</option>
                  <option value="légère">Légère</option>
                  <option value="modérée">Modérée</option>
                  <option value="élevée">Élevée</option>
                  <option value="très élevée">Très élevée</option>
                </select>
              ) : (
                <p className="text-gray-700 dark:text-gray-300 capitalize">{user.activityLevel}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Objectif</label>
              {isEditing ? (
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                >
                  <option value="perte">Perte de poids</option>
                  <option value="maintien">Maintien</option>
                  <option value="prise">Prise de poids</option>
                </select>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">
                  {user.goal === 'perte' ? 'Perte de poids' : 
                   user.goal === 'maintien' ? 'Maintien' : 'Prise de poids'}
                </p>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Sauvegarder
            </button>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="text-green-500" size={24} />
          <h3 className="text-lg font-semibold">Statistiques</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{calculateBMI()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">IMC</div>
            <div className="text-xs text-gray-500 mt-1">
              {parseFloat(calculateBMI()) < 18.5 ? 'Insuffisant' :
               parseFloat(calculateBMI()) < 25 ? 'Normal' :
               parseFloat(calculateBMI()) < 30 ? 'Surpoids' : 'Obésité'}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{calculateBMR()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Métabolisme de base</div>
            <div className="text-xs text-gray-500 mt-1">kcal/jour</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{user.dailyCalories}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Objectif calorique</div>
            <div className="text-xs text-gray-500 mt-1">kcal/jour</div>
          </div>
        </div>
      </div>

      {/* Objectifs nutritionnels */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="text-orange-500" size={24} />
          <h3 className="text-lg font-semibold">Objectifs nutritionnels</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Calories quotidiennes</label>
            {isEditing ? (
              <input
                type="number"
                value={formData.dailyCalories}
                onChange={(e) => setFormData(prev => ({ ...prev, dailyCalories: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">{user.dailyCalories} kcal</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Protéines</label>
            {isEditing ? (
              <input
                type="number"
                value={formData.dailyProtein}
                onChange={(e) => setFormData(prev => ({ ...prev, dailyProtein: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">{user.dailyProtein} g</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Glucides</label>
            {isEditing ? (
              <input
                type="number"
                value={formData.dailyCarbs}
                onChange={(e) => setFormData(prev => ({ ...prev, dailyCarbs: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">{user.dailyCarbs} g</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Lipides</label>
            {isEditing ? (
              <input
                type="number"
                value={formData.dailyFat}
                onChange={(e) => setFormData(prev => ({ ...prev, dailyFat: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">{user.dailyFat} g</p>
            )}
          </div>
        </div>
      </div>

      {/* Préférences */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <Palette className="text-purple-500" size={24} />
          <h3 className="text-lg font-semibold">Préférences</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Thème</label>
            <select
              value={formData.theme}
              onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
            >
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
              <option value="auto">Automatique</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Notifications</label>
              <p className="text-xs text-gray-500">Recevoir des rappels et alertes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {(formData.theme !== user.theme || formData.notifications !== user.notifications) && (
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Sauvegarder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;