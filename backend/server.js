require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const multer = require('multer');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

app.use(cors());
app.use(express.json());

// 1. AI Diagnostics
app.post('/api/diagnostics', async (req, res) => {
  const { symptoms } = req.body;
  const resp = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role:'system', content:'You’re an herbalist AI.' },
      { role:'user', content: `Patient presents: ${symptoms}. Suggest a safe herbal regimen.` }
    ]
  });
  res.json({ suggestion: resp.data.choices[0].message.content });
});

// 2. Personalized Formulations
app.post('/api/formulations', async (req, res) => {
  const { herbs, age, weight } = req.body;
  const resp = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role:'system', content:'You’re an AI herbal formulation engine.' },
      { role:'user', content:`Customize a compound for a ${age}‑year‑old, ${weight} kg, using: ${herbs.join(', ')}` }
    ]
  });
  res.json({ formula: resp.data.choices[0].message.content });
});

// 3. Ingredient Identification (via OpenAI’s vision endpoint)
app.post('/api/identify‑ingredient', upload.single('image'), async (req, res) => {
  const image = req.file.buffer.toString('base64');
  const resp = await openai.createImageRecognition({
    model: 'vision‑latest',
    image: image
  });
  res.json({ species: resp.data.species, purity: resp.data.purity });
});

// 4. Predictive Efficacy
app.post('/api/predictive‑efficacy', async (req,res) => {
  const { herb, condition } = req.body;
  const resp = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      {role:'system', content:'You’re a stats AI.'},
      {role:'user', content:`Predict efficacy for ${herb} treating ${condition}. Give %.`}
    ]
  });
  res.json({ efficacy: resp.data.choices[0].message.content });
});

// 5. Education Chatbot
app.post('/api/chat', async (req,res) => {
  const { message, history } = req.body;
  const messages = history.concat({ role:'user', content: message });
  const resp = await openai.createChatCompletion({
    model:'gpt-4',
    messages
  });
  res.json({ reply: resp.data.choices[0].message.content });
});

// 6. Research Engine (NLP scan)
app.post('/api/research', async (req,res) => {
  const { query } = req.body;
  const resp = await openai.createChatCompletion({
    model:'gpt-4',
    messages: [
      {role:'system', content:'You synthesize medical literature.'},
      {role:'user', content:`Find key points on: ${query}` }
    ]
  });
  res.json({ summary: resp.data.choices[0].message.content });
});

// 7. Inventory Forecast (simple time‑series stub)
app.post('/api/inventory‑forecast', (req,res) => {
  const { herb, weeks } = req.body;
  // TODO: replace with real model
  const forecast = Array.from({length: weeks}, () => Math.round(Math.random()*200 + 50));
  res.json({ forecast });
});

// 8. Genetic‑Herbal Match
app.post('/api/genetic‑match', upload.single('report'), (req,res) => {
  // parse CSV/JSON from Buffer; here we stub:
  res.json({
    analysis: 'Your CYP1A2 genotype suggests slower Turmeric metabolism; reduce dose by 30%.'
  });
});

// 9. Dosage & Interaction Checker
app.post('/api/dosage', async (req,res) => {
  const { weight, symptom } = req.body;
  const resp = await openai.createChatCompletion({
    model:'gpt-4',
    messages:[
      {role:'system',content:'You calculate herbal dosing.'},
      {role:'user', content:`Recommend safe dose for a ${weight} kg adult for ${symptom}.`}
    ]
  });
  res.json({ dosage: resp.data.choices[0].message.content });
});
app.post('/api/interaction', async (req,res) => {
  const { herbA, herbB } = req.body;
  const resp = await openai.createChatCompletion({
    model:'gpt-4',
    messages:[
      {role:'system',content:'You’re a drug‑interaction AI.'},
      {role:'user', content:`Check interactions between ${herbA} and ${herbB}.`}
    ]
  });
  res.json({ interaction: resp.data.choices[0].message.content });
});

// start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log(`🚀 AI backend running on port ${PORT}`));
