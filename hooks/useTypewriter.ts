import { useState, useEffect, useRef } from 'react';

export function useTypewriter(code: string, speed = 10) {
  const [displayedCode, setDisplayedCode] = useState(code);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousCode = useRef(code);

  useEffect(() => {
    // Calculate the difference between the new code and the previous code
    const diff = Math.abs(code.length - previousCode.current.length);
    previousCode.current = code;

    // 1. If code is empty, reset immediately
    if (!code) {
      setDisplayedCode('');
      setIsAnimating(false);
      return;
    }

    // 2. Only trigger animation if the change is LARGE (> 10 chars)
    // This detects "AI Generation" vs "Manual Typing"
    if (diff > 10) {
      setIsAnimating(true);
      setDisplayedCode('');
      
      let i = 0;
      const timer = setInterval(() => {
        if (i < code.length) {
          setDisplayedCode(prev => prev + code.slice(i, i + 3)); 
          i += 3;
        } else {
          setDisplayedCode(code);
          setIsAnimating(false);
          clearInterval(timer);
        }
      }, speed);

      return () => clearInterval(timer);
    } else {
      // 3. Manual Edit: Sync state immediately and stop animating
      setDisplayedCode(code);
      setIsAnimating(false);
    }
  }, [code, speed]);

  // CRITICAL FIX: 
  // If we are NOT animating (manual edit), return the raw 'code' directly.
  // This bypasses the React state delay and fixes the cursor jumping issue.
  return isAnimating ? displayedCode : code;
}
