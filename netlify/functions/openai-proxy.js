import fetch from 'node-fetch';

export async function handler(event) {
  try {
    const { messages } = JSON.parse(event.body);
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.3,
        max_tokens: 500
      })
    });
    const json = await res.json();
    return { statusCode: 200, body: JSON.stringify(json) };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
