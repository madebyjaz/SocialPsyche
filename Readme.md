# 🧠 SocialPsyche

**SocialPsyche** is a personality-driven journaling and reflection web app designed to help users understand themselves better — especially in social contexts — through personalized AI feedback. Built for introverts, extroverts, and everyone in between, the app provides two contrasting AI advisors (human-like vs. robotic) and challenges users to guess who’s who.

## 💡 Why SocialPsyche?

Many people struggle with social anxiety, confidence, or understanding their unique communication style. **SocialPsyche** creates a safe and supportive space for self-reflection through:

- 🧭 A quiz-based MBTI-inspired personality assessment
- 🗨️ Two chat advisors — one more human, the other more analytical
- 🧪 A Turing-style guessing game: can you tell which advisor is AI or human-inspired?

---

## 📁 Project Structure

```
SocialPsyche/
├── backend/
│   └── main.py               # FastAPI backend with session + chat logic
├── components/
│   ├── AdviceScreen.tsx
│   ├── LandingScreen.tsx
│   ├── ProgressScreen.tsx
│   ├── QuizScreen.tsx
│   └── ResultsScreen.tsx
├── ui/                       # Reusable UI components (slider, switch, etc.)
├── styles/
│   └── globals.css
├── .env                      # Environment variables (e.g., Hugging Face API key)
├── App.tsx                   # React root component
└── README.md
```

---

## 🔧 Tech Stack

### Frontend
- **React + TypeScript**
- **TailwindCSS** for responsive design
- **Framer Motion** for smooth animations
- **Lucide Icons** for UI elements
- **Figma** (for UI prototyping)

### Backend
- **FastAPI (Python)** – lightweight API to manage chat logic and Hugging Face integration
- **OpenAI/Hugging Face Transformers API** – for real-time AI responses
- **.env** environment config for secure API key management

---

## 🚀 Features

- 💡 **Why Statement** — Personal backstory that sets the tone and purpose of the app, building user trust and emotional connection
- 💬 **FAQs Section** — Answers common questions about social traits, introversion, and personality types
- 🧠 **Personality Quiz** — Inspired by MBTI, dynamically generates cognitive preferences
- 📊 **Visualizations** — Radar and bar charts visualize user traits
- 🤖 **Two Chat Advisors** — With different personalities (human vs robotic)
- 🎭 **Guess the AI** — Users interact and guess which advisor is AI-powered
- 🌐 **Online/Offline Mode** — Intelligent fallback with mock responses for offline use

---

## 🛠️ Installation

### 1. Clone the repository ✅

```bash
git clone https://github.com/madebyjaz/SocialPsyche
cd SocialPsyche
```

### 2. Install frontend dependencies ✅
```bash
npm install
```

### 3. Install backend dependencies ✅
```bash
pip install fastapi uvicorn python-dotenv openai
```

### 4. Run the app locally ✅

#### Start the Backend
```bash
cd backend
uvicorn main:app --reload
```

#### Start the Frontend 
Open a new terminal window: 💻
```bash
npm run dev
```
---
## Built For 📈
This project was created during the [🧠 AI vs H.I. Global Hackathon by the CS Girlies](https://csgirlies.devpost.com/) under the **Make Anything, But Make it YOU ✨** track.

Primarily built solo from ideation to deployment — with design, development, and copywriting completed independently during the 48-hour sprint. The UI was prototyped using Figma Dev Mode, with custom code integrated to add a more personal touch.

---
## 🛣️ Future Features

- [ ] User authentication and saved journal history  
- [ ] Mood tracking with sentiment analysis  
- [ ] Expanded quiz types (Big Five, Enneagram)  
- [ ] Custom AI advisor personalities (choose tone)  
