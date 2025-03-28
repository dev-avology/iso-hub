import React, { useEffect, useState } from 'react';
import { FormInput, Eye, Loader2, X } from 'lucide-react';
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

export default function PreApplications() {
  const [forms, setForms] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast.error('Please login to view pre-applications');
      navigate('/login');
      return;
    }
    fetchForms();
  }, [navigate]);

  const fetchForms = async (id?: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jotform/lists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: id ? JSON.stringify({ id: id }) : undefined,
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Street Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Street Address Line 2</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">State/Province</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pincode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {forms.map((form) => (
                  <tr key={form.id} className="hover:bg-zinc-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{form.dba}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{form.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{form.address2}</td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        onClick={() => fetchFormDetails(form.id)}
                        className="text-yellow-400 hover:text-yellow-500 flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-lg p-8 max-w-3xl w-full mx-4 relative max-h-[90vh] overflow-y-auto border border-yellow-400/20">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-yellow-400">Form Details</h2>
              <div className="mt-2 h-1 w-24 bg-yellow-400 mx-auto rounded-full"></div>
            </div>
            
            {isLoadingDetails ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
              </div>
            ) : selectedForm ? (
              <div className="space-y-8">
                {/* Business Information */}
                <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-4">Business Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400">DBA(Doing Business As)</label>
                      <p className="mt-1 text-white font-medium">{selectedForm.dba}</p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-4">Address Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Street Address
                      </label>
                      <p className="mt-1 text-white font-medium">{selectedForm.description}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Street Address Line 2
                      </label>
                      <p className="mt-1 text-white font-medium">{selectedForm.address2}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">City</label>
                      <p className="mt-1 text-white font-medium">{selectedForm.city}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">State</label>
                      <p className="mt-1 text-white font-medium">{selectedForm.state}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Pincode</label>
                      <p className="mt-1 text-white font-medium">{selectedForm.pincode}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Same Shipping Address</label>
                      <p className="mt-1 text-white font-medium">{selectedForm.is_same_shipping_address === '1' ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-4">Status Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Status</label>
                      <span className={`mt-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                        ${selectedForm.status === 0 ? 'bg-yellow-100 text-yellow-800' : 
                          selectedForm.status === 1 ? 'bg-blue-100 text-blue-800' :
                          selectedForm.status === 2 ? 'bg-green-100 text-green-800' : 
                          selectedForm.status === 3 ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {selectedForm.status === 0 ? 'New' : 
                         selectedForm.status === 1 ? 'In Review' :
                         selectedForm.status === 2 ? 'Approved' : 
                         selectedForm.status === 3 ? 'Declined' :
                         'Unknown'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Created At</label>
                      <p className="mt-1 text-white font-medium">{new Date(selectedForm.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Signature Section */}
                <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-4">Signature</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Date Signed</label>
                      <p className="mt-1 text-white font-medium">{selectedForm.signature_date}</p>
                    </div>
                    {selectedForm.signature ? (
                      <div className="mt-4 bg-white p-4 rounded-lg">
                        <img 
                          src={selectedForm.signature} 
                          alt="Signature" 
                          className="max-w-full h-auto mx-auto"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-400">No signature available</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No form details available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}