# Afterlife: AI-Powered Digital Twin  

## 🚀 What is Afterlife?  
Afterlife is an AI-powered voice journal that preserves your personality, memories, and voice, creating a **Digital Twin** that loved ones can interact with even after you’re gone. Instead of static recordings, Afterlife enables dynamic conversations based on your recorded thoughts and insights.  

## 👁️ Why This Matters  
✅ **Legacy Beyond Life** – Your wisdom and stories live on for future generations.  
✅ **Interactive Memories** – AI-powered responses make your digital twin feel alive.  
✅ **Deep Emotional Connection** – A way to preserve voices and personalities meaningfully.  

## ✨ Key Features  
- 🎤 **AI-Powered Voice Memory** – Learns speech patterns and generates responses.  
- 🏛️ **Personal History & Wisdom Bank** – Organizes memories and advice interactively.  
- 🔄 **Context-Aware Conversations** – AI recalls relevant past discussions.  
- 🧠 **Sentiment & Personality Modeling** – Captures emotions and personality traits.  
- 🕯️ **Memorial Mode** – Enables meaningful posthumous interactions.  
- 🔮 **Future-Proofing & Ethical Safeguards** – Clear user control and AI guardrails.  

---

## 🛠️ How It Works  

1️⃣ **Create a Character Card**  
   - User fills out a JSON file with their personal information (`json-example.txt`).  

2️⃣ **Generate a Character Card Prompt**  
   - This JSON is combined with a prompt template (`prompt-generation.txt`).  

3️⃣ **System Prompt Creation**  
   - From this, we generate a structured system prompt (`char-card.txt`).  

4️⃣ **Choose AI Platform**  
   - User selects an LLM:  
     - **Local** (e.g., Ollama)  
     - **API-based** (OpenAI, OpenRouter, etc.)  
     - **Hybrid solutions**  

---

## 📌 Using Your Character Card  

### 1️⃣ Virtual Twin / Soul Print Character Card JSON Format  
✔️ DONE – A structured format for storing personality, memories, and voice traits.  

### 2️⃣ A Prompt to Create Your Character Card  
✔️ DONE – A guide to generating a character card using AI.  

### 3️⃣ Using Your Character Card on Popular AI Services  
✔️ DONE – How to integrate with OpenAI, OpenRouter, and other platforms.  

### 4️⃣ Using Your Character Card Locally  
🚧 TODO – Guide on running your digital twin with local AI models.  

### 5️⃣ Ethical Guidelines and Guardrails  
🚧 TODO – Best practices for responsible AI use, privacy, and safeguards.  

### 6️⃣ Adding Video and Voice to Your Digital Twin  
🚧 TODO – Tools like ElevenLabs for realistic voice and video.  

### 7️⃣ Coming Soon: Frontend & Subscription Model  
🚧 TODO – A web app for easy setup, estimated at **$10/month**.  

---

## 🚀 Deployment Instructions  

### Running Locally  

#### Prerequisites  
- **Node.js** (Download and install from [nodejs.org](https://nodejs.org/))  
- **Expo CLI** (Used for React Native development)  

#### Steps to Run Locally  
1. Clone the repository:  
   ```sh
   git clone https://github.com/obsessixnv/afterlife.git
   cd afterlife
2. Install dependencies:  
   ```sh
    npm install
3. Start the project:  
   ```sh
   npx expo start
4. Scan the QR code with your phone (Expo Go app) or run in an emulator.
