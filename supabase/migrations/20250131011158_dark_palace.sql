/*
  # Add document embeddings for JACC AI assistant

  1. New Tables
    - `document_embeddings`
      - `id` (bigint, primary key)
      - `content` (text)
      - `embedding` (vector(1536))
      - `file_path` (text)
      - `file_type` (text)
      - `created_at` (timestamptz)

  2. Extensions
    - Enable `vector` extension for embeddings support

  3. Security
    - Enable RLS on `document_embeddings` table
    - Add policy for authenticated users to read embeddings
*/

-- Enable vector extension
create extension if not exists vector;

-- Create document embeddings table
create table if not exists document_embeddings (
  id bigint generated always as identity primary key,
  content text,
  embedding vector(1536),
  file_path text,
  file_type text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create vector similarity search index
create index if not exists document_embeddings_embedding_idx 
on document_embeddings 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Enable RLS
alter table document_embeddings enable row level security;

-- Add RLS policies
create policy "Allow authenticated users to read document embeddings"
  on document_embeddings
  for select
  to authenticated
  using (true);

-- Create vector similarity search function
create or replace function match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    1 - (embedding <=> query_embedding) as similarity
  from document_embeddings
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;