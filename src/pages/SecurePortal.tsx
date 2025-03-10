import React, { useState, useRef } from 'react';
import { File as FileIcon, X, Download, Trash, Send } from 'lucide-react';

const SecurePortal: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    setUploadedFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    // Reset file input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      setUploadedFiles((prevFiles) => [...prevFiles, ...Array.from(droppedFiles)]);
    }
  };

  const handleRemoveFile = (index: number): void => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSendClick = (): void => {
    setShowPopup(true);
  };

  return (
    <div className='bg-black'>
    <div className="max-w-[100%] w-[80%]  h-[100vh] flex items-center justify-center m-auto ">
      <div className="sec-wrap">
      <div className="choose-wrap flex gap-5">
        {/* Display chosen files */}
        <div className="bg-zinc-900 rounded-lg shadow-xl p-6 border border-yellow-400/20 w-[40%]">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <FileIcon className="h-5 w-5 mr-2 text-yellow-400" />
            Chosen Files
          </h2>
          <div className="text-left text-white/60">
            <div id="uploaded-files" className="mt-4">
              {uploadedFiles.length > 0 ? (
                uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between mb-2">
                    <p className="text-white flex items-center justify-between w-full">Uploaded: {file.name}                     <div 
                      className="remove-file cursor-pointer"
                      onClick={() => handleRemoveFile(idx)}
                    >
                      <X className="text-white" />
                    </div></p>

                  </div>
                ))
              ) : (
                <p className="text-white">No files uploaded yet.</p>
              )}
            </div>
          </div>
          {/* Conditionally render the Send button */}
          {uploadedFiles.length > 0 && (
            <button
              className="bg-yellow-400 rounded py-2 px-6 font-semibold uppercase hover:bg-yellow-600 text-black mt-5"
            >
              Add
            </button>
          )}
        </div>

        {/* Drop zone & file selection area */}
        <div
          className="bg-zinc-900 rounded-lg shadow-xl p-12 border border-yellow-400/20 text-center w-[60%]"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <FileIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <div className="choose-file">
            <h3 className="text-white text-lg font-medium mb-2">
              Drag &amp; Drop files here or
            </h3>
            <p className='text-gray-500 mb-5'>
            This secure portal lets you send a document exchange link to your prospect. Files uploaded here (up to 200 PDF pages) will be automatically deleted after 180 days.
            </p>
            <button
              className="bg-yellow-400 rounded py-2 px-5 font-semibold uppercase hover:bg-yellow-600 text-black"
              onClick={handleBrowseClick}
            >
              Browse
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
        <div className="added-wrap mt-10 text-white">
          <div >
            <div className='group mt-5 w-full px-5 py-3 rounded bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 relative '>
              <p className='uploaded-file-name'>
              <span className='cursor-pointer hover:text-yellow-600'> Filename.zip</span>
              <span className='total-v pl-5 '>(Expired after 180day)</span>
              </p>

              <div className="addedDetail absolute right-[20px] top-[50%] translate-y-[-50%] hidden group-hover:block"  >
                  <ul className='flex gap-4 align-center'>
                    <li className='cursor-pointer hover:text-yellow-600'>
                      <Download/>
                    </li>
                    <li className='cursor-pointer hover:text-red-600'>
                      <Trash/>
                    </li>
                    <li className='cursor-pointer hover:text-yellow-600'>
                      <Send  onClick={handleSendClick}/>
                    </li>
                  </ul>
              </div>

            </div>
            <div className='group mt-5 w-full px-5 py-3 rounded bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 relative '>
              <p className='uploaded-file-name'>
              <span className='cursor-pointer hover:text-yellow-600'> Filename.zip</span>
              <span className='total-v pl-5 '>(Expired after 180day)</span>
              </p>

              <div className="addedDetail absolute right-[20px] top-[50%] translate-y-[-50%] hidden group-hover:block"  >
                  <ul className='flex gap-4 align-center'>
                    <li className='cursor-pointer hover:text-yellow-600'>
                      <Download/>
                    </li>
                    <li className='cursor-pointer hover:text-red-600'>
                      <Trash/>
                    </li>
                    <li className='cursor-pointer hover:text-yellow-600'>
                      <Send  onClick={handleSendClick}/>
                    </li>
                  </ul>
              </div>

            </div>
            <div className='group mt-5 w-full px-5 py-3 rounded bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 relative '>
              <p className='uploaded-file-name'>
              <span className='cursor-pointer hover:text-yellow-600'> Filename.zip</span>
              <span className='total-v pl-5 '>(Expired after 180day)</span>
              </p>

              <div className="addedDetail absolute right-[20px] top-[50%] translate-y-[-50%] hidden group-hover:block"  >
                  <ul className='flex gap-4 align-center'>
                    <li className='cursor-pointer hover:text-yellow-600'>
                      <Download/>
                    </li>
                    <li className='cursor-pointer hover:text-red-600'>
                      <Trash/>
                    </li>
                    <li className='cursor-pointer hover:text-yellow-600'>
                      <Send  onClick={handleSendClick}/>
                    </li>
                  </ul>
              </div>

            </div>
            <div className='group mt-5 w-full px-5 py-3 rounded bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 relative '>
              <p className='uploaded-file-name'>
              <span className='cursor-pointer hover:text-yellow-600'> Filename.zip</span>
              <span className='total-v pl-5 '>(Expired after 180day)</span>
              </p>

              <div className="addedDetail absolute right-[20px] top-[50%] translate-y-[-50%] hidden group-hover:block"  >
                  <ul className='flex gap-4 align-center'>
                    <li className='cursor-pointer hover:text-yellow-600'>
                      <Download/>
                    </li>
                    <li className='cursor-pointer hover:text-red-600'>
                      <Trash/>
                    </li>
                    <li className='cursor-pointer hover:text-yellow-600'>
                      <Send  onClick={handleSendClick}/>
                    </li>
                  </ul>
              </div>

            </div>
            





          </div>
        </div>
      {showPopup && (
        <div className="popup bg-black rounded-lg shadow-xl p-12 border border-yellow-400/20 text-center w-[30%] mx-auto mt-6 absolute top-[50%] left-[50%] transform translate-y-[-50%] translate-x-[-50%]">
          <div
            className="close-pop absolute top-[10px] right-[15px] text-white cursor-pointer"
            onClick={() => setShowPopup(false)}
          >
            <X />
          </div>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            className="w-full px-4 py-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
          <button className="bg-yellow-400 rounded py-3 px-5 font-semibold uppercase hover:bg-yellow-600 text-black mt-5">
            Send To Email
          </button>
        </div>
      )}
      </div>
 </div>

    </div>
  );
};

export default SecurePortal;
