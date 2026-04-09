<h1 align="center">Portfolio IA 2.0 - Assistant Intelligent & RAG</h1>
<h1 align="center">https://portfolio-imranelarhrib2017-2874s-projects.vercel.app/</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=groq&logoColor=white" />
  <img src="https://img.shields.io/badge/Llama_3.3-0466C8?style=for-the-badge&logo=meta&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

## Présentation
Bonjour ! Je suis **Imrane Larhrib**, étudiant en 2ème année BUT Science des Données (Data Science).
Ce portfolio va bien au-delà d'un simple CV en ligne : il intègre un assistant virtuel doté d'une intelligence artificielle avancée pour interagir avec vous et vous présenter mon parcours, mes compétences et mes projets de manière dynamique.

---

## Architecture IA (Le Point Fort du Projet)

Ce portfolio embarque une architecture hybride à la pointe de la technologie pour assurer rapidité et confidentialité :

- **Mode Cloud (Groq LPU)** : L'inférence est propulsée par l'API Groq utilisant le modèle **Llama-3.3-70b-versatile**. Grâce aux LPU (Language Processing Units) de Groq, les réponses sont générées à une vitesse fulgurante.
- **Mode Local (WebLLM & WebGPU)** : Pour une confidentialité totale, l'IA peut s'exécuter directement et localement dans votre navigateur sans aucune requête externe, exploitant la puissance de votre carte graphique via WebGPU.

### Le Concept RAG (Retrieval-Augmented Generation)
L'intelligence de l'assistant repose sur une architecture RAG. Le chatbot utilise le fichier `projects.json` comme base de connaissances dynamique. Il scanne mes compétences, mes expériences (Python, SQL, Docker, etc.) et mes réalisations métiers pour répondre à vos questions avec précision et pertinence, sans jamais "halluciner" ou inventer des informations.

---

## Fonctionnalités Clés

- **Chatbot Intelligent & Contextuel** : Il comprend vos questions, confirme mes compétences techniques et est capable de générer des actions interactives.
- **Boutons de Redirection Dynamiques** : L'IA peut vous proposer un projet pertinent en temps réel et générer un bouton cliquable qui vous redirigera directement vers les détails de ce projet dans l'interface.
- **Sécurité Anti-Spam** : Intégration d'un système robuste avec limitation de session (`sessionStorage`) plafonnée à 50 messages pour prévenir les abus d'API.
- **UI/UX Premium** : Un design sombre, moderne, 100% responsive, pensé pour offrir la meilleure expérience utilisateur avec des animations fluides.

---

## Stack Technique

### Frontend
- **React.js** : Bibliothèque cœur pour la réactivité de l'interface.
- **Vite** : Bundler ultra-rapide pour le développement.
- **Tailwind CSS** : Framework utilitaire pour un stylage pointu et moderne.
- **Lucide React** : Collection d'icônes élégantes et légères.

### Backend / IA
- **API Groq** : Cloud inference provider ultra-rapide.
- **OpenAI SDK** : Intégration standardisée des flux de complétion (compatible Groq).
- **WebLLM** : Inférence de modèles de langage in-browser via WebGPU.

### Data & Projets Répertoriés
L'IA intègre et propose des projets développés avec ces technologies :
- **Python, SQL, DuckDB, PyTorch, Scikit-Learn, Power BI, Docker, VBA, Dash.**

---

## Structure du Projet

```text
portfolio/
├── api/                   # Backend Serverless (Vercel Functions)
│   └── chat.js            # Point d'entrée de l'API Groq / OpenAI
├── public/                # Assets statiques (images, fonts, etc.)
├── src/
│   ├── components/        # Composants React (Hero, ChatBox, SkillsSection...)
│   ├── data/              # Base de connaissances RAG (projects.json)
│   ├── logic/             # Logique métier (aiDetector, webLLMHandler, apiHandler)
│   ├── App.jsx            # Composant racine
│   └── main.jsx           # Point de montage React
├── .env                   # Variables d'environnement
├── package.json           # Dépendances du projet
└── vite.config.js         # Configuration Vite
```

---

## Installation & Exécution Local

1. **Cloner le dépôt**
```bash
git clone https://github.com/K4M4RO/portfolio.git
cd portfolio
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
Créer un fichier `.env` à la racine (ou `.env.local`) et y insérer votre clé API Groq :
```env
GROQ_API_KEY=votre_cle_api_ici
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

---

## Contact & Liens

Vous souhaitez en savoir plus ou discuter d'une opportunité ?
- **LinkedIn** : [Imrane Larhrib](https://www.linkedin.com/in/imrane-larhrib)
- **GitHub** : [K4M4RO](https://github.com/K4M4RO)

---
<p align="center"><i>Fait avec ❤️ et beaucoup de ☕.</i></p>
