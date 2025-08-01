import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyDocumentsPage from "./my-documents-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
// import { DraggableDocument } from "@/components/draggable-document"; // REMOVED
// import { DroppableFolder } from "@/components/droppable-folder"; // REMOVED

import { apiRequest } from "@/lib/queryClient";
import { Search, FileText, Folder, Trash2, ArrowLeft, Home, Plus, FolderPlus, User as UserIcon } from "lucide-react";
import type { Document, Folder as FolderType, User as UserType } from "@shared/schema";

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("blue");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data to determine role
  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/user"],
  });

  // Fetch documents and folders with loading states
  const { data: documentsData, isLoading: documentsLoading, error: documentsError } = useQuery({
    queryKey: ["/api/documents"],
  });

  const { data: foldersData = [], isLoading: foldersLoading, error: foldersError } = useQuery<FolderType[]>({
    queryKey: ["/api/folders"],
  });

  // Debug logging to see what the API returns
  console.log('Documents API Response:', documentsData);
  console.log('Folders API Response:', foldersData);
  console.log('API Response Type:', typeof documentsData);
  console.log('API Response Keys:', documentsData ? Object.keys(documentsData) : 'No data');
  console.log('Is Array:', Array.isArray(documentsData));

  // Extract folders from the documents API response or fallback to folders API
  const folders = (documentsData as any)?.folders || foldersData;
  
  // Use API total count as fallback if folders array is empty
  const totalFoldersCount = folders.length > 0 
    ? folders.length 
    : (documentsData as any)?.totalFolders || 0;

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.role === 'dev-admin' || user?.role === 'client-admin';
  


  // Extract documents from API response - handle the integrated format
  let documents: any[] = [];
  
  if (documentsData) {
    console.log('Processing documents data:', documentsData);
    
    if (Array.isArray(documentsData)) {
      // API returns array format directly
      documents = documentsData;
      console.log('Documents as array:', documents.length);
    } else if ((documentsData as any).documents && Array.isArray((documentsData as any).documents)) {
      // API returns object with documents property (current structure)
      documents = (documentsData as any).documents;
      console.log('Documents from documents property:', documents.length);
    } else if ((documentsData as any).folders && Array.isArray((documentsData as any).folders)) {
      // API returns integrated format with folders containing documents
      // Extract all documents from all folders
      documents = [];
      (documentsData as any).folders.forEach((folder: any) => {
        if (folder.documents && Array.isArray(folder.documents)) {
          documents = documents.concat(folder.documents);
        }
      });
      
      // Also add unassigned documents if they exist
      if ((documentsData as any).unassignedDocuments && Array.isArray((documentsData as any).unassignedDocuments)) {
        documents = documents.concat((documentsData as any).unassignedDocuments);
      }
      console.log('Documents from folders structure:', documents.length);
    } else {
      // Try to find documents in any property
      console.log('No standard structure found, checking all properties:', Object.keys(documentsData));
      for (const key in documentsData) {
        if (Array.isArray((documentsData as any)[key])) {
          const array = (documentsData as any)[key];
          if (array.length > 0 && array[0].id && (array[0].name || array[0].originalName)) {
            documents = array;
            console.log('Found documents in property:', key, documents.length);
            break;
          }
        }
      }
    }
    
    // Filter documents based on user role
    documents = documents.filter((doc: any) => {
      if (isAdmin) return true; // Admins see all documents
      return !doc.adminOnly && !doc.admin_only; // Regular users only see non-admin documents
    });
    
    console.log('Final filtered documents:', documents.length);
    console.log('Sample document:', documents[0]);
  }

  // Map the document structure to ensure consistent field names
  const normalizedDocuments = documents.map((doc: any) => ({
    ...doc,
    folderId: doc.folder_id || doc.folderId,
    adminOnly: doc.admin_only || doc.adminOnly
  }));

  // Use API total count as fallback if documents array is empty
  const totalDocumentsCount = normalizedDocuments.length > 0 
    ? normalizedDocuments.length 
    : (documentsData as any)?.totalDocuments || 0;

  // Debug logging for counts
  console.log('Normalized Documents Count:', normalizedDocuments.length);
  console.log('API Total Documents:', (documentsData as any)?.totalDocuments);
  console.log('Final Total Count:', totalDocumentsCount);
  console.log('Folders Count:', folders.length);
  console.log('API Total Folders:', (documentsData as any)?.totalFolders);
  console.log('Final Folders Count:', totalFoldersCount);

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document deleted",
        description: "The document has been successfully removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Document move mutation for drag-and-drop
  const moveMutation = useMutation({
    mutationFn: async ({ documentId, folderId }: { documentId: string; folderId: string }) => {
      return await apiRequest('PATCH', `/api/documents/${documentId}/move`, { folderId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Move failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: async (folderData: { name: string; color: string }) => {
      const response = await apiRequest('POST', '/api/folders', {
        name: folderData.name,
        color: folderData.color,
        folderType: 'custom',
        vectorNamespace: `folder_${folderData.name.toLowerCase().replace(/\s+/g, '_')}`
      });
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/folders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      setIsCreateFolderDialogOpen(false);
      setNewFolderName('');
      setNewFolderColor('blue');
      toast({
        title: "Folder Created",
        description: `Folder "${data.name}" has been created successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleDocumentMove = async (documentId: string, targetFolderId: string) => {
    await moveMutation.mutateAsync({ documentId, folderId: targetFolderId });
  };

  const handlePreviewDocument = (document: Document) => {
    // Navigate to document viewer page
    window.location.href = `/documents/${document.id}`;
  };

  const handleDownloadDocument = (doc: Document) => {
    const downloadUrl = `/api/documents/${doc.id}/download`;
    const link = window.document.createElement('a');
    link.href = downloadUrl;
    link.download = doc.originalName || doc.name;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: `Downloading ${doc.originalName || doc.name}`,
    });
  };

  const filteredDocuments = normalizedDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.originalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('Search query:', searchQuery);
  console.log('Normalized documents:', normalizedDocuments.length);
  console.log('Filtered documents:', filteredDocuments.length);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <span className="text-muted-foreground">/</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Documents</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
            <p className="text-muted-foreground">
              Upload and organize your merchant services documents for instant search in Tracer
            </p>
          </div>
          {user && (
            <div className="text-right">
              <div className="text-sm font-medium">
                {isAdmin ? 'Administrator View' : 'User View'}
              </div>
              <div className="text-xs text-muted-foreground">
                {isAdmin ? 'Viewing all documents' : 'Viewing permitted documents only'}
              </div>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="folders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="folders">
            <Folder className="h-4 w-4 mr-2" />
            Folders ({totalFoldersCount})
          </TabsTrigger>
          <TabsTrigger value="my-documents">
            <UserIcon className="h-4 w-4 mr-2" />
            My Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-documents" className="space-y-4">
          <MyDocumentsPage />
        </TabsContent>



        <TabsContent value="folders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Folder Organization</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Organize your documents into folders for better management
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Total Documents: {totalDocumentsCount} document{totalDocumentsCount !== 1 ? 's' : ''}
                  </p>
                </div>
                {isAdmin && (
                  <Button
                    onClick={() => setIsCreateFolderDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <FolderPlus className="h-4 w-4" />
                    Create Folder
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!foldersLoading && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Drag & Drop Instructions</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    • Drag documents from the "Documents" tab to any folder below to organize them
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    • Folders will highlight when you can drop documents into them
                  </p>
                </div>
              )}
              
              {foldersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading folders...</p>
                </div>
              ) : foldersError ? (
                <div className="text-center py-8">
                  <Folder className="mx-auto h-12 w-12 text-red-400" />
                  <h3 className="mt-2 text-sm font-semibold text-red-600">Error loading folders</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Please try refreshing the page or contact support if the issue persists.
                  </p>
                </div>
              ) : folders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {folders.map((folder: any) => {
                    // Get documents for this folder from the documents array
                    const folderDocuments = normalizedDocuments.filter(doc => 
                      doc.folderId === folder.id || doc.folder_id === folder.id
                    );
                    
                    // Calculate document count more robustly - prioritize server count, then client count
                    const serverCount = folder.document_count || folder.documentCount || 0;
                    const clientCount = folderDocuments.length;
                    const documentCount = serverCount > 0 ? serverCount : clientCount;
                    
                    // Debug logging
                    console.log(`Folder ${folder.name}:`, {
                      folderId: folder.id,
                      serverCount,
                      clientCount,
                      finalCount: documentCount,
                      documents: folderDocuments.map(d => ({ id: d.id, name: d.name || d.originalName }))
                    });
                    
                    return (
                      <Card key={folder.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Folder className="h-8 w-8 text-blue-500" />
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                {folder.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {documentCount} document{documentCount !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Folder className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No folders available</h3>
                  <p className="text-sm text-muted-foreground">
                    Folders will be created automatically when you upload documents.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Create a new folder to organize your documents
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="folder-color">Folder Color</Label>
              <Select value={newFolderColor} onValueChange={setNewFolderColor}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose folder color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">🔵 Blue</SelectItem>
                  <SelectItem value="green">🟢 Green</SelectItem>
                  <SelectItem value="yellow">🟡 Yellow</SelectItem>
                  <SelectItem value="red">🔴 Red</SelectItem>
                  <SelectItem value="purple">🟣 Purple</SelectItem>
                  <SelectItem value="orange">🟠 Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateFolderDialogOpen(false);
                setNewFolderName('');
                setNewFolderColor('blue');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (newFolderName.trim()) {
                  createFolderMutation.mutate({
                    name: newFolderName.trim(),
                    color: newFolderColor
                  });
                }
              }}
              disabled={!newFolderName.trim() || createFolderMutation.isPending}
            >
              {createFolderMutation.isPending ? (
                <>
                  <Plus className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Folder
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
}