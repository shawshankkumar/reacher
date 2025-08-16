import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { createSession } from '../api';

interface LoadingScreenProps {
  onSessionCreated?: (sessionId: string, points: number) => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onSessionCreated }) => {
  useEffect(() => {
    const initSession = async () => {
      try {
        const sessionData = await createSession();
        if (onSessionCreated) {
          onSessionCreated(sessionData.session_id, sessionData.points);
        }
      } catch (error) {
        // Simplified error handling
        console.error('Failed to initialize session');
      }
    };
    
    initSession();
  }, [onSessionCreated]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 2
        }}
        className="mb-6"
      >
        <div className="bg-blue-100 p-4 rounded-full">
          <MapPin className="text-blue-600" size={40} />
        </div>
      </motion.div>
      
      <h1 className="text-2xl font-bold text-center mb-2">City Quiz</h1>
      <p className="text-gray-600 text-center mb-6">Loading your quiz experience...</p>
      
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            repeat: Infinity,
            duration: 1.5,
            ease: "linear"
          }}
          className="h-full bg-blue-500 rounded-full"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;