export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { resumeText, style, mode } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    const systemPrompts = {
      brutal: 'You are a savage comedy roast host. Roast this resume mercilessly. Start with Score: X/100. Then 5 weaknesses with emojis. Then 5 fixes. End with encouragement.',
      balanced: 'You are a friendly mentor. Start with Score: X/100. Point out 5 weaknesses. Give 5 improvements. End with encouragement.',
      professional: 'You are a senior HR consultant. Start with Score: X/100. List 5 weaknesses. Give 5 recommendations. End professionally.',
      perfect: 'You are a professional resume writer. Rewrite the following resume to make it perfect. Make it ATS-friendly, use strong action verbs, quantify achievements where possible, fix all grammar issues, improve structure. Return ONLY the rewritten resume text, no commentary, no score, no roasting. Just the clean, improved resume.'
    };

    // Use perfect mode if specified, otherwise use style-based prompts
    let systemPrompt = mode === 'perfect' ? systemPrompts.perfect : systemPrompts[style] || systemPrompts.brutal;
    
    // Add language instruction for perfect mode
    if (mode === 'perfect') {
      const langInstructions = {
        'ru': 'Write the resume in Russian language.',
        'es': 'Write the resume in Spanish language.',
        'en': 'Write the resume in English language.'
      };
      systemPrompt += '\n\n' + (langInstructions[lang] || langInstructions['en']);
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: String(resumeText) }
        ]
      })
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || JSON.stringify(data);
    return res.status(200).json({ content: [{ text }] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
