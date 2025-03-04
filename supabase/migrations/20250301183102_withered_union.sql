/*
  # Add indexing status table

  1. New Tables
    - `indexing_status`
      - `id` (uuid, primary key)
      - `source` (text, e.g., 'google_drive', 'local')
      - `indexed_at` (timestamp)
      - `files_processed` (integer)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `indexing_status` table
    - Add policy for authenticated users to read indexing status
*/

-- Create indexing status table
CREATE TABLE IF NOT EXISTS indexing_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  indexed_at timestamptz NOT NULL,
  files_processed integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE indexing_status ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Allow authenticated users to read indexing status"
  ON indexing_status
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert indexing status"
  ON indexing_status
  FOR INSERT
  TO authenticated
  WITH CHECK (true);