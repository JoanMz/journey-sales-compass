
import { useEffect, useState, RefObject } from 'react';

interface UseIntersectionObserverProps {
  elementRef: RefObject<Element>;
  threshold?: number;
  rootMargin?: string;
}

export const useIntersectionObserver = ({
  elementRef,
  threshold = 0,
  rootMargin = "0px"
}: UseIntersectionObserverProps): boolean => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [elementRef, threshold, rootMargin]);

  return isVisible;
};
