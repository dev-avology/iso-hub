import React, { useEffect, useState } from 'react';
import { FormInput, Eye, Loader2, X, Copy, CheckCircle, ExternalLink, Send, Copy as Duplicate } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface FormData {
  id: number;
  dba: string;
  description: string;
  address2: string;
  state: string;
  city: string;
  pincode: string;
  status: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  is_same_shipping_address: string;
  signature: string;
  signature_date: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  is_duplicate: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: FormData[];
  errors?: { [key: string]: string[] };
}

interface FormDetailsResponse {
  status: string;
  message: string;
  data: FormData[];
  errors?: { [key: string]: string[] };
}

interface FormDetailsModalProps {
  form: FormData | null;
  onClose: () => void;
}

interface DuplicateFormModalProps {
  form: FormData | null;
  onClose: () => void;
}

function FormDetailsModal({ form, onClose }: FormDetailsModalProps) {
  if (!form) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-8 max-w-3xl w-full mx-4 relative max-h-[90vh] overflow-y-auto border border-yellow-400/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-yellow-400">Form Details</h2>
          <div className="mt-2 h-1 w-24 bg-yellow-400 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-8">
          {/* Business Information */}
          <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">Business Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400">DBA(Doing Business As)</label>
                <p className="mt-1 text-white font-medium">{form.dba}</p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">Address Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400">Street Address</label>
                <p className="mt-1 text-white font-medium">{form.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Street Address Line 2</label>
                <p className="mt-1 text-white font-medium">{form.address2}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">City</label>
                <p className="mt-1 text-white font-medium">{form.city}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">State</label>
                <p className="mt-1 text-white font-medium">{form.state}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Pincode</label>
                <p className="mt-1 text-white font-medium">{form.pincode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Same Shipping Address</label>
                <p className="mt-1 text-white font-medium">{form.is_same_shipping_address === '1' ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">Status Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400">Form Type</label>
                <span className={`mt-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                  ${form.is_duplicate === '1' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {form.is_duplicate === '1' ? 'Replicated' : 'New Form'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Status</label>
                <span className={`mt-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                  ${form.status === 0 ? 'bg-yellow-100 text-yellow-800' : 
                    form.status === 1 ? 'bg-blue-100 text-blue-800' :
                    form.status === 2 ? 'bg-green-100 text-green-800' : 
                    form.status === 3 ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'}`}>
                  {form.status === 0 ? 'New' : 
                   form.status === 1 ? 'In Review' :
                   form.status === 2 ? 'Approved' : 
                   form.status === 3 ? 'Declined' :
                   'Unknown'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Created At</label>
                <p className="mt-1 text-white font-medium">{new Date(form.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
            <h3 className="text-yellow-400 mb-4">Signature</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400">Date</label>
                <p className="mt-1 text-white font-medium">{form.signature_date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Signature</label>
                {form.signature ? (
                  <div className="mt-1 bg-white rounded-lg p-4">
                    <img 
                      src={form.signature} 
                      alt="Signature" 
                      className="max-w-full h-auto mx-auto"
                    />
                  </div>
                ) : (
                  <div className="mt-1 bg-zinc-700 rounded-lg p-4 text-gray-400 text-center">
                    No signature available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DuplicateFormModal({ form, onClose }: DuplicateFormModalProps) {
  const [formData, setFormData] = useState<FormData>(form || {} as FormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prospectEmail, setProspectEmail] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectEmail) {
      toast.error('Please enter prospect email');
      return;
    }
    setIsSubmitting(true);
    try {
      const formDataToSubmit = {
        ...formData,
        email: prospectEmail,
        signature_date: date,
        signature: '',
        is_duplicate: '1'
      };
      
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/duplicate-form-send-mail`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataToSubmit)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to duplicate form');
      }
      console.log(responseData);

      toast.success('Check your email to replicate the form!');
      onClose();
      // window.location.reload(); // Refresh the page to show updated list
    } catch (error) {
      console.error('Error duplicating form:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to duplicate form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-8 max-w-3xl w-full mx-4 relative max-h-[90vh] overflow-y-auto border border-yellow-400/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-yellow-400">Replicate Form</h2>
          <div className="mt-2 h-1 w-24 bg-yellow-400 mx-auto rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Information */}
          <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">Business Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400">DBA(Doing Business As)</label>
                <input
                  type="text"
                  name="dba"
                  value={formData.dba || ''}
                  readOnly
                  onChange={handleChange}
                  className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">Address Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400">Street Address</label>
                <input
                  type="text"
                  name="description"
                  readOnly
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Street Address Line 2</label>
                <input
                  type="text"
                  name="address2"
                  value={formData.address2 || ''}
                  readOnly
                  onChange={handleChange}
                  className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">City</label>
                <input
                  type="text"
                  name="city"
                  readOnly
                  value={formData.city || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state || ''}
                  readOnly
                  onChange={handleChange}
                  className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Pincode</label>
                <input
                  type="number"
                  name="pincode"
                  readOnly
                  value={formData.pincode || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Same Shipping Address</label>
                <select
                  name="is_same_shipping_address"
                  value={formData.is_same_shipping_address || '0'}
                  onChange={(e) => handleChange({ target: { name: 'is_same_shipping_address', value: e.target.value } } as any)}
                  className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
            <h3 className="text-yellow-400 mb-4">Signature</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Signature</label>
                <div className="mt-1 bg-white rounded-lg h-[150px] w-full border border-zinc-300"></div>
              </div>
            </div>
          </div>

          {/* Prospect Email */}
          <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">Prospect Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-400">Prospect Email*</label>
              <input
                type="email"
                value={prospectEmail}
                onChange={(e) => setProspectEmail(e.target.value)}
                placeholder="Enter prospect's email address"
                required
                className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <p className="mt-1 text-sm text-gray-400">The replicated form will be sent to this email address</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Duplicate className="h-4 w-4 mr-2" />
              )}
              Replicate Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PreApplications() {
  const [forms, setForms] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [user , setUser] = useState(null);

  const preAppLink = `${window.location.origin}/jot-forms?data=eyJpdiI6IlVsRnJidStaYVJxZnNhektpZFBLc1E9PSIsInZhbHVlIjoidWNqVTFXNzZEWHN5MjBRWG05SldLMDFZQnE4TVZ2SWxFZ2NMcTBXWDR0VWtjNnZqeU1PbnkwUnNURE5ZQktpVDlmUzFtOW9TSXNZeHQzUE9waUYxd05uQ0JQUDIyNWZqb3dBY1lsdEwwQW89IiwibWFjIjoiZGVkODEwN2Q4OWM4MWY4MjUwZGJiZDZlMjc3YmUzYWFhZGU2MWUzOWQ2ZjRhYzZiMjQ2NzRmY2E2YTM0NWFjMCIsInRhZyI6IiJ9`; // The base URL for your form

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(preAppLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    // if (!token) {
    //   toast.error('Please login to view pre-applications');
    //   navigate('/login');
    //   return;
    // }
    console.log(token,'token');
    fetchForms();
  }, []);

  const fetchForms = async (id?: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      const value = localStorage.getItem("auth_user");
      const parsedUser = value ? JSON.parse(value) : null;
      setUser(parsedUser);
  
      let body = undefined;
  
      // Add user_id to body only if role is NOT 1 or 2
      if (parsedUser && parsedUser.role_id !== 1 && parsedUser.role_id !== 2) {
        body = JSON.stringify({ user_id: parsedUser.id });
      }
      // console.log(body,'body');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jotform/lists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: body
      });

      const responseData: ApiResponse = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          setErrors(responseData.errors || {});
          Object.keys(responseData.errors || {}).forEach((key) => {
            responseData.errors?.[key].forEach((errorMsg: string) => {
              toast.error(errorMsg);
            });
          });
        } else if (response.status === 401) {
          localStorage.removeItem('auth_token');
          toast.error('Session expired. Please login again');
          navigate('/login');
        } else {
          throw new Error(responseData.message || 'Form submission failed');
        }
        return;
      }

      if (responseData.status === 'error') {
        throw new Error(responseData.message || 'Failed to fetch forms');
      }
      
      setForms(responseData.data || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load pre-applications');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFormDetails = async (id: number) => {
    try {
      setIsLoadingDetails(true);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jotform/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseData: FormDetailsResponse = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          setErrors(responseData.errors || {});
          Object.keys(responseData.errors || {}).forEach((key) => {
            responseData.errors?.[key].forEach((errorMsg: string) => {
              toast.error(errorMsg);
            });
          });
        } else if (response.status === 401) {
          localStorage.removeItem('auth_token');
          toast.error('Session expired. Please login again');
          navigate('/login');
        } else {
          throw new Error(responseData.message || 'Form submission failed');
        }
        return;
      }

      if (responseData.status === 'error') {
        throw new Error(responseData.message || 'Failed to fetch form details');
      }
      
      setSelectedForm(responseData.data[0]);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching form details:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load form details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8 bg-yellow-400 rounded-lg p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <FormInput className="h-10 w-10 text-black" />
          <div>
            <h1 className="text-3xl font-bold text-black">Pre-Applications</h1>
            <p className="text-black/80 mt-1">
              Manage and track merchant pre-applications.
            </p>
          </div>
        </div>
      </div>

      {/* Pre-Application Link Section */}
      <div className="bg-zinc-900 rounded-lg shadow-sm p-6 mb-8 border border-yellow-400/20">
        <h2 className="text-lg font-semibold text-white mb-4">Pre-Application Form Link</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1 min-w-0">
            <div className="relative flex items-center">
              <input
                type="text"
                readOnly
                value={preAppLink}
                className="block w-full pr-10 truncate bg-zinc-800 border-zinc-700 text-white rounded-md focus:ring-yellow-400 focus:border-yellow-400"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <a
                  href={preAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-400"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <button
            onClick={copyLink}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
          >
            {copied ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-5 w-5 mr-2" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pre-Application List */}
      <div className="bg-zinc-900 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Pre-Application List</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
          </div>
        ) : forms.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No pre-applications found.</p>
        ) : (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">DBA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">State/Province</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pincode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Replicated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
              <tbody className="bg-zinc-900 divide-y divide-gray-700">
                {forms.map((form) => (
                  <tr key={form.id} className="hover:bg-zinc-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{form.dba}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{form.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{form.state}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{form.pincode}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${form.status === 0 ? 'bg-yellow-100 text-yellow-800' : 
                          form.status === 1 ? 'bg-blue-100 text-blue-800' :
                          form.status === 2 ? 'bg-green-100 text-green-800' : 
                          form.status === 3 ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {form.status === 0 ? 'New' : 
                         form.status === 1 ? 'In Review' :
                         form.status === 2 ? 'Approved' : 
                         form.status === 3 ? 'Declined' :
                         'Unknown'}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${form.is_duplicate === '1' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {form.is_duplicate === '1' ? 'Yes' : 'No'}
                    </span>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => {
                            setSelectedForm(form);
                            setShowDetailsModal(true);
                          }}
                          className="text-yellow-400 hover:text-yellow-500 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedForm(form);
                            setShowDuplicateModal(true);
                          }}
                          className="text-yellow-400 hover:text-yellow-500 flex items-center gap-1"
                        >
                          <Duplicate className="h-4 w-4" />
                          Replicate
                    </button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Form Details Modal */}
      {showDetailsModal && (
        <FormDetailsModal
          form={selectedForm}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedForm(null);
          }}
        />
      )}

      {/* Duplicate Form Modal */}
      {showDuplicateModal && (
        <DuplicateFormModal
          form={selectedForm}
          onClose={() => {
            setShowDuplicateModal(false);
            setSelectedForm(null);
          }}
        />
      )}
    </div>
  );
}