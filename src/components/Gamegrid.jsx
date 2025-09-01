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
    // Base button style
    let buttonStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      fontWeight: 'bold',
      padding: '12px',
      width: '100%',
      minHeight: '80px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: '2px solid',
      fontSize: '18px'
    };

    // In codemaster mode, show all colors
    if (codemasterMode) {
      switch (role) {
        case "red":
          return { ...buttonStyle, backgroundColor: '#ef4444', color: 'white', borderColor: '#dc2626' };
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
      case "red":
        return { ...buttonStyle, backgroundColor: '#ef4444', color: 'white', borderColor: '#dc2626' };
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
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '16px',
      width: '100%',
      height: '100%',
      maxWidth: '1152px',
      margin: '0 auto',
      padding: '16px'
    }}>
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
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
          >
            <span style={{
              textAlign: 'center',
              lineHeight: '1.2',
              fontWeight: 'bold'
            }}>
              {word}
            </span>
          </button>
        );
      })}
    </div>
  );
}