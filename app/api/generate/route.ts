import { NextResponse } from 'next/server';
import { generateText } from 'ai'; 
import { createOpenAI } from '@ai-sdk/openai';
import { PLANNER_SYSTEM_PROMPT, GENERATOR_SYSTEM_PROMPT, EXPLAINER_SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { cleanGeneratedCode, validateJSX } from '@/lib/utils/validation';

// Setup Groq provider
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, currentCode } = await req.json();
    console.log("Request received. Prompt:", prompt);

    const plannerContext = `User Request: ${prompt}\nCurrent UI Code: ${currentCode || 'None'}`;
    
    // planner 
    const { text: planText } = await generateText({
      model: groq('llama-3.3-70b-versatile'), 
      system: PLANNER_SYSTEM_PROMPT + "\n\nCRITICAL: Output ONLY valid JSON. Do not use Markdown blocks.",
      prompt: plannerContext,
    });
    
    let plan;
    try {
      const cleanJson = planText.replace(/```json/g, '').replace(/```/g, '').trim();
      plan = JSON.parse(cleanJson);
      console.log("2. Planner finished:", plan);
    } catch (e) {
      console.error("Failed to parse Plan JSON. Using fallback.");
      plan = { 
        intent_summary: "User requested UI changes.", 
        components_used: ["Container"], 
        layout_strategy: "Standard Layout" 
      };
    }

    //GENERATOR
    const generatorContext = `UI Plan to follow: ${JSON.stringify(plan)}\nModify or create the UI.`;
    
    const { text: rawJSX } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: GENERATOR_SYSTEM_PROMPT,
      prompt: generatorContext,
    });
    console.log("Generator finished");

    
    let cleanedCode = cleanGeneratedCode(rawJSX);

    if (!cleanedCode.trim().startsWith('<>')) {
      cleanedCode = `<>\n${cleanedCode}\n</>`;
    }

    // Auto-fix common HTML tags and chart data patterns
    cleanedCode = cleanedCode
      .replace(/<(?:div|main|section|header|footer)(?: [^>]*)?>/gi, '<Container>')
      .replace(/<\/(?:div|main|section|header|footer)>/gi, '</Container>')
      .replace(/<(?:p|span|h[1-6])(?: [^>]*)?>/gi, '<Container>')
      .replace(/<\/(?:p|span|h[1-6])>/gi, '</Container>')
      .replace(/<button(?: [^>]*)?>/gi, '<Button variant="primary">')
      .replace(/<\/button>/gi, '</Button>')
      .replace(/data=\{\[\]\(\)\}/g, 'data={[65, 59, 80, 81, 56, 55, 40]}')
      .replace(/data=\{\[\]\}/g, 'data={[65, 59, 80, 81, 56, 55, 40]}');

    // Validation
    const validation = validateJSX(cleanedCode);

    if (!validation.isValid) {
      console.error("Validation Error:", validation.error);
      return NextResponse.json({ 
        error: validation.error,
        code: `<><Card title="Generation Error"><Container><Button variant="destructive">Generation blocked</Button></Container></Card></>`,
        explanation: "The generated code used disallowed HTML tags."
      });
    }
    // Generate explanation for the user
    const explainerContext = `Explain this UI Plan to the user: ${JSON.stringify(plan)}`;
    
    const { text: explanation } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: EXPLAINER_SYSTEM_PROMPT,
      prompt: explainerContext,
    });

    return NextResponse.json({
      plan,
      code: cleanedCode,
      explanation
    });

  } catch (error) {
    console.error("Agent Error:", error);
    return NextResponse.json({ error: "Failed to generate UI." }, { status: 500 });
  }
}