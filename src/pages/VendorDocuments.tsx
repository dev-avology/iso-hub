import React, { useEffect, useState } from 'react';
import { FileText, Globe, Phone, Mail, Book, Download, ExternalLink } from 'lucide-react';
import type { Vendor } from '../types';

// Sample data - in a real app, this would fetch data based on the vendor ID
const vendorData: Record<string, Vendor> = {
  'firstdata': {
    id: 'firstdata',
    name: 'First Data',
    logo: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=128&h=128&fit=crop',
    category: 'processor',
    description: 'Leading global payment technology solutions company',
    website: 'https://firstdata.com',
    documents: [
      {
        id: '1',
        title: 'Merchant Agreement',
        description: 'Standard merchant processing agreement',
        url: '#',
        type: 'pdf',
        uploadedAt: '2024-03-10',
        category: 'agreement'
      },
      {
        id: '2',
        title: 'Integration Guide',
        description: 'Technical integration documentation',
        url: '#',
        type: 'pdf',
        uploadedAt: '2024-03-09',
        category: 'guide'
      }
    ],
    contacts: [
      {
        name: 'John Smith',
        role: 'Account Manager',
        email: 'john.smith@firstdata.com',
        phone: '(555) 123-4567'
      }
    ],
    supportUrl: 'https://firstdata.com/support',
    trainingUrl: 'https://firstdata.com/training'
  },
  'tsys': {
    id: 'tsys',
    name: 'TSYS',
    logo: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=128&h=128&fit=crop',
    category: 'processor',
    description: 'Global payment solutions provider',
    website: 'https://tsys.com',
    documents: [
      {
        id: '1',
        title: 'API Documentation',
        description: 'Complete API integration guide',
        url: '#',
        type: 'pdf',
        uploadedAt: '2024-03-10',
        category: 'guide'
      }
    ],
    contacts: [
      {
        name: 'Jane Doe',
        role: 'Technical Support',
        email: 'jane.doe@tsys.com',
        phone: '(555) 987-6543'
      }
    ],
    supportUrl: 'https://tsys.com/support',
    trainingUrl: 'https://tsys.com/training'
  }
};

export default function VendorDocuments({ vendorId }: { vendorId: string }) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundVendor = vendorData[vendorId];
    if (foundVendor) {
      setVendor(foundVendor);
    } else {
      setError('Vendor not found');
    }
  }, [vendorId]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
            <div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Vendor Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={vendor.logo}
            alt={vendor.name}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{vendor.name}</h1>
            <p className="text-gray-600">{vendor.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={vendor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600"
              >
                <Globe className="h-5 w-5" />
                <span>Website</span>
              </a>
              <a
                href={vendor.supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600"
              >
                <ExternalLink className="h-5 w-5" />
                <span>Support Portal</span>
              </a>
              <a
                href={vendor.trainingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600"
              >
                <Book className="h-5 w-5" />
                <span>Training Resources</span>
              </a>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
            <div className="space-y-4">
              {vendor.documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{document.title}</h3>
                      <p className="text-sm text-gray-500">{document.description}</p>
                    </div>
                  </div>
                  <a
                    href={document.url}
                    className="inline-flex items-center p-2 border border-transparent rounded-full text-green-600 hover:text-green-700 focus:outline-none"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Contact Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              {vendor.contacts.map((contact, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.role}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${contact.email}`} className="hover:text-green-600">
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${contact.phone}`} className="hover:text-green-600">
                      {contact.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}