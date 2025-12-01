import axios from 'axios';
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.index(process.env.PINECONE_INDEX!);

export async function embed(text: string): Promise<number[]> {
  const res = await axios.post(
    'https://api.openai.com/v1/embeddings',
    { input: text, model: 'text-embedding-3-large' },
    { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
  );

  return res.data.data[0].embedding;
}

export async function retrieveDocs(embedding: number[]) {
  const results = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true
  });

  return results.matches.map(m => m.metadata);
}

export async function generateAnswer(question: string, docs: any[]) {
  const context = docs.map(d => d.text).join('\n\n');

  const prompt = `
  You are a helpful assistant. Use the following context to answer:

  Context:
  ${context}

  Question: ${question}

  Answer:
  `;

  const res = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: 'You are a RAG assistant.' },
        { role: 'user', content: prompt }
      ]
    },
    { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
  );

  return res.data.choices[0].message.content;
}
