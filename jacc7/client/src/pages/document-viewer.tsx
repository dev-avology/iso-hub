import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ArrowLeft, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import type { Document } from '@shared/schema';
import React from 'react';

export default function DocumentViewer() {
  const { documentId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Fetch document metadata - try multiple approaches
  const { data: document, isLoading, error } = useQuery<Document>({
    queryKey: [`/api/documents/${documentId}`],
    enabled: !!documentId,
    retry: 3,
    retryDelay: 1000,
  });

  // Fallback: Get document from documents list if direct fetch fails
  const { data: documentsList } = useQuery({
    queryKey: ["/api/documents"],
    enabled: !!documentId && !document && !isLoading,
  });

  // Find document in the list if direct fetch failed
  const fallbackDocument = React.useMemo(() => {
    if (document) return document;
    if (!documentsList || !documentId) return null;
    
    // Search through all documents in the list
    let allDocuments: any[] = [];
    if (Array.isArray(documentsList)) {
      allDocuments = documentsList;
    } else if ((documentsList as any).documents) {
      allDocuments = (documentsList as any).documents;
    }
    
    return allDocuments.find((doc: any) => doc.id === documentId);
  }, [document, documentsList, documentId]);

  const finalDocument = document || fallbackDocument;

  // Debug logging
  console.log('Document Viewer - Document ID:', documentId);
  console.log('Document Viewer - Document data:', document);
  console.log('Document Viewer - Documents list:', documentsList);
  console.log('Document Viewer - Fallback document:', fallbackDocument);
  console.log('Document Viewer - Final document:', finalDocument);
  console.log('Document Viewer - Loading:', isLoading);
  console.log('Document Viewer - Error:', error);

  // Fetch document content when document metadata is loaded
  useEffect(() => {
    console.log('Document Viewer - useEffect triggered');
    console.log('Document Viewer - finalDocument:', finalDocument);
    console.log('Document Viewer - documentId:', documentId);
    console.log('Document Viewer - mimeType:', finalDocument?.mimeType);
    
    if (finalDocument && documentId) {
      setIsLoadingContent(true);
      console.log('Document Viewer - Setting isLoadingContent to true');
      
      // For text-based documents, fetch the content
      if (finalDocument.mimeType?.includes('text') || finalDocument.mimeType === 'application/pdf') {
        console.log('Document Viewer - Fetching content for text/PDF document');
        fetch(`/api/documents/${documentId}/view`)
          .then(response => {
            if (response.ok) {
              return response.text();
            }
            throw new Error('Failed to fetch document content');
          })
          .then(content => {
            console.log('Document Viewer - Content fetched successfully');
            setDocumentContent(content);
            setIsLoadingContent(false);
          })
          .catch(error => {
            console.error('Error fetching document content:', error);
            setIsLoadingContent(false);
          });
      } else {
        console.log('Document Viewer - Skipping content fetch for non-text document');
        setIsLoadingContent(false);
      }
    }
  }, [finalDocument, documentId]);

  const handleDownload = () => {
    if (!finalDocument) return;
    
    const downloadUrl = `/api/documents/${documentId}/download`;
    const link = window.document.createElement('a');
    link.href = downloadUrl;
    link.download = finalDocument.originalName || finalDocument.name;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);

    toast({
      title: "Download started",
      description: `Downloading ${finalDocument.name}`,
    });
  };

  const handleOpenInNewTab = () => {
    const viewUrl = `/api/documents/${documentId}/view`;
    window.open(viewUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !finalDocument) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Document Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The requested document could not be found.</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => setLocation('/documents')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documents
            </Button>
            {documentId && (
              <Button onClick={() => window.open(`/api/documents/${documentId}/view`, '_blank')} variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Try Direct View
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const getFileIcon = (mimeType?: string) => {
    if (mimeType?.includes('pdf')) return '📄';
    if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel')) return '📊';
    if (mimeType?.includes('document') || mimeType?.includes('word')) return '📝';
    if (mimeType?.includes('image')) return '🖼️';
    return '📁';
  };

  // Debug logging for rendering
  console.log('Document Viewer - Rendering component');
  console.log('Document Viewer - isLoadingContent:', isLoadingContent);
  console.log('Document Viewer - mimeType:', finalDocument?.mimeType);
  console.log('Document Viewer - isImage:', finalDocument?.mimeType?.startsWith('image/'));

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setLocation('/documents')} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {getFileIcon(finalDocument.mimeType)} {finalDocument.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {finalDocument.originalName} • {finalDocument.mimeType?.split('/')[1]?.toUpperCase() || 'Document'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleOpenInNewTab} variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </div>

      {/* Document Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Document Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-100">File Name:</span>
              <p className="text-gray-600 dark:text-gray-400">{finalDocument.originalName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-100">File Type:</span>
              <p className="text-gray-600 dark:text-gray-400">{finalDocument.mimeType}</p>
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-100">Size:</span>
              <p className="text-gray-600 dark:text-gray-400">{finalDocument.size ? `${Math.round(finalDocument.size / 1024)} KB` : 'Unknown'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-100">Uploaded:</span>
              <p className="text-gray-600 dark:text-gray-400">
                {finalDocument.createdAt ? new Date(finalDocument.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
          {(finalDocument as any).notes && (
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-100">Notes:</span>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{(finalDocument as any).notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Viewer */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Document Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full h-[600px] border rounded-b-lg overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
            {isLoadingContent ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading document content...</p>
                </div>
              </div>
            ) : finalDocument.mimeType?.startsWith('image/') ? (
              <div className="flex items-center justify-center h-full">
                {imageLoadError ? (
                  <div className="text-center">
                    <div className="text-4xl mb-4">🖼️</div>
                    <p className="text-gray-600 dark:text-gray-400">Image failed to load</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Use the "Open in New Tab" button to view the image
                    </p>
                  </div>
                ) : (
                  <img
                    src={`/api/documents/${documentId}/view`}
                    alt={finalDocument.name}
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => {
                      console.log('Document Viewer - Image loaded successfully');
                      setImageLoadError(false);
                    }}
                    onError={(e) => {
                      console.error('Document Viewer - Image failed to load:', e);
                      setImageLoadError(true);
                    }}
                  />
                )}
              </div>
            ) : finalDocument.mimeType === 'application/pdf' ? (
              <div className="h-full overflow-auto p-4">
                {documentContent ? (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="mb-4 p-2 bg-blue-50 rounded">
                      <p className="text-sm text-blue-700">
                        <strong>PDF Content Preview:</strong> This is a text representation of the PDF content.
                        For full PDF viewing, use the "Open in New Tab" button above.
                      </p>
                    </div>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {documentContent.substring(0, 5000)}
                      {documentContent.length > 5000 && (
                        <span className="text-gray-500">... (content truncated)</span>
                      )}
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-4xl mb-4">📄</div>
                      <p className="text-gray-600 dark:text-gray-400">
                        PDF content could not be loaded
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        Use the "Open in New Tab" button to view the full PDF
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : finalDocument.mimeType?.includes('text') ? (
              <div className="h-full overflow-auto p-4">
                {documentContent ? (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {documentContent}
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-4xl mb-4">📄</div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Text content could not be loaded
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">📄</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Preview not available for this file type
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Use the download button to view the file
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}