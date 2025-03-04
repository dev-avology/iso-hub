/*
  # Secure Documents Schema

  1. New Tables
    - `applications`
      - Stores pre-application data from JotForm
      - Links to secure documents
    - `secure_documents`
      - Stores document metadata and access controls
      - Links to Supabase Storage for actual files
    - `document_shares`
      - Manages document access for applications
      - Controls which documents are shared with which applications

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure document access based on sharing rules
*/

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jotform_submission_id text UNIQUE NOT NULL,
  business_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Secure documents table
CREATE TABLE IF NOT EXISTS secure_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_path text NOT NULL,
  file_type text NOT NULL,
  category text NOT NULL,
  is_template boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Document shares table
CREATE TABLE IF NOT EXISTS document_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES secure_documents(id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  access_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(document_id, application_id)
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE secure_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;

-- Policies for applications
CREATE POLICY "Users can read applications they created"
  ON applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT created_by
    FROM secure_documents
    WHERE id IN (
      SELECT document_id
      FROM document_shares
      WHERE application_id = applications.id
    )
  ));

-- Policies for secure documents
CREATE POLICY "Users can read documents they created"
  ON secure_documents
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can read shared documents"
  ON secure_documents
  FOR SELECT
  TO authenticated
  USING (id IN (
    SELECT document_id
    FROM document_shares
    WHERE application_id IN (
      SELECT id
      FROM applications
      WHERE email = auth.email()
    )
    AND (access_expires_at IS NULL OR access_expires_at > now())
  ));

-- Policies for document shares
CREATE POLICY "Users can read their document shares"
  ON document_shares
  FOR SELECT
  TO authenticated
  USING (
    document_id IN (
      SELECT id FROM secure_documents WHERE created_by = auth.uid()
    )
    OR
    application_id IN (
      SELECT id FROM applications WHERE email = auth.email()
    )
  );