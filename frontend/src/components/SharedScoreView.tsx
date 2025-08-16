import React from 'react';
import { motion } from 'framer-motion';
import { Award, Play } from 'lucide-react';

interface SharedScoreViewProps {
  username: string;
  score: number;
  onStartGame: () => void;
}

const SharedScoreView: React.FC<SharedScoreViewProps> = ({ username, score, onStartGame }) => {
  return (
    <div className="p-6 h-full flex flex-col items-center justify-center">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <h1 className="text-2xl font-bold text-center mb-2">Challenge from {username}!</h1>
        <p className="text-gray-600 text-center mb-8">
          {username} has challenged you to beat their score in the City Quiz game.
        </p>
        
        <div className="bg-blue-50 p-6 rounded-xl w-full mb-8">
          <div className="flex items-center justify-center mb-4">
            <Award className="text-yellow-500 mr-2" size={24} />
            <h2 className="text-xl font-semibold">{username}'s Score</h2>
          </div>
          <p className="text-4xl font-bold text-blue-600 text-center">{score}</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-medium flex items-center justify-center"
          onClick={onStartGame}
        >
          <Play className="mr-2" size={20} />
          Start the Challenge
        </motion.button>
        
        <p className="text-sm text-gray-500 text-center mt-4">
          Think you can beat {username}? Give it a try!
        </p>
      </motion.div>
    </div>
  );
};

export default SharedScoreView;