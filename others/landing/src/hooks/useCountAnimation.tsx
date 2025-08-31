
import { useState, useEffect } from 'react';

interface UseCountAnimationProps {
  end: number;
  start?: number;
  duration?: number;
  isTriggered: boolean;
}

export const useCountAnimation = ({ 
  end, 
  start = 0, 
  duration = 2000, 
  isTriggered 
}: UseCountAnimationProps) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (isTriggered) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentCount = Math.floor(progress * (end - start) + start);
        
        setCount(currentCount);
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };

      window.requestAnimationFrame(step);
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [isTriggered, end, start, duration]);

  return count;
};
