import { componentSchema } from '../ai/schema';

/**
 * 1. CLEANER: Surgically extracts code from markdown blocks.
 * Handles cases where the AI says "Here is the code:" before the block.
 */
export function cleanGeneratedCode(rawCode: string): string {
  // 1. Try to find a markdown block with jsx/tsx/javascript
  const match = rawCode.match(/```(?:jsx|tsx|javascript|js)?\s*([\s\S]*?)\s*```/);
  
  if (match && match[1]) {
    // Return just the code inside the backticks
    return match[1].trim();
  }

  // 2. Fallback: If no blocks found, return raw (but strip simple backticks if they exist)
  let cleaned = rawCode;
  cleaned = cleaned.replace(/^```(?:jsx|tsx|javascript)?\n/i, '');
  cleaned = cleaned.replace(/```$/i, '');
  
  return cleaned.trim();
}

/**
 * 2. VALIDATOR: Enforces the strict Component Whitelist.
 */
export function validateJSX(code: string): { isValid: boolean; error?: string } {
  const allowedComponents = componentSchema.map(c => c.name);
  
  // Also allow standard React Fragment short syntax
  allowedComponents.push(""); // matches <></> tags which parse as empty string in some regex logic

  const tagRegex = /<([A-Z][a-zA-Z0-9]*)/g;
  let match;

  while ((match = tagRegex.exec(code)) !== null) {
    const tagName = match[1];
    if (!allowedComponents.includes(tagName)) {
      return { 
        isValid: false, 
        error: `Security Check Failed: The AI attempted to use an unauthorized tag: <${tagName}>. Only ${allowedComponents.join(', ')} are allowed.`
      };
    }
  }

  // Basic check for HTML injections (match only lowercase raw HTML tags)
  if (code.match(/<(?:div|p|span|button|a|img|script)(?=\s|>|\/)/)) {
     return {
       isValid: false,
       error: `Security Check Failed: The AI attempted to use raw HTML tags (div, p, etc). Visual consistency must be maintained.`
     }
  }

  return { isValid: true };
}