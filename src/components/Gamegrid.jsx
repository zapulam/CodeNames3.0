// File: src/components/GameGrid.jsx
import React, { useState } from "react";

export function GameGrid({ words, revealed, roles, onReveal, codemasterMode }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const getCardStyle = (role, isRevealed, index) => {
    console.log(`Getting style for card ${index}: role=${role}, revealed=${isRevealed}, codemaster=${codemasterMode}`);
    
    // Base styles - removed fixed height to make it dynamic
    let baseStyles = "flex items-center justify-center rounded-lg shadow-lg font-bold p-3 w-full transition-all duration-300";
    
    // In codemaster mode, show all colors
    if (codemasterMode) {
      switch (role) {
        case "red": return `${baseStyles} bg-red-500 text-white border-2 border-red-600 cursor-pointer`;
        case "blue": return `${baseStyles} bg-blue-500 text-white border-2 border-blue-600 cursor-pointer`;
        case "neutral": return `${baseStyles} bg-gray-400 text-white border-2 border-gray-500 cursor-pointer`;
        case "assassin": return `${baseStyles} bg-black text-white border-2 border-gray-800 cursor-pointer`;
        default: return `${baseStyles} bg-yellow-100 text-gray-800 border-2 border-yellow-300 cursor-pointer`;
      }
    }
    
    // Not revealed - show yellow
    if (!isRevealed) {
      const isHovered = hoveredIndex === index;
      return `${baseStyles} ${isHovered ? 'bg-yellow-200 scale-105' : 'bg-yellow-100'} text-gray-800 border-2 border-yellow-300 cursor-pointer`;
    }
    
    // Revealed - show team color
    switch (role) {
      case "red": return `${baseStyles} bg-red-500 text-white border-2 border-red-600 cursor-default`;
      case "blue": return `${baseStyles} bg-blue-500 text-white border-2 border-blue-600 cursor-default`;
      case "neutral": return `${baseStyles} bg-gray-400 text-white border-2 border-gray-500 cursor-default`;
      case "assassin": return `${baseStyles} bg-black text-white border-2 border-gray-800 cursor-default`;
      default: return `${baseStyles} bg-yellow-100 text-gray-800 border-2 border-yellow-300 cursor-pointer`;
    }
  };

  const getInlineStyle = (role, isRevealed) => {
    if (codemasterMode) {
      switch (role) {
        case "red": return { backgroundColor: '#ef4444', color: 'white', border: '2px solid #dc2626' };
        case "blue": return { backgroundColor: '#3b82f6', color: 'white', border: '2px solid #2563eb' };
        case "neutral": return { backgroundColor: '#9ca3af', color: 'white', border: '2px solid #6b7280' };
        case "assassin": return { backgroundColor: '#000000', color: 'white', border: '2px solid #374151' };
        default: return { backgroundColor: '#fef3c7', color: '#1f2937', border: '2px solid #fde68a' };
      }
    }
    
    if (!isRevealed) {
      return { backgroundColor: '#fef3c7', color: '#1f2937', border: '2px solid #fde68a' };
    }
    
    switch (role) {
      case "red": return { backgroundColor: '#ef4444', color: 'white', border: '2px solid #dc2626' };
      case "blue": return { backgroundColor: '#3b82f6', color: 'white', border: '2px solid #2563eb' };
      case "neutral": return { backgroundColor: '#9ca3af', color: 'white', border: '2px solid #6b7280' };
      case "assassin": return { backgroundColor: '#000000', color: 'white', border: '2px solid #374151' };
      default: return { backgroundColor: '#fef3c7', color: '#1f2937', border: '2px solid #fde68a' };
    }
  };

  const handleCardClick = (index) => {
    console.log(`Card ${index} clicked!`);
    onReveal(index);
  };

  const handleMouseEnter = (index) => {
    if (!revealed[index] && !codemasterMode) {
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  console.log('GameGrid render:', { words: words.length, revealed, roles: roles.length, codemasterMode });

  return (
    <div className="grid grid-cols-5 gap-4 w-full h-full max-w-6xl mx-auto p-4">
      {words.map((word, idx) => {
        const isRevealed = revealed[idx];
        const cardRole = roles[idx];
        
        return (
          <button
            key={idx}
            onClick={() => handleCardClick(idx)}
            disabled={isRevealed && !codemasterMode}
            className="flex items-center justify-center rounded-lg shadow-lg font-bold p-3 w-full transition-all duration-300 min-h-[80px] cursor-pointer"
            style={getInlineStyle(cardRole, isRevealed)}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-center leading-tight font-bold text-sm md:text-base lg:text-lg">
              {word}
            </span>
          </button>
        );
      })}
    </div>
  );
}
