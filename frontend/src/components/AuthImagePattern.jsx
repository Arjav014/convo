import React, { useState, useEffect } from 'react';

const AuthImagePattern = ({ title, subtitle }) => {
  const [hoveredTile, setHoveredTile] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // Colors for the grid tiles
  const colors = [
    'bg-primary/70', 
    'bg-secondary/30', 
    'bg-accent/30', 
    'bg-secondary/50'
  ];
  
  // Update animation phase every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12 overflow-hidden relative">
      <div className="max-w-md text-center relative z-10">
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[...Array(9)].map((_, i) => {
            // Calculate which tiles should be animated based on current phase
            const shouldAnimate = [
              [0, 2, 4, 6, 8], // X pattern
              [0, 1, 2, 3, 4, 5, 6, 7, 8], // All tiles
              [1, 3, 5, 7], // Checkerboard inverse
              [0, 4, 8], // Diagonal
            ][animationPhase].includes(i);
            
            return (
              <div
                key={i}
                className={`
                  aspect-square rounded-2xl ${colors[i % colors.length]}
                  ${shouldAnimate ? "animate-pulse" : ""}
                  ${hoveredTile === i ? "scale-110 shadow-lg" : ""}
                  transform transition-all duration-300 cursor-pointer
                  hover:shadow-xl hover:border hover:border-white/10
                `}
                onMouseEnter={() => setHoveredTile(i)}
                onMouseLeave={() => setHoveredTile(null)}
                onClick={() => {
                  // Create a ripple effect by causing all tiles to animate briefly
                  setAnimationPhase((prev) => (prev + 1) % 4);
                }}
              />
            );
          })}
        </div>
        
        <h2 className="text-2xl font-bold mb-4 bg-linear-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">{title}</h2>
        <p className="text-base-content/70 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;