
import { FileText } from 'lucide-react';
export default function DocumentCenter() {


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 bg-yellow-400 rounded-lg p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <FileText className="h-10 w-10 text-black" />
          <div>
            <h1 className="text-3xl font-bold text-black">Document Center</h1>
            <p className="text-black/80 mt-1">
            You can connect multiple drives (e.g., two Google Drives).
            </p>
          </div>
        </div>
      </div>

      <div className="drive-integrations flex items-center gap-4 ">
            <div className="drive-bx">
                <a href="javascript:(0)" className='w-fit bg-white rounded py-3 px-5 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black'>Connect Google Drive</a>
            </div>
            <div className="drive-bx">
                <a href="javascript:(0)" className='w-fit bg-white rounded py-3 px-5 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black'> Connect DropBox</a>
            </div>
            <div className="drive-bx">
                <a href="javascript:(0)" className='w-fit bg-white rounded py-3 px-5 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black'>Connect OneDrive</a>
            </div>
      </div>



    </div>
  );
}