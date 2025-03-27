import React, { useEffect, useRef, useState } from 'react';
import { FileText, Calendar, Loader2 } from 'lucide-react';
import SignaturePad from 'react-signature-canvas';
import { useSearchParams } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  description: string;
  signature_date: string;
  signature: string;
}

// Add this CSS at the top of the file
const datePickerStyles = `
  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.5;
    cursor: pointer;
  }
`;

export default function JotForm() {
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    description: '',
    signature_date: '',
    signature: ''
  });

  const signatureRef = useRef<SignaturePad>(null);

  const [isValidLink, setIsValidLink] = useState<boolean>(false);
  const [isCheckingLink, setIsCheckingLink] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const data = searchParams.get('data');

  useEffect(() => {
    const checkUniqueString = async () => {
      if (!data) {
        setIsValidLink(false);
        setIsCheckingLink(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/file/check-unique-string/${data}`);
        
        if (response.ok) {
          setIsValidLink(true);
        } else {
          setIsValidLink(false);
          toast.error('Invalid or expired upload link');
        }
      } catch (error) {
        console.error('Error checking link:', error);
        setIsValidLink(false);
        toast.error('Failed to validate upload link');
      } finally {
        setIsCheckingLink(false);
      }
    };

    checkUniqueString();
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      const signaturePad = signatureRef.current;
      const signatureData = signaturePad && !signaturePad.isEmpty() ? signaturePad.toDataURL() : '';

      if (!signatureData) {
        toast.error('Please provide a signature');
        return;
      }

      const finalFormData = {
        ...formData,
        signature: signatureData,
        unique_string: data
      };

      if (!data) {
        toast.error('Invalid upload link');
        return;
      }
  
      setIsSubmitting(true);
      
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jot-froms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalFormData)
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const responseData = await response.json();
      
    
      console.log('Form submission response:', responseData);
      
      toast.success(responseData.message || 'Form submitted successfully!');
      
      // Clear form after successful submission
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        description: '',
        signature_date: '',
        signature: ''
      });
      
      if (signaturePad) {
        signaturePad.clear();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to submit form. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingLink) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Toaster position="top-right" />
        <div className="bg-zinc-900 rounded-lg shadow-xl p-8 border border-yellow-400/20 text-center max-w-md w-full">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">
            Validating Jotfrom link...
          </p>
        </div>
      </div>
    );
  }

  if (!isValidLink) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Toaster position="top-right" />
        <div className="bg-zinc-900 rounded-lg shadow-xl p-8 border border-yellow-400/20 text-center max-w-md w-full">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Invalid Jotform Link
          </h1>
          <p className="text-gray-400 mb-6">
            This Jotform link is invalid or has expired. Please contact your administrator to request a new secure Jotform link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <style>{datePickerStyles}</style>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 bg-yellow-400 rounded-lg p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <FileText className="h-10 w-10 text-black" />
            <div>
              <h1 className="text-3xl font-bold text-black">Jot Form</h1>
              <p className="text-black/80 mt-1">
                Please fill out all required fields below
              </p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-6 rounded-lg border border-yellow-400/20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="signature_date"
                  required
                  value={formData.signature_date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:ring-yellow-400 px-3 py-2"
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Signature
            </label>
            <div className="border border-gray-600 rounded bg-gray-700 p-2">
              <SignaturePad
                ref={signatureRef}
                canvasProps={{
                  className: 'w-full h-40 bg-white rounded'
                }}
              />
            </div>
            <button
              type="button"
              onClick={clearSignature}
              className="mt-2 px-4 py-2 text-sm text-gray-300 hover:text-white"
            >
              Clear Signature
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 bg-yellow-400 text-black rounded-lg font-semibold flex items-center space-x-2
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-500'}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Form</span>
              )}
            </button>
          </div>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
} 