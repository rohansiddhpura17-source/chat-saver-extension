# ChatSaver — Privacy-First AI Conversation Exporter

[![Chrome Extension](https://img.shields.io/badge/Extension-Manifest%20V3-blue.svg)]()
[![React](https://img.shields.io/badge/Dashboard-React%2019-cyan.svg)]()
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)]()
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8.svg)]()

> **Export, archive, search, and manage your AI conversations across ChatGPT, Claude, and Gemini into clean Markdown, PDF, and formatted TXT.**

ChatSaver is a local-first Chrome extension that turns fleeting AI interactions into a searchable personal knowledge base. Designed for researchers, software engineers, and students, ChatSaver captures multi-turn prompt chains and responses with perfect code block syntax preservation, mathematical notation formatting, and zero external telemetry.

---

## 🌟 Key Features

- **Multi-Platform Support**: Seamlessly extracts dialogues from ChatGPT, Anthropic Claude, and Google Gemini web interfaces.
- **High-Fidelity Code Formatting**: Preserves code blocks, language tags, markdown tables, KaTeX math symbols, and bullet hierarchies.
- **Multiple Export Formats**:
  - 📄 **Markdown (`.md`)**: Ready for Obsidian, Notion, GitHub, and Logseq.
  - 📑 **Clean PDF**: Formatted with paginated typography and print styling.
  - 📝 **Plain Text (`.txt`)**: Lightweight, searchable transcript format.
- **Offline Local Management**: Saved dialogues can be tagged, indexed, and searched directly in the local extension dashboard without leaving the browser.
- **Zero-Telemetry Security**: Operates strictly within browser permissions (`activeTab`, `storage`). Zero user data or transcripts ever leave your computer.

---

## 🛠️ Technology Stack

- **Extension Framework:** Chrome Extension Manifest V3 (MV3)
- **Frontend Dashboard:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, PostCSS
- **Storage:** Chrome Extension Storage API (Local Indexed Storage)
- **Linting & Code Quality:** Oxlint, TypeScript strict mode

---

## 📂 Project Structure

```
chat-saver-extension/
├── extension/             # Core Chrome Extension logic
│   ├── background.js      # Service worker for background listeners
│   ├── content.js         # Platform-specific DOM conversation parsers
│   └── content.css        # Injection styles
├── src/                   # React management dashboard & viewer
│   ├── components/        # Conversation viewer, search, export modals
│   ├── App.tsx            # Main dashboard shell
│   └── main.tsx           # Entrypoint
├── icons/                 # Brand and toolbar icons
├── manifest.json          # Chrome MV3 manifest
├── popup.html             # Toolbar action popup
├── vite.config.ts         # Vite build configuration
└── package.json
```

---

## 🚀 Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/rohansiddhpura17-source/chat-saver-extension.git
   cd chat-saver-extension
   ```
2. Build the extension package:
   ```bash
   npm install
   npm run build
   ```
3. Open Google Chrome and navigate to `chrome://extensions/`.
4. Toggle **Developer mode** in the upper-right corner.
5. Click **Load unpacked** and select the `chat-saver-extension` folder.
6. Open ChatGPT, Claude, or Gemini and click the ChatSaver icon to export any conversation!
\n
---

## 👨‍💻 Developer & Contact

**Rohan Siddhpura**  
*B.Tech in Information Technology — RK University*  
- **GitHub:** [@rohansiddhpura17-source](https://github.com/rohansiddhpura17-source)  
- **Email:** [rohansiddhpura17@gmail.com](mailto:rohansiddhpura17@gmail.com)  
- **Open for:** Software Engineering Internships, Graduate Roles & Open-Source Collaboration
