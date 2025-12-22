"use client"

import { VisualGrid, VisualOption } from "@/types/quiz";

interface VisualQuestionProps {
  visualGrid?: VisualGrid;
  options: (string | VisualOption)[];
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
  disabled: boolean;
}

// O componentă mică helper care randează forma geometrică
const ShapeRenderer = ({ 
  shape, 
  fill, 
  rotation = 0,
  className = "" 
}: { 
  shape: string; 
  fill: boolean; 
  rotation?: number;
  className?: string;
}) => {
  // Stilul pentru rotație
  const style = { transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s' };
  const colorClass = "text-cyan-400"; // Culoarea formelor

  if (shape === 'Circle') {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" style={style} className={`${className} ${colorClass}`}>
        <circle 
          cx="20" cy="20" r="16" 
          fill={fill ? "currentColor" : "none"} 
          stroke="currentColor" 
          strokeWidth="3" 
        />
      </svg>
    );
  }

  if (shape === 'Square') {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" style={style} className={`${className} ${colorClass}`}>
        <rect 
          x="6" y="6" width="28" height="28" 
          fill={fill ? "currentColor" : "none"} 
          stroke="currentColor" 
          strokeWidth="3" 
        />
      </svg>
    );
  }

  if (shape === 'Triangle') {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" style={style} className={`${className} ${colorClass}`}>
        <polygon 
          points="20,4 36,34 4,34" 
          fill={fill ? "currentColor" : "none"} 
          stroke="currentColor" 
          strokeWidth="3" 
        />
      </svg>
    );
  }

  return null;
};

export default function VisualQuestion({ 
  visualGrid, 
  options, 
  selectedAnswer, 
  onAnswerSelect, 
  disabled 
}: VisualQuestionProps) {
  
  return (
    <div className="w-full animate-in fade-in duration-500">
      
      {/* 1. GRILA 3x3 (MATRICEA) */}
      {visualGrid && (
        <div className="mb-8 flex justify-center">
          <div className="grid grid-cols-3 gap-2 md:gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            {visualGrid.cells.map((cell, idx) => (
              <div 
                key={idx}
                className={`
                  w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-lg border-2
                  ${cell 
                    ? "bg-slate-900 border-slate-600" 
                    : "bg-slate-800/30 border-dashed border-cyan-500/50 relative overflow-hidden" // Celula cu semnul întrebării
                  }
                `}
              >
                {cell ? (
                  <ShapeRenderer 
                    shape={cell.shape} 
                    fill={!!cell.fill} 
                    rotation={cell.rotation} 
                  />
                ) : (
                  <span className="text-3xl font-bold text-cyan-500/50 animate-pulse">?</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. VARIANTELE DE RĂSPUNS */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => {
          // Verificăm dacă opțiunea este text simplu sau obiect vizual
          const isVisual = typeof option !== 'string';
          
          return (
            <button
              key={index}
              onClick={() => onAnswerSelect(index)}
              disabled={disabled}
              className={`
                p-4 md:p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-3 relative
                ${selectedAnswer === index 
                  ? "border-cyan-500 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                  : "border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:-translate-y-1"}
              `}
            >
              {/* Eticheta A, B, C, D */}
              <span className="absolute top-2 left-3 text-xs font-mono text-slate-500">
                {String.fromCharCode(65 + index)}
              </span>

              {isVisual ? (
                // Dacă e vizual, randăm forma
                <div className="transform scale-125">
                  <ShapeRenderer 
                    shape={option.shape || 'Circle'} 
                    fill={!!option.fill} 
                    rotation={option.rotation} 
                  />
                </div>
              ) : (
                // Dacă e text, randăm textul
                <span className="text-lg text-slate-200 font-medium">{option}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}


