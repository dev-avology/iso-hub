import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createReadStream } from 'fs';
import { marked } from 'marked';
import pdf from 'pdf-parse';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check for required environment variables
const requiredEnvVars = [
  'VITE_SUPABASE_URL', 
  'VITE_SUPABASE_ANON_KEY', 
  'OPEN_AI_API_KEY',
  'CLAUDE_API_KEY',
  'GOOGLE_DRIVE_CLIENT_ID',
  'GOOGLE_DRIVE_CLIENT_SECRET',
  'GOOGLE_DRIVE_REFRESH_TOKEN',
  'GOOGLE_DRIVE_FOLDER_ID'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize clients
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

let embeddingService;
try {
  // Try to use OpenAI for embeddings first
  if (process.env.OPEN_AI_API_KEY) {
    embeddingService = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY
    });
    console.log('Using OpenAI for embeddings');
  } 
  // Fall back to Claude if OpenAI is not available
  else if (process.env.CLAUDE_API_KEY) {
    embeddingService = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });
    console.log('Using Claude for embeddings');
  } else {
    throw new Error('No embedding service API key provided');
  }
} catch (err) {
  console.error('Error initializing embedding service:', err);
  process.exit(1);
}

// Set up Google Drive API
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_DRIVE_CLIENT_ID,
  process.env.GOOGLE_DRIVE_CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob' // Redirect URI for installed applications
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
});

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

// Function to generate embeddings
async function generateEmbedding(text) {
  try {
    if (embeddingService instanceof OpenAI) {
      const response = await embeddingService.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float'
      });
      return response.data[0].embedding;
    } else {
      // Using Claude for embeddings
      const response = await fetch('https://api.anthropic.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          input: text
        })
      });
      
      if (!response.ok) {
        throw new Error(`Claude API embedding error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.embedding;
    }
  } catch (err) {
    console.error('Error generating embedding:', err);
    throw err;
  }
}

// Function to process a document and store its embeddings
async function processDocument(fileId, fileName, mimeType) {
  console.log(`Processing document: ${fileName} (${fileId})`);
  
  try {
    // Create a temporary directory if it doesn't exist
    const tempDir = path.join(__dirname, '../temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    // Download the file
    const tempFilePath = path.join(tempDir, fileName);
    const dest = createReadStream(tempFilePath);
    
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );
    
    await new Promise((resolve, reject) => {
      response.data
        .on('end', resolve)
        .on('error', reject)
        .pipe(dest);
    });
    
    // Extract text based on file type
    let text;
    
    if (mimeType === 'application/pdf') {
      const dataBuffer = await fs.readFile(tempFilePath);
      const pdfData = await pdf(dataBuffer);
      text = pdfData.text;
    } else if (mimeType === 'text/markdown' || fileName.endsWith('.md')) {
      const content = await fs.readFile(tempFilePath, 'utf8');
      text = marked.parse(content);
    } else if (mimeType === 'text/plain' || fileName.endsWith('.txt')) {
      text = await fs.readFile(tempFilePath, 'utf8');
    } else {
      console.log(`Unsupported file type: ${mimeType} for file: ${fileName}`);
      return;
    }
    
    // Clean up the temporary file
    await fs.unlink(tempFilePath);
    
    // Split into chunks of ~1000 tokens
    const chunks = text.match(/[\s\S]{1,4000}/g) || [];
    
    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);
      
      await supabase.from('document_embeddings').insert({
        content: chunk,
        embedding,
        file_path: `google-drive://${fileId}`,
        file_type: mimeType,
      });
    }
    
    console.log(`Successfully processed document: ${fileName}`);
  } catch (error) {
    console.error(`Error processing document ${fileName}:`, error);
  }
}

// Main function to index Google Drive documents
async function indexGoogleDrive() {
  try {
    console.log('Starting Google Drive indexing...');
    
    // Get list of files in the specified folder
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, modifiedTime)',
    });
    
    const files = res.data.files;
    if (files.length === 0) {
      console.log('No files found in the specified Google Drive folder.');
      return;
    }
    
    console.log(`Found ${files.length} files in Google Drive folder.`);
    
    // Process each file
    for (const file of files) {
      const { id, name, mimeType } = file;
      
      // Check if we support this file type
      const supportedTypes = [
        'application/pdf',
        'text/plain',
        'text/markdown',
      ];
      
      const supportedExtensions = ['.pdf', '.txt', '.md'];
      
      const hasExtension = supportedExtensions.some(ext => name.endsWith(ext));
      
      if (supportedTypes.includes(mimeType) || hasExtension) {
        await processDocument(id, name, mimeType);
      } else {
        console.log(`Skipping unsupported file: ${name} (${mimeType})`);
      }
    }
    
    // Update the indexing status
    await supabase.from('indexing_status').insert({
      source: 'google_drive',
      indexed_at: new Date().toISOString(),
      files_processed: files.length
    });
    
    console.log('Google Drive indexing completed successfully');
  } catch (error) {
    console.error('Error indexing Google Drive:', error);
    process.exit(1);
  }
}

// Run the indexing process
indexGoogleDrive().catch(console.error);