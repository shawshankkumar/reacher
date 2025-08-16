import React from 'react';
import { motion } from 'framer-motion';
import { Award, Share2, RotateCcw } from 'lucide-react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
  onShare: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart, onShare }) => {
  return (
    <div className="p-6 h-full flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mb-6"
      >
        <Award className="text-yellow-500" size={64} />
      </motion.div>
      
      <h1 className="text-2xl font-bold text-center mb-2">Quiz Complete!</h1>
      <p className="text-gray-600 text-center mb-6">You've finished the quiz.</p>
      
      <div className="bg-blue-50 p-6 rounded-xl w-full mb-8 text-center">
        <p className="text-gray-600 mb-2">Your Score</p>
        <p className="text-4xl font-bold text-blue-600">{score}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white border-2 border-blue-200 text-blue-600 px-4 py-3 rounded-xl font-medium flex items-center justify-center"
          onClick={onRestart}
        >
          <RotateCcw className="mr-2" size={18} />
          Play Again
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center"
          onClick={onShare}
        >
          <Share2 className="mr-2" size={18} />
          Share
        </motion.button>
      </div>
    </div>
  );
};

export default GameOver;