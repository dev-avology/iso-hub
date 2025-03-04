import { createClient } from '@supabase/supabase-js';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { marked } from 'marked';
import pdf from 'pdf-parse';
import OpenAI from 'openai';

// Check for required environment variables
const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'OPEN_AI_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY
});

async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float'
  });

  return response.data[0].embedding;
}

async function processDocument(filePath) {
  const content = await readFile(filePath);
  let text;

  if (filePath.endsWith('.pdf')) {
    const pdfData = await pdf(content);
    text = pdfData.text;
  } else if (filePath.endsWith('.md')) {
    text = marked.parse(content.toString());
  } else {
    text = content.toString();
  }

  // Split into chunks of ~1000 tokens
  const chunks = text.match(/[\s\S]{1,4000}/g) || [];

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);

    await supabase.from('document_embeddings').insert({
      content: chunk,
      embedding,
      file_path: filePath,
      file_type: filePath.split('.').pop(),
    });
  }
}

async function indexDocuments() {
  try {
    const docsPath = join(process.cwd(), 'docs');
    const files = await readdir(docsPath, { recursive: true });

    for (const file of files) {
      if (file.match(/\.(pdf|md|txt)$/)) {
        await processDocument(join(docsPath, file));
      }
    }
    console.log('Document indexing completed successfully');
  } catch (error) {
    console.error('Error indexing documents:', error);
    process.exit(1);
  }
}

indexDocuments().catch(console.error);