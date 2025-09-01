import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GameGrid } from "./components/Gamegrid";
import {
  PlusCircle,
  Eye,
  EyeOff,
  MessageCircleQuestion,
} from "lucide-react";

export default function CodeNames() {
  const [wordPool, setWordPool] = useState([]); // All available words
  const [gameWords, setGameWords] = useState([]); // 25 words for current game
  const [roles, setRoles] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [codemasterMode, setCodemasterMode] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('red'); // 'red' or 'blue'
  const [winner, setWinner] = useState(null); // 'red' | 'blue' | null
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Load words from words.txt
  useEffect(() => {
    const loadWords = async () => {
      try {
        const response = await fetch('/src/data/words.txt');
        if (!response.ok) {
          throw new Error('Failed to load words file');
        }
        const text = await response.text();
        const wordList = text.split('\n')
          .map(word => word.trim())
          .filter(word => word.length > 0);
        setWordPool(wordList);
      } catch (error) {
        console.error('Error loading words:', error);
        alert('Failed to load words. Please check that the words.txt file exists in the data folder.');
      }
    };

    loadWords();
  }, []);

  // Initialize new game
  const startNewGame = () => {
    console.log('Starting new game...');
    console.log('Word pool length:', wordPool.length);
    
    if (wordPool.length < 25) {
      console.error('Not enough words available');
      return;
    }
    
    // Shuffle words and take first 25
    const shuffledWords = [...wordPool].sort(() => Math.random() - 0.5).slice(0, 25);
    console.log('Selected game words:', shuffledWords);
    setGameWords(shuffledWords);
    
    // Create roles: 9 red, 8 blue, 7 neutral, 1 assassin
    const newRoles = [];
    for (let i = 0; i < 9; i++) newRoles.push('red');
    for (let i = 0; i < 8; i++) newRoles.push('blue');
    for (let i = 0; i < 7; i++) newRoles.push('neutral');
    newRoles.push('assassin');
    
    // Shuffle roles
    const shuffledRoles = newRoles.sort(() => Math.random() - 0.5);
    console.log('Game roles:', shuffledRoles);
    
    setRoles(shuffledRoles);
    setRevealed(new Array(25).fill(false));
    setCodemasterMode(false);
    setGameStarted(true);
    setCurrentTurn('red');
    setWinner(null);
    
    console.log('Game initialized successfully');
  };

  // Show confirmation before starting a new game if one is in progress
  const confirmAndStartNewGame = () => {
    if (gameStarted) {
      setShowNewGameConfirm(true);
    } else {
      startNewGame();
    }
  };

  // Handle card reveal
  const handleReveal = (index) => {
    console.log(`handleReveal called for index ${index}`);
    console.log(`Current revealed state:`, revealed);
    console.log(`Card role: ${roles[index]}, Already revealed: ${revealed[index]}, Codemaster mode: ${codemasterMode}`);
    console.log(`Game words:`, gameWords);
    console.log(`Roles:`, roles);
    
    if (revealed[index]) {
      console.log('Card already revealed, returning');
      return;
    }
    
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    console.log(`Setting revealed[${index}] = true`);
    console.log(`New revealed state:`, newRevealed);
    
    setRevealed(newRevealed);
    
    // Check if assassin was revealed
    if (roles[index] === 'assassin') {
      console.log('Assassin revealed! Game over!');
      setWinner('red'); // Assuming red team loses
      setGameStarted(false);
      return;
    }
    
    console.log(`Card role: ${roles[index]}, Current turn: ${currentTurn}`);
    
    // Check if current team's turn should continue
    if (roles[index] !== currentTurn) {
      const newTurn = currentTurn === 'red' ? 'blue' : 'red';
      console.log(`Switching turn from ${currentTurn} to ${newTurn}`);
      setCurrentTurn(newTurn);
    } else {
      console.log(`Correct team card revealed, turn continues for ${currentTurn} team`);
    }
    
    // Check for win conditions with updated revealed state
    const redRevealed = roles.map((role, idx) => role === 'red' && newRevealed[idx]).filter(Boolean).length;
    const blueRevealed = roles.map((role, idx) => role === 'blue' && newRevealed[idx]).filter(Boolean).length;
    
    if (redRevealed === 9) {
      setWinner('red');
    } else if (blueRevealed === 8) {
      setWinner('blue');
    }
  };

  // Check if a team has won
  const checkWinCondition = () => {
    const redRevealed = roles.map((role, index) => role === 'red' && revealed[index]).filter(Boolean).length;
    const blueRevealed = roles.map((role, index) => role === 'blue' && revealed[index]).filter(Boolean).length;
    
    if (redRevealed === 9) {
      setWinner('red');
    } else if (blueRevealed === 8) {
      setWinner('blue');
    }
  };

  // Toggle codemaster mode
  const toggleCodemasterMode = () => {
    setCodemasterMode(!codemasterMode);
  };

  // Get game statistics
  const getGameStats = () => {
    const redRevealed = roles.map((role, index) => role === 'red' && revealed[index]).filter(Boolean).length;
    const blueRevealed = roles.map((role, index) => role === 'blue' && revealed[index]).filter(Boolean).length;
    const neutralRevealed = roles.map((role, index) => role === 'neutral' && revealed[index]).filter(Boolean).length;
    
    return { redRevealed, blueRevealed, neutralRevealed };
  };

  const stats = getGameStats();

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex flex-col flex-1 h-full overflow-hidden">        
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Win Modal */}
          {winner && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWinner(null)}
            >
              <motion.div
                className="bg-slate-800 p-8 rounded-xl text-white w-11/12 max-w-md shadow-2xl border border-slate-600 flex flex-col items-center"
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-3xl font-bold mb-4">
                  {winner === 'red' ? 'Red Team Wins! 🎉' : 'Blue Team Wins! 🎉'}
                </h2>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => { setWinner(null); confirmAndStartNewGame(); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer transition-colors"
                  >
                    Start New Game
                  </button>
                  <button
                    onClick={() => setWinner(null)}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer transition-colors"
                  >
                    View Board
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Help Modal */}
          {isHelpOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHelpOpen(false)}
            >
              <motion.div
                className="bg-slate-800 p-6 rounded-xl text-white w-11/12 max-w-md shadow-2xl border border-slate-600"
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">
                  How to Play CodeNames
                </h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>
                    <strong>Objective:</strong> Find all your team's words first.
                  </p>
                  <p>
                    <strong>Red Team:</strong> 9 words
                  </p>
                  <p>
                    <strong>Blue Team:</strong> 8 words
                  </p>
                  <p>
                    <strong>Neutral:</strong> 7 words
                  </p>
                  <p>
                    <strong>Assassin:</strong> 1 word (instant loss)
                  </p>
                  <p>
                    <strong>Codemaster View:</strong> Sees everything.
                  </p>
                  <p>
                    <strong>Player View:</strong> Sees only revealed words.
                  </p>
                </div>
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setIsHelpOpen(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold cursor-pointer transition-colors"
                  >
                    Got it!
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* New Game Confirmation Modal */}
          {showNewGameConfirm && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewGameConfirm(false)}
            >
              <motion.div
                className="bg-slate-800 p-8 rounded-xl text-white w-11/12 max-w-md shadow-2xl border border-slate-600 flex flex-col items-center"
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Start New Game?
                </h2>
                <p className="text-slate-300 text-center mb-6">
                  A game is already in progress. Starting a new game will overwrite the current one.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => { setShowNewGameConfirm(false); startNewGame(); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer transition-colors"
                  >
                    Start New Game
                  </button>
                  <button
                    onClick={() => setShowNewGameConfirm(false)}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
          {!gameStarted ? (
            <div className="flex flex-col items-center justify-center flex-1 relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative text-center bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 max-w-2xl mx-4"
              >
                {/* Logo/Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
                  className="mb-8"
                >
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-6xl font-bold bg-clip-text mb-6 tracking-tight"
                >
                  CodeNames
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-xl text-gray-700 mb-8 font-medium"
                >
                  The ultimate word association game for teams
                </motion.p>

                {/* Game description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mb-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Red Team: 9 words</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Blue Team: 8 words</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span>Neutral: 7 words</span>
                    </div>
                  </div>
                </motion.div>

                {/* Word count */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="mb-8"
                >
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-full border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">
                      {wordPool.length} words loaded and ready
                    </span>
                  </div>
                </motion.div>

                {/* Start button */}
                <motion.button
                  onClick={confirmAndStartNewGame}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                    Start New Game
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </motion.button>

                {/* Footer text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="text-xs text-gray-500 mt-6"
                >
                  Use the header buttons to toggle codemaster view and access game controls
                </motion.p>
              </motion.div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="mb-2 bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg relative">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    CodeNames
                  </h2>
                  
                  {/* Game Progress - Centered */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-semibold">Red: {stats.redRevealed}/9</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-semibold">Blue: {stats.blueRevealed}/8</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="font-semibold">Neutral: {stats.neutralRevealed}/7</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={confirmAndStartNewGame}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors w-32 justify-center cursor-pointer"
                    >
                      <PlusCircle size={14} />
                      New Game
                    </button>
                    <button
                      onClick={toggleCodemasterMode}
                      className="flex items-center gap-1 bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors w-32 justify-center cursor-pointer"
                    >
                      {codemasterMode ? <EyeOff size={14} /> : <Eye size={14} />}
                      {codemasterMode ? 'Player' : 'Codemaster'}
                    </button>
                    <button
                      onClick={() => setIsHelpOpen(true)}
                      className="p-1 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors w-8 h-8 flex items-center justify-center"
                    >
                      <MessageCircleQuestion size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 flex items-center justify-center overflow-hidden p-2">
                <GameGrid
                  words={gameWords}
                  revealed={revealed}
                  roles={roles}
                  onReveal={handleReveal}
                  codemasterMode={codemasterMode}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}