// Petit serveur Express qui relaie les requêtes vers l'API Claude.
// Il garde la clé API secrète côté serveur (jamais exposée au navigateur)
// et évite les problèmes de CORS quand le site tourne en dehors de claude.ai.
//
// Lancer : node server/index.js  (après avoir créé un fichier .env, voir .env.example)

import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.warn(
    "⚠️  ANTHROPIC_API_KEY manquante. Crée un fichier .env à la racine avec :\n" +
    "    ANTHROPIC_API_KEY=sk-ant-xxxxxxxx\n" +
    "Le chat IA ne fonctionnera pas tant que la clé n'est pas définie."
  );
}

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: "Clé API non configurée sur le serveur." });
  }

  try {
    const { system, messages } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur API Anthropic:", data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur du chat IA démarré sur http://localhost:${PORT}`);
});
