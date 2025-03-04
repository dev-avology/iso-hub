import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get relevant documents from vector store
    const { data: documents, error: searchError } = await supabaseClient.rpc(
      'match_documents',
      {
        query_embedding: await generateEmbedding(message),
        match_threshold: 0.7,
        match_count: 5,
      }
    );

    if (searchError) throw searchError;

    // Prepare context from matched documents
    const context = documents
      .map((doc) => `${doc.content}`)
      .join('\n\n');

    // Generate response using Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('CLAUDE_API_KEY') ?? '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
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
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const claudeResponse = await response.json();

    return new Response(
      JSON.stringify({
        response: claudeResponse.content[0].text
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generateEmbedding(text: string) {
  const response = await fetch('https://api.anthropic.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': Deno.env.get('CLAUDE_API_KEY') ?? '',
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