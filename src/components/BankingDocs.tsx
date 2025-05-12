import React, { useState } from "react";

const BankingDocs = () => {
  const [bankingDocs, setBankingDocs] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + "KB",
    }));
    setBankingDocs((prev) => [...prev, ...newDocs]);
  };

  const handleImageRemove = (index) => {
    setBankingDocs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-xs font-medium text-white mb-2">
        Upload your Banking Documents
      </label>

      {/* Upload area */}
      <div
        className="border border-dashed border-gray-500 p-4 text-center rounded-md cursor-pointer bg-gray-900 hover:bg-gray-800"
        onClick={() => document.getElementById("banking-docs-input").click()}
      >
        <input
          type="file"
          id="banking-docs-input"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageChange}
        />
        <div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1828/1828911.png"
            width="24"
            alt="Upload"
            className="mx-auto mb-1"
          />
          <p className="text-sm font-semibold text-white">Browse</p>
          <p className="text-xs text-gray-400">or drag & drop your files</p>
        </div>
      </div>

      {/* Display selected files */}
      {bankingDocs.length > 0 && (
        <div className="mt-4 space-y-2">
          {bankingDocs.map((doc, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 bg-gray-800 px-3 py-2 rounded-md"
            >
              <img
                src={doc.url}
                alt={doc.name}
                className="w-6 h-6 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-sm text-white">{doc.name}</p>
                <p className="text-xs text-gray-400">{doc.size}</p>
              </div>
              <button
                type="button"
                onClick={() => handleImageRemove(index)}
                className="text-red-500 text-sm font-bold"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BankingDocs;
