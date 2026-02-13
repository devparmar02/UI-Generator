import { useState, useEffect } from 'react';

export function useTypewriter(code: string, speed = 10) {
  const [displayCode, setDisplayCode] = useState(code);

  useEffect(() => {
    // Only animate if the code changed significantly (new AI generation)
    if (Math.abs(code.length - displayCode.length) > 10) {
      let i = 0;
      setDisplayCode(''); 
      
      const timer = setInterval(() => {
        if (i < code.length) {
          setDisplayCode(prev => prev + code.slice(i, i + 3)); 
          i += 3;
        } else {
          setDisplayCode(code);
          clearInterval(timer);
        }
      }, speed);

      return () => clearInterval(timer);
    } else {
      // Immediate update for manual edits
      setDisplayCode(code);
    }
  }, [code, speed]);

  // FIX: Return the string directly, not an object
  return displayCode;
}
