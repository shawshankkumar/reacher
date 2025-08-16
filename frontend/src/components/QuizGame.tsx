import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CityQuestion, GuessResult } from '../types';
import Confetti from 'react-confetti';
import { CheckCircle, XCircle, ArrowRight, Award } from 'lucide-react';
import { getQuestion, verifyGuess } from '../api';

interface QuizGameProps {
  onGameComplete: (score: number) => void;
  onShare: () => void;
  points: number;
}

const QuizGame: React.FC<QuizGameProps> = ({ onGameComplete, onShare, points }) => {
  const [currentQuestion, setCurrentQuestion] = useState<CityQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [guessResult, setGuessResult] = useState<GuessResult | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [localPoints, setLocalPoints] = useState(points);
  const [showEmoji, setShowEmoji] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadQuestion();
  }, []);
  
  useEffect(() => {
    // Auto-hide emoji after 2 seconds
    let emojiTimer: number | undefined;
    if (showEmoji) {
      emojiTimer = window.setTimeout(() => {
        setShowEmoji(null);
      }, 2000);
    }
    
    return () => {
      if (emojiTimer) clearTimeout(emojiTimer);
    };
  }, [showEmoji]);
  
  const loadQuestion = async () => {
    try {
      setIsLoading(true);
      const question = await getQuestion();
      setCurrentQuestion(question);
      setSelectedOption(null);
      setGuessResult(null);
      setShowAnswer(false);
      setShowEmoji(null);
    } catch (error) {
      console.error('Error loading question:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOptionSelect = async (optionIndex: number) => {
    if (selectedOption !== null || !currentQuestion) return; // Prevent multiple selections
    
    setSelectedOption(optionIndex);
    
    try {
      const selectedCity = currentQuestion.options[optionIndex].city;
      const result = await verifyGuess(currentQuestion.city_id, selectedCity);
      setGuessResult(result);
      setLocalPoints(result.total_points);
      
      if (result.correct) {
        // Show confetti and positive emoji
        setShowConfetti(true);
        setShowEmoji('🎉');
        
        // Hide confetti after 2.5 seconds
        setTimeout(() => {
          setShowConfetti(false);
        }, 2500);
      } else {
        // Show negative emoji
        setShowEmoji('😢');
      }
      
      // Show answer explanation after a delay
      setTimeout(() => {
        setShowAnswer(true);
      }, 1000);
    } catch (error) {
      console.error('Error verifying guess:', error);
    }
  };
  
  const handleNextQuestion = () => {
    loadQuestion();
  };
  
  if (isLoading && !currentQuestion) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading question...</p>
      </div>
    );
  }
  
  if (!currentQuestion) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center">
        <p className="text-lg font-medium text-red-500">Failed to load question. Please try again.</p>
        <button 
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium"
          onClick={loadQuestion}
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-6 h-full flex flex-col">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      
      <div className="flex justify-between items-center mb-6">
        <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 font-medium">
          City Quiz
        </div>
        <div className="flex items-center">
          <Award className="text-yellow-500 mr-1" size={20} />
          <span className="font-bold">{localPoints}</span>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-xl mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Where is this?</h2>
        <p className="text-lg text-gray-700">{currentQuestion.clue}</p>
      </div>
      
      <div className="flex-1">
        <div className="grid gap-4 mb-6">
          {currentQuestion.options.map((option, index) => (
            <motion.button
              key={index}
              className={`p-4 rounded-xl border-2 text-left ${
                selectedOption === null
                  ? 'border-gray-200 hover:border-blue-300'
                  : selectedOption === index
                    ? guessResult?.correct
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : guessResult && option.city === guessResult.city.city && showAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 opacity-70'
              }`}
              whileHover={{ scale: selectedOption === null ? 1.02 : 1 }}
              whileTap={{ scale: selectedOption === null ? 0.98 : 1 }}
              onClick={() => handleOptionSelect(index)}
              disabled={selectedOption !== null}
            >
              <div className="flex items-start">
                <span className="bg-gray-100 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <div>
                  <span className="text-gray-800 font-medium">{option.city}</span>
                  <span className="text-gray-500 text-sm ml-2">{option.country}</span>
                </div>
                
                {selectedOption === index && guessResult?.correct && (
                  <CheckCircle className="text-green-500 ml-auto" size={20} />
                )}
                
                {selectedOption === index && !guessResult?.correct && (
                  <XCircle className="text-red-500 ml-auto" size={20} />
                )}
                
                {guessResult && option.city === guessResult.city.city && showAnswer && selectedOption !== index && (
                  <CheckCircle className="text-green-500 ml-auto" size={20} />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Emoji Animation */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.5, 
              type: "spring",
              exit: { duration: 0.3, ease: "easeOut" }
            }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <span className="text-6xl filter drop-shadow-lg">{showEmoji}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showAnswer && guessResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-blue-50 p-4 rounded-xl mb-4"
          >
            <h3 className="font-bold text-gray-800 mb-1">Fun Fact</h3>
            <p className="text-gray-700 mb-3">{guessResult.fun_fact}</p>
            <h3 className="font-bold text-gray-800 mb-1">Trivia</h3>
            <p className="text-gray-700">{guessResult.trivia}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex justify-between">
        {showAnswer && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium flex items-center"
            onClick={handleNextQuestion}
          >
            Next <ArrowRight className="ml-2" size={18} />
          </motion.button>
        )}
        
        {!showAnswer && (
          <button
            className="text-blue-600 font-medium"
            onClick={onShare}
          >
            Share
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizGame;