import { useState, useEffect } from 'react';

export function useTypewriter(text: string, speed = 5) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // If text is empty or significantly different (new generation), start typing
    setDisplayedText('');
    setIsTyping(true);

    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  // If we are editing manually (small changes), strictly return the full text 
  // to prevent typing effect on every keystroke
  return { displayedText, isTyping };
}