# AI UI Generator

A deterministic, LLM-powered UI generator that converts natural language into safe, renderable React code.

This project was built as a full-stack assignment to demonstrate AI agent orchestration, deterministic code generation, and state management.

## 🚀 Features

* **Multi-Step Agent Architecture:** Uses a `Planner -> Generator -> Healer` pipeline to ensure high-quality output.
* **⚡ Powered by Groq:** Leverages **Llama 3-70B** on Groq's LPU engine for near-instant code generation.
* **Deterministic Runtime:** Enforces a strict component allowlist (e.g., auto-converting `<div>` to `<Container>`) to prevent runtime crashes.
* **Live Workspace:** Resizable split-pane view with real-time live preview and editable code.
* **Context-Aware Iteration:** Supports incremental edits (e.g., *"Change the chart to a bar chart"*) without regenerating the entire UI.
* **State Management:** Full undo/rollback history stack.
* **Diff View:** Visual comparison tool (`react-diff-viewer-continued`) to see exactly what code the AI changed between versions.
* **Buffered Streaming:** A custom "Typewriter" hook that simulates streaming while maintaining backend stability and syntax safety.
* **Safety Guardrails:** Static analysis and strict component schema validation to prevent hallucinated or unsafe code.

## 🛠️ Tech Stack

* **Frontend:** Next.js 14 (App Router), Tailwind CSS, React-Live, Lucide React.
* **Backend:** Next.js API Routes (Edge compatible).
* **AI Layer:** Vercel AI SDK + Groq (Llama 3.3 70B) for low-latency reasoning.
* **Validation:** Zod for schema validation & Custom Regex for JSX sanitization.

## 🏗️ Architecture Overview

[cite_start]The system uses a 3-stage agent pipeline to ensure reliability [cite: 50-60]:

1.  **The Planner:** Analyzes the user's prompt and the *current* code state. It outputs a high-level JSON plan outlining the layout strategy and components required.
2.  **The Generator:** Takes the plan and converts it into valid JSX code using strictly allowed components.
3.  **The Explainer:** Generates a human-readable summary of the design choices made.
4.  **The Healer (Post-Processing):** A regex-based sanitation layer that catches common LLM errors (e.g., `data={[]()}` syntax errors or forbidden HTML tags) and auto-corrects them before the code reaches the frontend.

## 📦 Component System

[cite_start]To ensure visual consistency and safety, the AI is restricted to a fixed set of components [cite: 30-31]:

* **Layout:** `<Container>` (handles flex-row and flex-col layouts)
* **Navigation:** `<Navbar>`, `<Sidebar>`
* **Data Display:** `<Card>`, `<Chart>` (Line/Bar support), `<Table>`
* **Interaction:** `<Button>`, `<Input>`, `<Modal>`

## 🚀 Setup Instructions

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/devparmar02/UI-Generator.git](https://github.com/devparmar02/UI-Generator.git)
    cd UI-Generator
    ```

2.  **Install dependencies**
    *(Note: Use the `--legacy-peer-deps` flag to resolve React 19 compatibility issues with the diff viewer)*
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory and add your Groq API key:
    ```bash
    GROQ_API_KEY=gsk_your_api_key_here
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open** `http://localhost:3000` with your browser.

## ⚠️ Known Limitations

* **Stateless Components:** The generated UI is purely presentational. Buttons and inputs do not trigger backend actions.
* **Component Set:** The library is intentionally limited to ~8 core components to satisfy the assignment's determinism constraints.
* **Session Storage:** History is currently stored in React state (RAM) and will be lost on page refresh.

## 🔮 Future Improvements

With more time, I would implement:
* **Supabase Integration:** To persist chat history and user sessions.
* [cite_start]**Streaming UI:** Streaming the generated code character-by-character for a more interactive feel[cite: 127].
* **Tailwind Generation:** Safely allowing the AI to inject specific Tailwind utility classes for finer control, strictly validated against a whitelist.
* [cite_start]**Component Schema Validation:** Implementing a full AST parser instead of Regex for more robust code validation[cite: 129].

---

**Author:** Dev Parmar
