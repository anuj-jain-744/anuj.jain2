import { useEffect, useRef } from 'react';

interface IdleTimeoutProps {
  timeout?: number; // Timeout in seconds
  onTimeout: () => void; // Callback when timeout occurs
}

const IdleTimeout = ({ timeout = 1800, onTimeout }:IdleTimeoutProps) => {
  const timerId = useRef(null);

  // Reset the timer
  const resetTimer = () => {
    if (timerId.current) clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      onTimeout();
    }, timeout * 1000);
  };

  useEffect(() => {
    // List of events to consider as user activity
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

    // Reset timer on any of these events
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Start the timer
    resetTimer();

    // Cleanup event listeners on unmount
    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timerId.current) clearTimeout(timerId.current);
    };
  }, [timeout]);

  return null; // This component doesn't render anything
}

export default IdleTimeout;