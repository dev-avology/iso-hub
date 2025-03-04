export interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType;
}

export interface ProcessorGateway {
  name: string;
  logo: string;
  category: 'processor' | 'gateway' | 'hardware';
  url: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'calendar' | 'analytics' | 'tasks' | 'notifications';
  content: React.ReactNode;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'pdf' | 'doc' | 'xls' | 'other';
  uploadedAt: string;
  category: 'agreement' | 'guide' | 'specification' | 'other';
}

export interface VendorContact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Vendor {
  id: string;
  name: string;
  logo: string;
  category: 'processor' | 'gateway' | 'hardware' | 'internal' | 'misc';
  description: string;
  website: string;
  documents: Document[];
  contacts: VendorContact[];
  supportUrl?: string;
  trainingUrl?: string;
}

export interface Application {
  id: string;
  jotform_submission_id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  status: 'new' | 'in_review' | 'approved' | 'declined';
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface SecureDocument {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_type: string;
  category: string;
  is_template: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentShare {
  id: string;
  document_id: string;
  application_id: string;
  access_expires_at: string | null;
  created_at: string;
}

export interface VendorFormData {
  name: string;
  category: 'processor' | 'gateway' | 'hardware' | 'internal' | 'misc';
  website: string;
  description: string;
  logo?: string;
  contacts: VendorContact[];
  supportUrl?: string;
  trainingUrl?: string;
}