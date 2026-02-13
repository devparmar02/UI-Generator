import { useState, useEffect } from 'react';

export function useTypewriter(code: string, speed = 15) {
  const [displayCode, setDisplayCode] = useState(code);

  useEffect(() => {
    // 1. If code is empty, reset immediately
    if (!code) {
      setDisplayCode('');
      return;
    }

    // 2. Only animate if the code changed significantly (likely AI generation)
    // If the difference is small (< 10 chars), it's a manual edit -> show instantly.
    if (Math.abs(code.length - displayCode.length) > 10) {
      setDisplayCode(''); // Clear current text to start typing effect
      
      let i = 0;
      const timer = setInterval(() => {
        if (i < code.length) {
          // EDIT: Changed from 5 to 2 characters at a time for smoother, slower typing
          setDisplayCode(prev => prev + code.slice(i, i + 2)); 
          i += 2;
        } else {
          setDisplayCode(code); // Ensure it finishes cleanly
          clearInterval(timer);
        }
      }, speed);

      return () => clearInterval(timer);
    } else {
      // 3. Immediate update for manual edits (no animation)
      setDisplayCode(code);
    }
  }, [code, speed]);

  return displayCode;
}
