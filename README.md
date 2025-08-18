# SmartSocial AI Assistant

SmartSocial is an AI-powered social media assistant that helps users create, refine, and share engaging posts with ease.  
It combines advanced AI models (OpenAI GPT, Claude, Stability AI) with a smooth React + Vite frontend.

---

## 🚀 Features
- ✨ **Prompt Enhancer** → Refines raw text into polished post ideas
- 🖼️ **AI Image Generator** → Generates quick previews (512x512) and high-quality images (1024x1024)
- 📝 **Caption & Hashtag Generator** → Creates catchy captions and relevant hashtags
- 🛡️ **Safety Agent** → Checks for safe content before publishing
- 🔄 **Claude + GPT + Stability fallbacks** → Reliable multi-model setup
- 🔥 **Firebase Logging & Caching** → Smart reuse of prompts and reduced API costs
- 🎨 **Modern UI** → Built with React, Tailwind, Vite

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, TailwindCSS
- **AI Agents:** OpenAI GPT, Claude, Stability AI
- **State & Routing:** React Router, Context Providers
- **Storage & Logging:** Firebase
- **Version Control:** Git + GitHub

---

## 📂 Project Structure

src/
├── main.tsx # App entrypoint
├── index.css # Tailwind base styles
└── smartsocial/ # SmartSocial mini-app
├── agents/ # AI agents (prompt, image, caption, etc.)
├── components/ # UI components
├── pages/ # App pages
├── utils/ # Helpers, caching, logging
└── styles/ # Custom styles


---

## ⚡ Quick Start

1. Clone the repo:
   ```bash
   git clone https://github.com/MihirPatnaik/smartsocial.git
   cd smartsocial

Install dependencies:
npm install

Setup environment variables:
Copy .env.example → .env
Add your API keys (OpenAI, Claude, Stability, Firebase)

Run locally:
npm run build

📌 Roadmap

 Advanced analytics & optimization agent
 Social media auto-posting integration
 Admin dashboard for campaign tracking

👤 Author

Mihir Patnaik
Google ML Certified Professional
Founder @ DatasenceAI.com
Passionate about building practical AI solutions for businesses









