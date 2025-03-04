import React, { useEffect, useState } from 'react';
import { Shield, FileText, Download, Eye, Calendar, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Application, SecureDocument } from '../types';

export default function SecurePortal() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [documents, setDocuments] = useState<SecureDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    if (selectedApp) {
      loadDocuments(selectedApp);
    }
  }, [selectedApp]);

  async function loadApplications() {
    try {
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setApplications(data || []);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  async function loadDocuments(applicationId: string) {
    try {
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from('secure_documents')
        .select(`
          *,
          document_shares!inner(
            application_id,
            access_expires_at
          )
        `)
        .eq('document_shares.application_id', applicationId);

      if (supabaseError) throw supabaseError;
      setDocuments(data || []);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError('Failed to load documents. Please try again later.');
    }
  }

  async function downloadDocument(document: SecureDocument) {
    try {
      setError(null);
      const { data, error: supabaseError } = await supabase.storage
        .from('secure-documents')
        .download(document.file_path);

      if (supabaseError) throw supabaseError;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading document:', err);
      setError('Failed to download document. Please try again later.');
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 bg-yellow-400 rounded-lg p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <Lock className="h-10 w-10 text-black" />
            <div>
              <h1 className="text-3xl font-bold text-black">Secure Document Portal</h1>
              <p className="text-black/80 mt-1">
                Access your confidential documents and application materials securely
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="bg-zinc-900 rounded-lg shadow-xl p-6 border border-yellow-400/20">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-yellow-400" />
              Applications
            </h2>
            {loading ? (
              <div className="text-center py-4 text-white/60">Loading...</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-4 text-white/60">
                No applications found
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app.id)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 border ${
                      selectedApp === app.id
                        ? 'bg-yellow-400/10 border-yellow-400'
                        : 'bg-zinc-800/50 border-transparent hover:bg-zinc-800'
                    }`}
                  >
                    <div className="font-medium text-white">{app.business_name}</div>
                    <div className="text-sm text-yellow-400/80">
                      Submitted: {new Date(app.submitted_at).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Documents List */}
          <div className="lg:col-span-2">
            {selectedApp ? (
              <div className="bg-zinc-900 rounded-lg shadow-xl p-6 border border-yellow-400/20">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-yellow-400" />
                  Shared Documents
                </h2>
                {documents.length === 0 ? (
                  <div className="text-center py-4 text-white/60">
                    No documents available for this application
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-yellow-400/50 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-yellow-400/10 rounded-lg">
                            <FileText className="h-6 w-6 text-yellow-400" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{doc.title}</div>
                            <div className="text-sm text-gray-400">{doc.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => downloadDocument(doc)}
                            className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                            title="Download"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => window.open(doc.file_path, '_blank')}
                            className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                            title="View"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-lg shadow-xl p-12 border border-yellow-400/20 text-center">
                <Lock className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">No Documents Selected</h3>
                <p className="text-gray-400">
                  Select an application from the list to view its secure documents
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}