import { useState } from "react";
import { Gift, Send } from "lucide-react";
import {toast,Toaster} from "react-hot-toast";
import BirthdayNotification from "../components/BirthdayNotification";

const BirthdayNotify = () => {
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);

  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-tracer-green/20 rounded-full">
              <Gift className="w-8 h-8 text-tracer-green" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Birthday Notifications</h1>
              <p className="text-gray-600">Send birthday wishes to all users</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-lg">
          <div className="text-center">
            <div className="mb-6">
              <div className="p-4 bg-tracer-green/10 rounded-full inline-block mb-4">
                <Gift className="w-12 h-12 text-tracer-green" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Send Notification to All Users
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Create and send birthday wishes to all users in the system. Your message will be delivered via email notification.
              </p>
            </div>

            <button
              onClick={() => setIsBirthdayModalOpen(true)}
              className="bg-tracer-green hover:bg-tracer-blue text-white font-semibold py-4 px-8 rounded-lg transition-colors flex items-center gap-3 mx-auto"
            >
              <Send className="w-5 h-5" />
              Create Birthday Notification
            </button>

            <div className="mt-8 text-sm text-gray-500">
              <p>💡 Tip: Make your birthday messages personal and engaging!</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        {/* <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">How it works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-tracer-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-tracer-green font-bold">1</span>
              </div>
              <h4 className="text-gray-800 font-medium mb-2">Write Message</h4>
              <p className="text-gray-600 text-sm">Compose your birthday message in the notification form</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-tracer-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-tracer-green font-bold">2</span>
              </div>
              <h4 className="text-gray-800 font-medium mb-2">Preview & Send</h4>
              <p className="text-gray-600 text-sm">Review your message and send it to all users</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-tracer-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-tracer-green font-bold">3</span>
              </div>
              <h4 className="text-gray-800 font-medium mb-2">Delivered</h4>
              <p className="text-gray-600 text-sm">Users receive the birthday notification via email</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Birthday Notification Modal */}
      <BirthdayNotification 
        isOpen={isBirthdayModalOpen} 
        onClose={() => setIsBirthdayModalOpen(false)} 
      />
    </div>
    </>
  );
};

export default BirthdayNotify;
