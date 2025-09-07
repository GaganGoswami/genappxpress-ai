# GenAppXpress

Visual, instant scaffolding for full‑stack and agentic AI applications. Build a project skeleton and setup scripts in minutes via a multi‑step wizard. Includes AI framework + LLM provider selection, real‑time compatibility guidance, and downloadable ZIP/script exports.

## ✨ Features
- Multi-step wizard (Project → Tech Stack → Summary → Generate)
- Frontend / Backend / Database / DevTools selection
- Agentic AI support (LangChain, CrewAI, LangGraph, Semantic Kernel, AutoGen, etc.)
- LLM providers (OpenAI, Anthropic, Gemini, xAI, Ollama) + MCP protocol
- Real-time compatibility conflict + warning detection
- Live setup script generation (Bash) with Python + Node deps
- File tree preview & ZIP export (includes `setup.sh` + `.env` template)
- Template gallery for common AI use cases (Chatbot, RAG, Research Agent, etc.)
- Dark / Light mode, responsive layout, accessible components

## 🚀 Quick Start (Standalone HTML)
Open `index.html` directly in a modern browser. No build required.

## 🧪 Dev Mode (Vite)
Install deps and start the dev server:

```bash
npm install
npm run dev
```

## 📦 Exporting a Project
1. Configure stack in the wizard.
2. Go to Generate step.
3. Download ZIP or copy script.
4. Run `bash setup.sh` inside the extracted folder.

## 🔐 Environment Variables
Populate API keys in `.env` after generation:
```
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
XAI_API_KEY=
OLLAMA_HOST=localhost
```
Only keys relevant to your chosen providers are needed.

## 🧠 AI Framework Notes
| Framework | Uses | Notes |
|-----------|------|-------|
| LangChain | RAG, agents | Rich tool/memory ecosystem |
| CrewAI | Multi-agent roles | Task orchestration |
| LangGraph | Graph orchestration | Stateful agent flows |
| Semantic Kernel | Plugins & skills | Model-agnostic orchestration |
| AutoGen | Multi-agent chat loops | Simplified coordination |

## 🔌 Protocols
MCP (Model Context Protocol) enables tool & data backends accessible to LLMs/agents. If selected, basic placeholder client code is scaffolded.

## 📁 Generated Structure (Example)
```
my-awesome-project/
  README.md
  .env
  package.json
  agents/
    main_agent.py
    config/providers.yaml
    mcp/client.js (if MCP)
  server/server.js (if Express)
  src/App.jsx (if React)
  database/schema.sql (if DB)
  setup.sh
```

## 🛠 Roadmap (Planned)
- GitHub repo auto-create
- VS Code extension
- Cloud template sharing
- CI/CD + deployment recipes
- Evals & tracing bootstrap for agents

## 🤝 Contributing
PRs welcome for:
- Additional frameworks/providers
- Improved compatibility rules
- Accessibility enhancements

## 📄 License
MIT

---
Generated with ❤️ by GenAppXpress.
