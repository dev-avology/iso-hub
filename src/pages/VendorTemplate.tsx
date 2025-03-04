import React, { useState } from 'react';
import { FileText, Globe, Phone, Mail, Book, Download, ExternalLink, Edit, Save, X } from 'lucide-react';
import type { Vendor, Document, VendorContact } from '../types';

export default function VendorTemplate() {
  const [isEditing, setIsEditing] = useState(false);
  const [vendor, setVendor] = useState<Vendor>({
    id: 'new-vendor',
    name: 'New Vendor',
    logo: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=128&h=128&fit=crop',
    category: 'processor',
    description: 'Enter vendor description here',
    website: 'https://example.com',
    documents: [],
    contacts: [
      {
        name: 'Contact Name',
        role: 'Role',
        email: 'email@example.com',
        phone: '(555) 123-4567'
      }
    ],
    supportUrl: 'https://example.com/support',
    trainingUrl: 'https://example.com/training'
  });

  const [newDocument, setNewDocument] = useState<Document>({
    id: '',
    title: '',
    description: '',
    url: '',
    type: 'pdf',
    uploadedAt: new Date().toISOString(),
    category: 'guide'
  });

  const handleVendorChange = (field: keyof Vendor, value: string) => {
    setVendor(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (index: number, field: keyof VendorContact, value: string) => {
    const updatedContacts = [...vendor.contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setVendor(prev => ({ ...prev, contacts: updatedContacts }));
  };

  const handleAddContact = () => {
    setVendor(prev => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        { name: '', role: '', email: '', phone: '' }
      ]
    }));
  };

  const handleRemoveContact = (index: number) => {
    const updatedContacts = [...vendor.contacts];
    updatedContacts.splice(index, 1);
    setVendor(prev => ({ ...prev, contacts: updatedContacts }));
  };

  const handleDocumentChange = (field: keyof Document, value: string) => {
    setNewDocument(prev => ({ ...prev, [field]: value }));
  };

  const handleAddDocument = () => {
    if (newDocument.title && newDocument.description) {
      const documentToAdd = {
        ...newDocument,
        id: `doc-${Date.now()}`,
        uploadedAt: new Date().toISOString()
      };
      
      setVendor(prev => ({
        ...prev,
        documents: [...prev.documents, documentToAdd]
      }));
      
      setNewDocument({
        id: '',
        title: '',
        description: '',
        url: '',
        type: 'pdf',
        uploadedAt: new Date().toISOString(),
        category: 'guide'
      });
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    setVendor(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to a database
    setIsEditing(false);
    alert('Vendor information saved successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Vendor Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <div className="flex flex-col">
                <input
                  type="text"
                  value={vendor.logo}
                  onChange={(e) => handleVendorChange('logo', e.target.value)}
                  className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Logo URL"
                />
                <img
                  src={vendor.logo}
                  alt={vendor.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              </div>
            ) : (
              <img
                src={vendor.logo}
                alt={vendor.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            )}
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={vendor.name}
                    onChange={(e) => handleVendorChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-bold text-xl"
                    placeholder="Vendor Name"
                  />
                  <textarea
                    value={vendor.description}
                    onChange={(e) => handleVendorChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Vendor Description"
                    rows={2}
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">{vendor.name}</h1>
                  <p className="text-gray-600">{vendor.description}</p>
                </>
              )}
            </div>
          </div>
          <div>
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Edit className="h-5 w-5 mr-2" />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={vendor.website}
                    onChange={(e) => handleVendorChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Support URL</label>
                  <input
                    type="text"
                    value={vendor.supportUrl || ''}
                    onChange={(e) => handleVendorChange('supportUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://example.com/support"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Training URL</label>
                  <input
                    type="text"
                    value={vendor.trainingUrl || ''}
                    onChange={(e) => handleVendorChange('trainingUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://example.com/training"
                  />
                </div>
              </div>
            ) : (
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
                {vendor.supportUrl && (
                  <a
                    href={vendor.supportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>Support Portal</span>
                  </a>
                )}
                {vendor.trainingUrl && (
                  <a
                    href={vendor.trainingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600"
                  >
                    <Book className="h-5 w-5" />
                    <span>Training Resources</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
              {isEditing && (
                <button
                  onClick={handleAddDocument}
                  className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add Document
                </button>
              )}
            </div>

            {isEditing && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">New Document</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newDocument.title}
                      onChange={(e) => handleDocumentChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Document Title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newDocument.type}
                      onChange={(e) => handleDocumentChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="pdf">PDF</option>
                      <option value="doc">Word Document</option>
                      <option value="xls">Excel Spreadsheet</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newDocument.description}
                    onChange={(e) => handleDocumentChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Document Description"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input
                      type="text"
                      value={newDocument.url}
                      onChange={(e) => handleDocumentChange('url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="https://example.com/document.pdf"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newDocument.category}
                      onChange={(e) => handleDocumentChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="agreement">Agreement</option>
                      <option value="guide">Guide</option>
                      <option value="specification">Specification</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {vendor.documents.length > 0 ? (
                vendor.documents.map((document) => (
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
                    <div className="flex items-center space-x-2">
                      <a
                        href={document.url}
                        className="inline-flex items-center p-2 border border-transparent rounded-full text-green-600 hover:text-green-700 focus:outline-none"
                      >
                        <Download className="h-5 w-5" />
                      </a>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveDocument(document.id)}
                          className="inline-flex items-center p-2 border border-transparent rounded-full text-red-600 hover:text-red-700 focus:outline-none"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No documents available. {isEditing && 'Add a document using the form above.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Contact Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
              {isEditing && (
                <button
                  onClick={handleAddContact}
                  className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add Contact
                </button>
              )}
            </div>
            <div className="space-y-6">
              {vendor.contacts.map((contact, index) => (
                <div key={index} className="space-y-2">
                  {isEditing ? (
                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">Contact #{index + 1}</h3>
                        {vendor.contacts.length > 1 && (
                          <button
                            onClick={() => handleRemoveContact(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={contact.name}
                          onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Contact Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                        <input
                          type="text"
                          value={contact.role}
                          onChange={(e) => handleContactChange(index, 'role', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Contact Role"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={contact.phone}
                          onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}