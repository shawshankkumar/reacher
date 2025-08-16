import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Play, User } from 'lucide-react';
import { getInviteInfo } from '../api';

interface InviteScreenProps {
  inviteId: string;
  onStartGame: () => void;
}

const InviteScreen: React.FC<InviteScreenProps> = ({ inviteId, onStartGame }) => {
  const [username, setUsername] = useState<string>('');
  const [points, setPoints] = useState<number>(0);
  const [imageLink, setImageLink] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInviteData = async () => {
      try {
        setIsLoading(true);
        const inviteData = await getInviteInfo(inviteId);
        setUsername(inviteData.username);
        setPoints(inviteData.points);
        setImageLink(inviteData.image_link);
      } catch (error) {
        console.error('Error loading invite data:', error);
        setError('Failed to load invitation. It may be invalid or expired.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInviteData();
  }, [inviteId]);

  if (isLoading) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading invitation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <User className="text-red-500" size={40} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Invalid Invitation</h1>
        <p className="text-gray-600 text-center mb-6">{error}</p>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium"
          onClick={onStartGame}
        >
          Start New Game
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col items-center justify-center">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 overflow-hidden">
            {imageLink ? (
              <img 
                src={imageLink} 
                alt={username} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`;
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <User className="text-white" size={40} />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Invitation from {username}!</h1>
          <p className="text-gray-600 text-center">
            {username} has invited you to play the City Quiz game and beat their high score.
          </p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl w-full mb-8">
          <div className="flex items-center justify-center mb-4">
            <Award className="text-yellow-500 mr-2" size={24} />
            <h2 className="text-xl font-semibold">{username}'s Score</h2>
          </div>
          <p className="text-4xl font-bold text-blue-600 text-center">{points}</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-medium flex items-center justify-center"
          onClick={onStartGame}
        >
          <Play className="mr-2" size={20} />
          Accept Challenge
        </motion.button>
        
        <p className="text-sm text-gray-500 text-center mt-4">
          Think you can beat {username}? Give it a try!
        </p>
      </motion.div>
    </div>
  );
};

export default InviteScreen;