
import React, { useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useCountAnimation } from '@/hooks/useCountAnimation';

interface AnimatedCounterProps {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  label, 
  prefix = '', 
  suffix = '', 
  duration = 2000 
}) => {
  const counterRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver({
    elementRef: counterRef,
    threshold: 0.1
  });
  
  const count = useCountAnimation({
    end: parseInt(value),
    start: 0,
    duration: duration,
    isTriggered: isVisible
  });

  return (
    <div className="text-center" ref={counterRef}>
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {prefix}{count}{suffix}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

export default AnimatedCounter;
