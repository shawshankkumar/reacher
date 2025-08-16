import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { getSessionInfo } from './api';
import { GameState } from './types';
import MobileFrame from './components/MobileFrame';
import QuizGame from './components/QuizGame';
import GameOver from './components/GameOver';
import ShareModal from './components/ShareModal';
import LoadingScreen from './components/LoadingScreen';
import InviteScreen from './components/InviteScreen';

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameContainer />} />
        <Route path="/invite/:inviteId" element={<InviteContainer />} />
      </Routes>
    </Router>
  );
}

// Game Container Component
const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    sessionId: null,
    points: 0,
    currentQuestion: null,
    isGameOver: false,
    username: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    const initGame = async () => {
      try {
        // Check if we have a session in localStorage
        const sessionId = localStorage.getItem('session_id');
        
        if (sessionId) {
          try {
            const sessionInfo = await getSessionInfo();
            setGameState(prev => ({
              ...prev,
              sessionId,
              points: sessionInfo.points
            }));
            setIsLoading(false);
          } catch (error) {
            console.error('Error getting session info:', error);
            setIsLoading(false);
          }
        } else {
          // LoadingScreen will create a new session
          setIsLoading(true);
        }
      } catch (error) {
        console.error('Error initializing game:', error);
        setIsLoading(false);
      }
    };
    
    initGame();
  }, []);
  
  const handleSessionCreated = (sessionId: string, points: number) => {
    setGameState(prev => ({
      ...prev,
      sessionId,
      points
    }));
    setIsLoading(false);
  };
  
  const handleGameComplete = (score: number) => {
    setGameState(prev => ({
      ...prev,
      points: score,
      isGameOver: true
    }));
  };
  
  const handleRestart = () => {
    setGameState(prev => ({
      ...prev,
      isGameOver: false
    }));
    setShareLink(undefined);
  };
  
  const handleOpenShareModal = () => {
    setShowShareModal(true);
  };
  
  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };
  
  const handleShare = (username: string, inviteLink: string) => {
    setShareLink(inviteLink);
    setGameState(prev => ({
      ...prev,
      username
    }));
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <LoadingScreen onSessionCreated={handleSessionCreated} />;
    }
    
    if (gameState.isGameOver) {
      return (
        <GameOver 
          score={gameState.points} 
          onRestart={handleRestart} 
          onShare={handleOpenShareModal} 
        />
      );
    }
    
    return (
      <QuizGame 
        onGameComplete={handleGameComplete} 
        onShare={handleOpenShareModal}
        points={gameState.points}
      />
    );
  };
  
  return (
    <MobileFrame>
      {renderContent()}
      <ShareModal 
        isOpen={showShareModal} 
        onClose={handleCloseShareModal} 
        onShare={handleShare}
        shareLink={shareLink}
      />
    </MobileFrame>
  );
};

// Invite Container Component
const InviteContainer: React.FC = () => {
  const { inviteId } = useParams<{ inviteId: string }>();
  const navigate = useNavigate();
  
  const handleStartGame = () => {
    navigate('/');
  };
  
  if (!inviteId) {
    return (
      <MobileFrame>
        <div className="p-6 h-full flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-center mb-4">Invalid Invitation</h1>
          <p className="text-gray-600 text-center mb-6">
            The invitation link you're trying to access is invalid.
          </p>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium"
            onClick={handleStartGame}
          >
            Start New Game
          </button>
        </div>
      </MobileFrame>
    );
  }
  
  return (
    <MobileFrame>
      <InviteScreen 
        inviteId={inviteId}
        onStartGame={handleStartGame} 
      />
    </MobileFrame>
  );
};

export default App;