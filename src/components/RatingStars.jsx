import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ initialScore = 0, onRate, readonly = false, label = "Rate Transporter" }) {
  const [score, setScore] = useState(initialScore);
  const [hoverScore, setHoverScore] = useState(0);

  const handleClick = (val) => {
    if (readonly) return;
    setScore(val);
    if (onRate) onRate(val);
  };

  return (
    <div className="flex flex-col space-y-1">
      {label && <span className="text-xs text-slate-500 font-medium">{label}</span>}
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((val) => {
          const isFilled = val <= (hoverScore || score);
          return (
            <button
              key={val}
              type="button"
              disabled={readonly}
              onClick={() => handleClick(val)}
              onMouseEnter={() => !readonly && setHoverScore(val)}
              onMouseLeave={() => !readonly && setHoverScore(0)}
              className={`p-1 transition-transform ${readonly ? 'cursor-default' : 'hover:scale-125 cursor-pointer'}`}
            >
              <Star
                className={`w-5 h-5 ${
                  isFilled ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
