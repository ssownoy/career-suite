export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobDescription, lang = 'en' } = req.body;

  if (!jobDescription) {
    return res.status(400).json({ error: 'Job description is required' });
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
              ? 'You are an interview coach. Generate 10 likely interview questions based on the job description, along with suggested answers for each. Format each question and answer clearly with "Q:" and "A:" prefixes. Make answers practical and professional.'
              : 'Вы тренер по собеседованиям. Сгенерируйте 10 вероятных вопросов для собеседования на основе описания вакансии, а также предложенные ответы на каждый. Четко форматируйте каждый вопрос и ответ с префиксами "Q:" и "A:". Сделайте ответы практичными и профессиональными.'
          },
          {
            role: 'user',
            content: `Job Description:\n${jobDescription}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const questions = data.choices[0]?.message?.content || 'Failed to generate interview questions';

    res.status(200).json({ questions });
  } catch (error) {
    console.error('Interview questions generation error:', error);
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
}
