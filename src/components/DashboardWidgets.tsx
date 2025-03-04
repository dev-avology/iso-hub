import React from 'react';
import { Calendar, BarChart2, CheckSquare, Bell, FileText, FormInput } from 'lucide-react';

export default function DashboardWidgets() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Calendar Widget */}
      <div className="bg-zinc-900 rounded-lg shadow-xl p-6 border border-yellow-400/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Calendar</h3>
          <Calendar className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
            <p className="text-sm text-gray-300">Client Meeting - 2:00 PM</p>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
            <p className="text-sm text-gray-300">Team Sync - 4:30 PM</p>
          </div>
        </div>
      </div>

      {/* Analytics Widget */}
      <div className="bg-zinc-900 rounded-lg shadow-xl p-6 border border-yellow-400/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Analytics</h3>
          <BarChart2 className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Document Usage</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Applications</span>
              <span>60%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tasks Widget */}
      <div className="bg-zinc-900 rounded-lg shadow-xl p-6 border border-yellow-400/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Top Tasks</h3>
          <CheckSquare className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <input type="checkbox" className="h-4 w-4 text-yellow-400 rounded border-gray-600 focus:ring-yellow-400 bg-zinc-800" />
            <span className="ml-3 text-sm text-gray-300">Review pending applications</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="h-4 w-4 text-yellow-400 rounded border-gray-600 focus:ring-yellow-400 bg-zinc-800" />
            <span className="ml-3 text-sm text-gray-300">Upload client documents</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="h-4 w-4 text-yellow-400 rounded border-gray-600 focus:ring-yellow-400 bg-zinc-800" />
            <span className="ml-3 text-sm text-gray-300">Schedule follow-up calls</span>
          </div>
        </div>
      </div>

      {/* Notifications Widget */}
      <div className="bg-zinc-900 rounded-lg shadow-xl p-6 border border-yellow-400/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          <Bell className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-yellow-400/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-yellow-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">New document uploaded</p>
              <p className="text-sm text-gray-400">Client: ABC Corp</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-yellow-400/10 flex items-center justify-center">
                <FormInput className="h-4 w-4 text-yellow-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Application submitted</p>
              <p className="text-sm text-gray-400">From: John Doe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}