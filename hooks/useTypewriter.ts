import { useState, useEffect } from 'react';

export function useTypewriter(code: string, speed = 5) {
  const [displayCode, setDisplayCode] = useState(code);

  useEffect(() => {
    // 1. If code is empty or null, reset immediate
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
          // Add 5 chars at a time for snappy typing
          setDisplayCode(prev => prev + code.slice(i, i + 5)); 
          i += 5;
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

  // FIX: We return the string directly. 
  // The previous version returned { displayedText, isTyping } which caused your error.
  return displayCode;
}
