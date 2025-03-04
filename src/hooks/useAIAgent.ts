import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Initialize OpenAI with a more graceful error handling approach
const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const claudeApiKey = import.meta.env.VITE_CLAUDE_API_KEY;

let openai: OpenAI | null = null;
let claude: Anthropic | null = null;

try {
  if (claudeApiKey) {
    claude = new Anthropic({
      apiKey: claudeApiKey
    });
  }
} catch (err) {
  console.error('Error initializing Claude client:', err);
}

try {
  if (openaiApiKey) {
    openai = new OpenAI({
      apiKey: openaiApiKey,
      dangerouslyAllowBrowser: true
    });
  }
} catch (err) {
  console.error('Error initializing OpenAI client:', err);
}

export function useAIAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [needsIndexing, setNeedsIndexing] = useState(false);
  const [lastIndexed, setLastIndexed] = useState<Date | null>(null);

  useEffect(() => {
    // Check when documents were last indexed
    const checkIndexStatus = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('indexing_status')
          .select('*')
          .order('indexed_at', { ascending: false })
          .limit(1);

        if (fetchError) throw fetchError;

        if (data && data.length > 0) {
          const lastIndexTime = new Date(data[0].indexed_at);
          setLastIndexed(lastIndexTime);
          
          // Check if it's been more than 24 hours since last indexing
          const now = new Date();
          const timeDiff = now.getTime() - lastIndexTime.getTime();
          const daysDiff = timeDiff / (1000 * 3600 * 24);
          
          if (daysDiff > 1) {
            setNeedsIndexing(true);
          }
        } else {
          // No indexing has been done yet
          setNeedsIndexing(true);
        }
      } catch (err) {
        console.error('Error checking index status:', err);
      }
    };

    checkIndexStatus();
  }, []);

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get relevant documents from vector store
      const { data: documents, error: searchError } = await supabase.rpc(
        'match_documents',
        {
          query_embedding: await generateEmbedding(message),
          match_threshold: 0.7,
          match_count: 5
        }
      );

      if (searchError) throw searchError;

      // Prepare context from matched documents
      const context = documents
        ? documents.map((doc: any) => `${doc.content}`).join('\n\n')
        : '';

      // Try Claude first, fall back to OpenAI if Claude fails
      try {
        if (claude) {
          const completion = await claude.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            messages: [
              {
                role: 'system',
                content: `You are JACC (Just Another Competent Companion), an AI assistant specializing in payment processing, gateway integration, and hardware documentation. Use the following context to answer questions accurately and professionally:\n\n${context}`
              },
              {
                role: 'user',
                content: message
              }
            ]
          });

          return completion.content[0].text;
        } else if (openai) {
          // Fall back to OpenAI if Claude is not available
          const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are JACC (Just Another Competent Companion), an AI assistant specializing in payment processing, gateway integration, and hardware documentation. Use the following context to answer questions accurately and professionally:\n\n${context}`
              },
              {
                role: 'user',
                content: message
              }
            ],
            temperature: 0.7,
            max_tokens: 500
          });

          return completion.choices[0].message.content;
        } else {
          throw new Error('No AI service is configured');
        }
      } catch (aiError) {
        console.error('Primary AI service failed:', aiError);
        
        // If Claude failed and OpenAI is available, try OpenAI as fallback
        if (claude && openai) {
          const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are JACC (Just Another Competent Companion), an AI assistant specializing in payment processing, gateway integration, and hardware documentation. Use the following context to answer questions accurately and professionally:\n\n${context}`
              },
              {
                role: 'user',
                content: message
              }
            ],
            temperature: 0.7,
            max_tokens: 500
          });

          return completion.choices[0].message.content;
        } else {
          throw aiError; // Re-throw if no fallback is available
        }
      }
    } catch (err) {
      console.error('Error processing message:', err);
      setError('Unable to get a response at the moment. Please try again later.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDriveIndexing = async () => {
    try {
      // This would typically be a server-side operation
      // For demo purposes, we'll just update the UI state
      setNeedsIndexing(false);
      setLastIndexed(new Date());
      
      // In a real implementation, this would call a serverless function or API endpoint
      // that would trigger the Google Drive indexing process
      return true;
    } catch (err) {
      console.error('Error triggering drive indexing:', err);
      return false;
    }
  };

  return {
    sendMessage,
    isLoading,
    error,
    isConfigured: !!(claude || openai),
    isListening,
    setIsListening,
    needsIndexing,
    lastIndexed,
    triggerDriveIndexing
  };
}

async function generateEmbedding(text: string) {
  // Try to use OpenAI for embeddings first (more reliable for this purpose)
  if (openai) {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float'
      });
      
      return response.data[0].embedding;
    } catch (err) {
      console.error('OpenAI embedding generation failed:', err);
      // Fall through to Claude if OpenAI fails
    }
  }
  
  // Fall back to Claude for embeddings if OpenAI is not available or fails
  if (claude) {
    try {
      // This is a simplified example - in production you'd use the actual Claude embeddings API
      const response = await fetch('https://api.anthropic.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
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
    } catch (err) {
      console.error('Claude embedding generation failed:', err);
      throw new Error('Failed to generate embeddings with any available service');
    }
  }
  
  throw new Error('No embedding service is available');
}