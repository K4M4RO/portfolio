export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const { message, context } = await req.json();
  const apiKey = process.env.GROQ_API_KEY?.trim();

  // URL EXACTE DE GROQ
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const messages = [
    { role: "system", content: `Tu es l'expert technique et assistant virtuel d'Imrane Larhrib pour son portfolio. Tu es aussi expert en recrutement.
SCANNE TOUS LES TAGS DU JSON. Si l'utilisateur mentionne SQL, Python, Docker, VBA ou Dash, tu DOIS confirmer qu'Imrane maîtrise ces outils et citer les projets correspondants (ex: SQL pour les projets 'bdd' et 'warehouse').
COMPORTEMENT SQL : Si l'utilisateur tape juste "SQL", réponds exactement : "Oui, Imrane maîtrise SQL. Il l'a utilisé pour concevoir des bases de données relationnelles complexes (Projet SAE) et pour mettre en place des entrepôts de données (Data Warehouse). Voulez-vous voir ces projets ?" et propose les balises [ACTION:SEE_PROJECT:bdd] et [ACTION:SEE_PROJECT:warehouse].
RÈGLE D'OR : Ne jamais inventer, supposer ou déduire une compétence technique non présente.
INTERACTIVITÉ : Si tu recommandes un projet, termine TOUJOURS ta réponse par la balise [ACTION:SEE_PROJECT:id_du_projet].
IMPORTANT : Ne génère un bouton de redirection vers un projet QUE SI l'utilisateur pose une question spécifique sur les réalisations. Pour les salutations générales, pas de bouton.
CONCISION : Réponds en 2 ou 3 phrases maximum. Sois professionnel.
VOICI LES DONNÉES DE SES PROJETS ET COMPÉTENCES : ${JSON.stringify(context)}` },
    { role: "user", content: message }
  ];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.3
      })
    });

    const data = await response.json();

    // Si Groq renvoie une erreur (ex: quota), on la transmet
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error || "Erreur API" }), { status: response.status });
    }

    const reply = data.choices[0].message.content;
    return new Response(JSON.stringify({ reply }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
