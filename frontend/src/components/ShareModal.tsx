import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { createInvite } from '../api';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare?: (username: string, inviteLink: string) => void;
  shareLink?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onShare, shareLink }) => {
  const [username, setUsername] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | undefined>(shareLink);
  const inputRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen && !generatedLink && inputRef.current) {
      inputRef.current.focus();
    }
    
    if (isOpen && generatedLink && linkRef.current) {
      linkRef.current.focus();
    }
    
    setGeneratedLink(shareLink);
  }, [isOpen, shareLink]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      try {
        setIsLoading(true);
        const inviteData = await createInvite(username.trim());
        setGeneratedLink(inviteData.invite_link);
        if (onShare) {
          onShare(username.trim(), inviteData.invite_link);
        }
      } catch (error) {
        console.error('Error creating invite:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl w-full max-w-md shadow-xl"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Share Your Score</h2>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {!generatedLink ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <img 
                      src="https://billboard.srmkzilla.net/api/blog?title=Test%20your%20geography%20skills!&subtitle=Invite%20to%20Reacher&fileType=jpeg&fontSize=180px&subtitleFontSize=80px" 
                      alt="Reacher Invite" 
                      className="w-full h-auto rounded-lg shadow-md mb-4"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Enter your name
                    </label>
                    <input
                      ref={inputRef}
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      'Generate Share Link'
                    )}
                  </button>
                </form>
              ) : (
                <div>
                  <div className="mb-6">
                    <img 
                      src="https://billboard.srmkzilla.net/api/blog?title=Test%20your%20geography%20skills!&subtitle=Invite%20to%20Reacher&fileType=jpeg&fontSize=180px&subtitleFontSize=80px" 
                      alt="Reacher Invite" 
                      className="w-full h-auto rounded-lg shadow-md mb-4"
                    />
                  </div>
                  <p className="text-gray-600 mb-3">
                    Copy this link to share your score with friends:
                  </p>
                  
                  <div className="flex mb-6">
                    <input
                      ref={linkRef}
                      type="text"
                      value={generatedLink}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
                    />
                    <button
                      onClick={handleCopy}
                      className={`px-4 py-2 flex items-center justify-center rounded-r-lg ${
                        copied ? 'bg-green-600' : 'bg-blue-600'
                      } text-white`}
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 text-center">
                    When someone opens this link, they'll see your score and can try to beat it!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;