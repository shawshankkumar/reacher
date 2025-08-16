import React, { ReactNode } from 'react';

interface MobileFrameProps {
  children: ReactNode;
}

const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob top-0 left-1/4"></div>
      <div className="absolute w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 top-1/3 right-1/4"></div>
      <div className="absolute w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 bottom-1/4 left-1/3"></div>
      
      {/* Mobile frame */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 min-h-[80vh] max-h-[90vh] flex flex-col">
        {/* Notch */}
        <div className="w-full h-6 bg-gray-800 flex justify-center items-center">
          <div className="w-32 h-4 bg-black rounded-b-xl"></div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
        
        {/* Home button/indicator */}
        <div className="w-full h-1 bg-gray-300 my-2"></div>
      </div>
    </div>
  );
};

export default MobileFrame;