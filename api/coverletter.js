export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { resume, jobDescription, lang } = req.body;
  if (!resume || !jobDescription) return res.status(400).json({ error: 'Missing fields' });

  const langInstructions = lang === 'ru' ? 'Write the cover letter in Russian.' : lang === 'es' ? 'Write the cover letter in Spanish.' : 'Write the cover letter in English.';

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Write a professional, personalized cover letter under 300 words based on this resume and job description. Be confident and specific. ${langInstructions}\n\nRESUME:\n${resume}\n\nJOB DESCRIPTION:\n${jobDescription}`
      }]
    })
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  res.json({ letter: text });
}
