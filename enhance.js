export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: 'Missing question or answer' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not set' });
  }

  try {
    // Gemini API endpoint (example for Gemini Pro)
    const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey;
    const prompt = `Enhance the following answer for the question.\nQuestion: ${question}\nAnswer: ${answer}`;
    const body = {
      contents: [{ parts: [{ text: prompt }] }]
    };
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
      return res.status(200).json({ enhanced: data.candidates[0].content.parts[0].text });
    } else {
      return res.status(500).json({ error: 'No enhanced answer returned from Gemini.' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to enhance answer', details: err.message });
  }
} 
