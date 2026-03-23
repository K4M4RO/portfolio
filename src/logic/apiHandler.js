export async function askAPI(message, context) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context })
    });

    const data = await response.json();

    if (data.loading) {
      return "L'assistant se prépare pour vous répondre au mieux (cela peut prendre quelques secondes)...";
    }

    if (!response.ok) {
      return "L'assistant est momentanément indisponible. N'hésitez pas à consulter mes projets ou à me contacter par email !";
    }

    return data.reply || "L'assistant est momentanément indisponible. N'hésitez pas à consulter mes projets ou à me contacter par email !";
  } catch (err) {
    return "L'assistant est momentanément indisponible. N'hésitez pas à consulter mes projets ou à me contacter par email !";
  }
}
