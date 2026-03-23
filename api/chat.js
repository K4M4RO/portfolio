export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const { message, context } = await req.json();
  const apiKey = process.env.GROQ_API_KEY?.trim();

  // URL EXACTE DE GROQ
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const messages = [
    { role: "system", content: `Tu es l'assistant virtuel d'Imrane Larhrib pour son portfolio. \nRÈGLE D'OR : Tu ne dois JAMAIS inventer, supposer ou déduire une compétence technique. Si une technologie n'est pas explicitement écrite dans les données fournies, réponds : 'Désolé, Imrane n'a pas documenté cette expérience sur ce portfolio, mais il apprend très vite !'.\nINTERACTIVITÉ : Si tu recommandes un projet présent dans les données, tu DOIS impérativement terminer ta réponse par la balise [ACTION:SEE_PROJECT:id_du_projet]. (Exemple: [ACTION:SEE_PROJECT:football_data]).\nCONCISION : Réponds en 2 ou 3 phrases maximum. Sois professionnel.\nVOICI LES DONNÉES DE SES PROJETS ET COMPÉTENCES : ${JSON.stringify(context)}` },
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
