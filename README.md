# AI UI Generator

A deterministic, LLM-powered UI generator that converts natural language into safe, renderable React code.

This project was built as a full-stack assignment to demonstrate AI agent orchestration, deterministic code generation, and state management.

## 🚀 Features

* [cite_start]**Multi-Step Agent Architecture:** Uses a Planner -> Generator -> Explainer pipeline to ensure high-quality output [cite: 50-60].
* **Deterministic Runtime:** Enforces a strict component allowlist. [cite_start]Automatically "heals" hallucinations (e.g., converting `<div>` to `<Container>`) to prevent runtime crashes[cite: 18].
* [cite_start]**Live Workspace:** Resizable split-pane view with real-time live preview and read-only code display [cite: 66-67].
* [cite_start]**Context-Aware Iteration:** Supports incremental edits (e.g., "Change the chart to a bar chart") without regenerating the entire UI[cite: 79].
* [cite_start]**State Management:** Full undo/rollback history stack[cite: 72].
* [cite_start]**Safety Guardrails:** Custom regex-based AST injection validation middleware [cite: 89-90].

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
    git clone <your-repo-url>
    cd ui-generator-agent
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory and add your Groq API key:
    ```env
    GROQ_API_KEY=gsk_...
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

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
