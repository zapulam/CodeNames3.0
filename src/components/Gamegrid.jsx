import React, { useState } from "react";

export function GameGrid({ words, revealed, roles, onReveal, codemasterMode }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleCardClick = (index) => {
    console.log(`=== CARD CLICK DEBUG ===`);
    console.log(`Index: ${index}`);
    console.log(`Word: ${words[index]}`);
    console.log(`Role: ${roles[index]}`);
    console.log(`Already revealed: ${revealed[index]}`);
    console.log(`Codemaster mode: ${codemasterMode}`);
    console.log(`onReveal function exists:`, typeof onReveal === 'function');
    
    if (typeof onReveal === 'function') {
      onReveal(index);
      console.log(`Called onReveal(${index})`);
    } else {
      console.error('onReveal is not a function!');
    }
  };

  const getCardStyle = (role, isRevealed, index) => {
    // Base button style - minHeight and fontSize overridden by className for responsive
    let buttonStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '12px',
      width: '100%',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: '2px solid',
    };

    // In codemaster mode, show all colors
    if (codemasterMode) {
      switch (role) {
        case "green":
          return { ...buttonStyle, backgroundColor: '#22c55e', color: 'white', borderColor: '#16a34a' };
        case "blue":
          return { ...buttonStyle, backgroundColor: '#3b82f6', color: 'white', borderColor: '#2563eb' };
        case "neutral":
          return { ...buttonStyle, backgroundColor: '#9ca3af', color: 'white', borderColor: '#6b7280' };
        case "assassin":
          return { ...buttonStyle, backgroundColor: '#000000', color: 'white', borderColor: '#374151' };
        default:
          return { ...buttonStyle, backgroundColor: '#fef3c7', color: '#1f2937', borderColor: '#fde68a' };
      }
    }
    
    // Not revealed - show yellow
    if (!isRevealed) {
      const isHovered = hoveredIndex === index;
      return { 
        ...buttonStyle, 
        backgroundColor: isHovered ? '#fde68a' : '#fef3c7', 
        color: '#1f2937', 
        borderColor: '#fde68a',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
      };
    }
    
    // Revealed - show team color
    switch (role) {
      case "green":
        return { ...buttonStyle, backgroundColor: '#22c55e', color: 'white', borderColor: '#16a34a' };
      case "blue":
        return { ...buttonStyle, backgroundColor: '#3b82f6', color: 'white', borderColor: '#2563eb' };
      case "neutral":
        return { ...buttonStyle, backgroundColor: '#9ca3af', color: 'white', borderColor: '#6b7280' };
      case "assassin":
        return { ...buttonStyle, backgroundColor: '#000000', color: 'white', borderColor: '#374151' };
      default:
        return { ...buttonStyle, backgroundColor: '#fef3c7', color: '#1f2937', borderColor: '#fde68a' };
    }
  };

  const handleMouseEnter = (index) => {
    if (!revealed[index] && !codemasterMode) {
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  console.log('GameGrid render:', { 
    wordsLength: words.length, 
    revealedLength: revealed.length, 
    rolesLength: roles.length, 
    codemasterMode,
    onRevealType: typeof onReveal
  });

  if (!words || words.length === 0) {
    return <div>No words to display</div>;
  }

  return (
    <div className="grid grid-cols-5 gap-2 md:gap-4 w-full mx-auto p-2 md:p-4">
      {words.map((word, idx) => {
        const isRevealed = revealed[idx];
        const cardRole = roles[idx];
        
        return (
          <button
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log(`Button ${idx} clicked directly!`);
              handleCardClick(idx);
            }}
            style={getCardStyle(cardRole, isRevealed, idx)}
            className="min-h-14 md:min-h-20 text-xs md:text-base font-medium md:font-bold tracking-tight md:tracking-normal"
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-center" style={{ lineHeight: '1.2' }}>
              {word}
            </span>
          </button>
        );
      })}
    </div>
  );
}