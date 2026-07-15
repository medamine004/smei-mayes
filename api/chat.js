// Fonction serverless Vercel — relaie les appels à l'API Claude.
// Déployée automatiquement par Vercel à l'adresse /api/chat
// La clé API reste secrète côté serveur (jamais exposée au navigateur).
//
// Configuration requise sur Vercel : Project Settings → Environment Variables
//   ANTHROPIC_API_KEY = sk-ant-...

export default async function handler(req, res) {
  // Autorise les requêtes depuis n'importe quelle origine (utile si le site
  // est ouvert depuis plusieurs appareils/domaines).
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "Clé API non configurée sur le serveur (variable ANTHROPIC_API_KEY manquante)." });
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

    res.status(200).json(data);
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
}
