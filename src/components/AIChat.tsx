import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, MicOff, Bot, User, Loader } from 'lucide-react';

interface AIChatProps {
  onClose: () => void;
  onAddFood: (food: {
    name: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    category: string;
    meal: 'petit-déjeuner' | 'déjeuner' | 'dîner' | 'collation';
  }) => void;
  isDarkMode: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: FoodSuggestion[];
}

interface FoodSuggestion {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  meal: 'petit-déjeuner' | 'déjeuner' | 'dîner' | 'collation';
  confidence: number;
}

const AIChat: React.FC<AIChatProps> = ({ onClose, onAddFood, isDarkMode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Bonjour ! Je suis votre assistant nutritionnel IA. Décrivez-moi votre repas et je l'analyserai pour vous. Par exemple : 'Ce midi j'ai mangé une assiette de pâtes bolognaise avec du parmesan' ou 'J'ai pris un petit-déjeuner avec 2 œufs, du pain complet et un avocat'.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const analyzeFood = (description: string): FoodSuggestion[] => {
    const suggestions: FoodSuggestion[] = [];
    const lowerDescription = description.toLowerCase();
    
    // Détection du repas
    let meal: 'petit-déjeuner' | 'déjeuner' | 'dîner' | 'collation' = 'déjeuner';
    if (lowerDescription.includes('petit-déjeuner') || lowerDescription.includes('matin')) {
      meal = 'petit-déjeuner';
    } else if (lowerDescription.includes('dîner') || lowerDescription.includes('soir')) {
      meal = 'dîner';
    } else if (lowerDescription.includes('collation') || lowerDescription.includes('goûter')) {
      meal = 'collation';
    }

    // Base de données simplifiée pour la reconnaissance
    const foodDatabase = [
      { keywords: ['pâtes', 'pasta', 'spaghetti', 'tagliatelle'], food: { name: 'Pâtes cuites', calories: 131, protein: 5, carbs: 25, fat: 1.1, category: 'Féculents', unit: '100g' }},
      { keywords: ['riz', 'rice'], food: { name: 'Riz blanc cuit', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, category: 'Féculents', unit: '100g' }},
      { keywords: ['poulet', 'chicken'], food: { name: 'Blanc de poulet', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'Protéines', unit: '100g' }},
      { keywords: ['œuf', 'oeuf', 'egg'], food: { name: 'Œufs', calories: 155, protein: 13, carbs: 1.1, fat: 11, category: 'Protéines', unit: '100g' }},
      { keywords: ['avocat', 'avocado'], food: { name: 'Avocat', calories: 160, protein: 2, carbs: 9, fat: 15, category: 'Fruits', unit: '100g' }},
      { keywords: ['pain', 'bread'], food: { name: 'Pain complet', calories: 247, protein: 13, carbs: 41, fat: 4.2, category: 'Féculents', unit: '100g' }},
      { keywords: ['tomate', 'tomato'], food: { name: 'Tomates', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, category: 'Légumes', unit: '100g' }},
      { keywords: ['salade', 'salad'], food: { name: 'Salade verte', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, category: 'Légumes', unit: '100g' }},
      { keywords: ['banane', 'banana'], food: { name: 'Banane', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, category: 'Fruits', unit: '100g' }},
      { keywords: ['pomme', 'apple'], food: { name: 'Pomme', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, category: 'Fruits', unit: '100g' }},
      { keywords: ['yaourt', 'yogurt'], food: { name: 'Yaourt nature 0%', calories: 56, protein: 10, carbs: 4, fat: 0.1, category: 'Produits laitiers', unit: '100g' }},
      { keywords: ['fromage', 'cheese'], food: { name: 'Fromage', calories: 280, protein: 22, carbs: 2.2, fat: 22, category: 'Produits laitiers', unit: '100g' }},
      { keywords: ['bœuf', 'beef'], food: { name: 'Bœuf haché 5%', calories: 137, protein: 20, carbs: 0, fat: 5, category: 'Protéines', unit: '100g' }},
      { keywords: ['saumon', 'salmon'], food: { name: 'Saumon', calories: 208, protein: 22, carbs: 0, fat: 13, category: 'Protéines', unit: '100g' }},
      { keywords: ['brocoli', 'broccoli'], food: { name: 'Brocolis', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, category: 'Légumes', unit: '100g' }},
    ];

    // Détection des quantités
    const extractQuantity = (text: string, keyword: string) => {
      const patterns = [
        new RegExp(`(\\d+)\\s*g.*?${keyword}`, 'i'),
        new RegExp(`${keyword}.*?(\\d+)\\s*g`, 'i'),
        new RegExp(`(\\d+)\\s*${keyword}`, 'i'),
        new RegExp(`${keyword}.*?(\\d+)`, 'i')
      ];
      
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          return parseInt(match[1]);
        }
      }
      return 100; // quantité par défaut
    };

    // Analyse du texte
    foodDatabase.forEach(({ keywords, food }) => {
      const found = keywords.some(keyword => lowerDescription.includes(keyword));
      if (found) {
        const quantity = extractQuantity(lowerDescription, keywords[0]);
        const multiplier = quantity / 100;
        
        suggestions.push({
          name: food.name,
          quantity,
          unit: food.unit,
          calories: food.calories * multiplier,
          protein: food.protein * multiplier,
          carbs: food.carbs * multiplier,
          fat: food.fat * multiplier,
          category: food.category,
          meal,
          confidence: 0.8 + Math.random() * 0.2
        });
      }
    });

    return suggestions;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulated AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const suggestions = analyzeFood(input);
    
    let aiResponse = '';
    if (suggestions.length > 0) {
      aiResponse = `J'ai analysé votre repas et identifié ${suggestions.length} aliment(s). Voici ce que j'ai trouvé :`;
      
      suggestions.forEach((suggestion, index) => {
        const totalCalories = suggestion.calories.toFixed(0);
        aiResponse += `\n\n${index + 1}. **${suggestion.name}** (${suggestion.quantity}${suggestion.unit})
- ${totalCalories} kcal
- Protéines: ${suggestion.protein.toFixed(1)}g
- Glucides: ${suggestion.carbs.toFixed(1)}g  
- Lipides: ${suggestion.fat.toFixed(1)}g`;
      });
      
      aiResponse += '\n\nVoulez-vous ajouter ces aliments à votre journal ? Vous pouvez cliquer sur "Ajouter" pour chaque aliment ou modifier les quantités si nécessaire.';
    } else {
      aiResponse = "Je n'ai pas pu identifier d'aliments spécifiques dans votre description. Pourriez-vous être plus précis ? Par exemple : 'J'ai mangé 150g de riz avec 100g de poulet grillé et des légumes'.";
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: aiResponse,
      timestamp: new Date(),
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleAddSuggestion = (suggestion: FoodSuggestion) => {
    onAddFood(suggestion);
    
    const confirmMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `✅ **${suggestion.name}** a été ajouté à votre journal pour le ${suggestion.meal} !`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, confirmMessage]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl h-[80vh] rounded-2xl shadow-2xl flex flex-col ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Assistant IA NutriTalk</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Analyseur nutritionnel intelligent
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {message.type === 'user' ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="whitespace-pre-line">{message.content}</div>
                
                {/* Suggestions d'aliments */}
                {message.suggestions && (
                  <div className="mt-4 space-y-2">
                    {message.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{suggestion.name}</div>
                            <div className="text-sm opacity-70">
                              {suggestion.quantity}{suggestion.unit} • {suggestion.calories.toFixed(0)} kcal
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddSuggestion(suggestion)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                          >
                            Ajouter
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className={`max-w-[80%] rounded-xl p-4 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="flex items-center space-x-2">
                  <Bot size={16} />
                  <Loader size={16} className="animate-spin" />
                  <span>Analyse en cours...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`p-4 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleVoiceInput}
              disabled={isListening}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isListening
                  ? 'bg-red-500 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="Reconnaissance vocale"
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Décrivez votre repas... (ex: 'J'ai mangé 150g de riz avec du poulet')"
              className={`flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;