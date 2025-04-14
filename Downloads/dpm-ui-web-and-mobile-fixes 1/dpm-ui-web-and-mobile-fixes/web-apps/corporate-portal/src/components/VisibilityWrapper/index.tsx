import { useRef, useEffect, useState, cloneElement, FC, ReactElement } from 'react';

interface VisibilityWrapperProps {
  children: ReactElement,
  isParallex?: boolean,
}

export const VisibilityWrapper: FC<VisibilityWrapperProps> = ({ children, isParallex }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(val => val ? val : isParallex ? entry.isIntersecting : false);
      },
      {
        root: null, // viewport
        rootMargin: '0px', // no margin
        threshold: 0.1, // 50% of target visible
      }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    // Clean up the observer
    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [isParallex]);

  return (
    <div ref={targetRef} data-testid="visiblityWrapper">
      {cloneElement(children, { isVisible })}
    </div>
  );
};

export default VisibilityWrapper;
