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
  const [currentTurn, setCurrentTurn] = useState('green'); // 'green' or 'blue'
  const [winner, setWinner] = useState(null); // 'green' | 'blue' | 'assassin' | null
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
    
    // Create roles: 9 green, 8 blue, 7 neutral, 1 assassin
    const newRoles = [];
    for (let i = 0; i < 9; i++) newRoles.push('green');
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
    setCurrentTurn('green');
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
    
    if (winner) {
      console.log('Game already ended, ignoring reveal');
      return;
    }
    
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
      setWinner('assassin');
      return;
    }
    
    console.log(`Card role: ${roles[index]}, Current turn: ${currentTurn}`);
    
    // Check if current team's turn should continue
    if (roles[index] !== currentTurn) {
      const newTurn = currentTurn === 'green' ? 'blue' : 'green';
      console.log(`Switching turn from ${currentTurn} to ${newTurn}`);
      setCurrentTurn(newTurn);
    } else {
      console.log(`Correct team card revealed, turn continues for ${currentTurn} team`);
    }
    
    // Check for win conditions with updated revealed state
    const greenRevealed = roles.map((role, idx) => role === 'green' && newRevealed[idx]).filter(Boolean).length;
    const blueRevealed = roles.map((role, idx) => role === 'blue' && newRevealed[idx]).filter(Boolean).length;
    
    if (greenRevealed === 9) {
      setWinner('green');
    } else if (blueRevealed === 8) {
      setWinner('blue');
    }
  };

  // Check if a team has won
  const checkWinCondition = () => {
    const greenRevealed = roles.map((role, index) => role === 'green' && revealed[index]).filter(Boolean).length;
    const blueRevealed = roles.map((role, index) => role === 'blue' && revealed[index]).filter(Boolean).length;
    
    if (greenRevealed === 9) {
      setWinner('green');
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
    const greenRevealed = roles.map((role, index) => role === 'green' && revealed[index]).filter(Boolean).length;
    const blueRevealed = roles.map((role, index) => role === 'blue' && revealed[index]).filter(Boolean).length;
    const neutralRevealed = roles.map((role, index) => role === 'neutral' && revealed[index]).filter(Boolean).length;
    
    return { greenRevealed, blueRevealed, neutralRevealed };
  };

  const stats = getGameStats();

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex flex-col flex-1 h-full overflow-hidden">        
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Win Modal */}
          {winner && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWinner(null)}
            >
              <motion.div
                className="bg-gray-900/95 backdrop-blur-xl p-8 rounded-3xl text-gray-100 w-11/12 max-w-md shadow-2xl border border-gray-700/50 flex flex-col items-center"
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {winner === 'assassin' ? 'You lose!' : (winner === 'green' ? 'Green Team Wins!' : 'Blue Team Wins!')}
                  </h2>
                  <div className="text-6xl mb-4">{winner === 'assassin' ? '💀' : '🎉'}</div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => {
                      if (winner === 'assassin') {
                        startNewGame();
                      } else {
                        setWinner(null);
                        confirmAndStartNewGame();
                      }
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    Start New Game
                  </button>
                  <button
                    onClick={() => setWinner(null)}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
              className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHelpOpen(false)}
            >
              <motion.div
                className="bg-gray-900/95 backdrop-blur-xl p-8 text-gray-100 w-11/12 max-w-md shadow-2xl border border-gray-700/50"
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  How to Play CodeNames
                </h3>
                <div className="space-y-4 text-sm text-gray-300">
                  <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 p-4 rounded-xl border border-blue-700/50">
                    <p className="font-semibold text-blue-200 mb-2">Objective:</p>
                    <p>Find all your team's words first.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 p-3 rounded-xl border border-green-700/50">
                      <p className="font-semibold text-green-200">Green Team:</p>
                      <p className="text-green-300">9 words</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 p-3 rounded-xl border border-blue-700/50">
                      <p className="font-semibold text-blue-200">Blue Team:</p>
                      <p className="text-blue-300">8 words</p>
                    </div>
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-3 rounded-xl border border-gray-600/50">
                      <p className="font-semibold text-gray-200">Neutral:</p>
                      <p className="text-gray-300">7 words</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 p-3 rounded-xl border border-purple-700/50">
                      <p className="font-semibold text-purple-200">Assassin:</p>
                      <p className="text-purple-300">1 word (instant loss)</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 p-4 rounded-xl border border-green-700/50">
                    <p className="font-semibold text-green-200 mb-2">Views:</p>
                    <p className="text-green-300"><strong>Codemaster View:</strong> Sees everything.</p>
                    <p className="text-green-300"><strong>Player View:</strong> Sees only revealed words.</p>
                  </div>
                </div>
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setIsHelpOpen(false)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
              className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewGameConfirm(false)}
            >
              <motion.div
                className="bg-gray-900/95 backdrop-blur-xl p-8 rounded-3xl text-gray-100 w-11/12 max-w-md shadow-2xl border border-gray-700/50 flex flex-col items-center"
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Start New Game?
                </h2>
                <p className="text-gray-300 text-center mb-8 text-lg">
                  A game is already in progress. Starting a new game will overwrite the current one.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => { setShowNewGameConfirm(false); startNewGame(); }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    Start New Game
                  </button>
                  <button
                    onClick={() => setShowNewGameConfirm(false)}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
          {!gameStarted ? (
            <div className="flex flex-col items-center justify-center flex-1 relative overflow-hidden bg-gray-900">
              {/* Background decorative elements */}
ui              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative text-center bg-gray-800/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-gray-700/50 max-w-2xl mx-4"
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
                  className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 tracking-tight animate-pulse"
                >
                  CodeNames
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-xl text-gray-300 mb-8 font-medium"
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2 bg-green-900/30 px-3 py-2 rounded-lg border border-green-700/30">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Green Team: 9 words</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-2 rounded-lg border border-blue-700/30">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Blue Team: 8 words</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-800/30 px-3 py-2 rounded-lg border border-gray-600/30">
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
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-900/30 to-blue-900/30 px-4 py-2 rounded-full border border-green-700/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-300">
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
                  className="text-xs text-gray-400 mt-6"
                >
                  Use the header buttons to toggle codemaster view and access game controls
                </motion.p>
              </motion.div>
            </div>
          ) : (
            <div className="flex flex-col h-full bg-gray-900 relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
              </div>
              <div className="mb-4 bg-gray-900/90 backdrop-blur-xl p-4 shadow-xl border border-gray-700/50 relative z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                    CodeNames
                  </h2>
                  
                  {/* Game Progress - Centered */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-green-900/50 to-green-800/50 px-4 py-2 rounded-full border border-green-700/50 shadow-sm">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-sm"></div>
                      <span className="font-semibold text-green-200">Green: {stats.greenRevealed}/9</span>
                    </div>
                    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-900/50 to-blue-800/50 px-4 py-2 rounded-full border border-blue-700/50 shadow-sm">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                      <span className="font-semibold text-blue-200">Blue: {stats.blueRevealed}/8</span>
                    </div>
                    <div className="flex items-center gap-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 px-4 py-2 rounded-full border border-gray-600/50 shadow-sm">
                      <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full shadow-sm"></div>
                      <span className="font-semibold text-gray-300">Neutral: {stats.neutralRevealed}/7</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={confirmAndStartNewGame}
                      title="Start New Game"
                      className="group relative p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-xl transition-all duration-200 w-10 h-10 flex items-center justify-center shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 border border-blue-600/30 hover:border-blue-500/50 cursor-pointer"
                    >
                      <PlusCircle size={18} />
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-gray-100 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-gray-700/50 shadow-lg">
                        Start New Game
                      </div>
                    </button>
                    <button
                      onClick={toggleCodemasterMode}
                      title={codemasterMode ? "Switch to Player View" : "Switch to Codemaster View"}
                      className="group relative p-2 text-green-400 hover:text-green-300 hover:bg-green-900/30 rounded-xl transition-all duration-200 w-10 h-10 flex items-center justify-center shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 border border-green-600/30 hover:border-green-500/50 cursor-pointer"
                    >
                      {codemasterMode ? <EyeOff size={18} /> : <Eye size={18} />}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-gray-100 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-gray-700/50 shadow-lg">
                        {codemasterMode ? "Switch to Player View" : "Switch to Codemaster View"}
                      </div>
                    </button>
                    <button
                      onClick={() => setIsHelpOpen(true)}
                      className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/30 rounded-xl transition-all duration-200 w-10 h-10 flex items-center justify-center shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 border border-purple-600/30 hover:border-purple-500/50 cursor-pointer"
                    >
                      <MessageCircleQuestion size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 flex items-center justify-center overflow-hidden relative z-10">
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