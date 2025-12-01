import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { embed, retrieveDocs, generateAnswer } from './rag';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/query', async (req, res) => {
  try {
    const question = req.body.question;

    // 1. Embed question
    const queryEmbedding = await embed(question);

    // 2. Retrieve relevant docs
    const docs = await retrieveDocs(queryEmbedding);

    // 3. Generate LLM answer
    const answer = await generateAnswer(question, docs);

    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'RAG processing error' });
  }
});

app.listen(3000, () => console.log('RAG backend running on port 3000'));
