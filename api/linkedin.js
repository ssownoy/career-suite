export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { resume, lang = 'en' } = req.body;

  if (!resume) {
    return res.status(400).json({ error: 'Resume is required' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: lang === 'en' 
              ? 'You are a LinkedIn profile expert. Write a compelling LinkedIn bio/summary based on resume provided. Make it professional, engaging, and optimized for LinkedIn. Include relevant keywords and highlight key achievements. Keep it to 150-200 words max.'
              : lang === 'es'
              ? 'Eres un experto en perfiles de LinkedIn. Escribe una biografía/resumen convincente para LinkedIn basada en el currículum proporcionado. Hazlo profesional, atractivo y optimizado para LinkedIn. Incluye palabras clave relevantes y destaca los logros clave. Máximo 150-200 palabras.'
              : 'Вы эксперт по профилям LinkedIn. Напишите убедительное био/резюме для LinkedIn на основе предоставленного резюме. Сделайте его профессиональным, привлекательным и оптимизированным для LinkedIn. Включите релевантные ключевые слова и выделите ключевые достижения. Максимум 150-200 слов.'
          },
          {
            role: 'user',
            content: `Resume:\n${resume}`
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const bio = data.choices[0]?.message?.content || 'Failed to generate LinkedIn bio';

    res.status(200).json({ bio });
  } catch (error) {
    console.error('LinkedIn bio generation error:', error);
    res.status(500).json({ error: 'Failed to generate LinkedIn bio' });
  }
}
