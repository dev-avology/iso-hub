import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import DashboardWidgets from './components/DashboardWidgets';
import Logins from './pages/Logins';
import DocumentCenter from './pages/DocumentCenter';
import VendorDocuments from './pages/VendorDocuments';
import VendorTemplate from './pages/VendorTemplate';
import PreApplications from './pages/PreApplications';
import SecurePortal from './pages/SecurePortal';
import JACC from './components/JACC';
import LogIn from './pages/logins/login';
import Users from './pages/users/users';
import AddUsers from './pages/users/addUsers';
import { LayoutDashboard } from 'lucide-react';
import EditUsers from './pages/users/editUser';
import Admin from './pages/admin/admin';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import TeamMember  from './pages/team-member/teamMember';
import Vendor  from './pages/Vendor/vendor';
import Documents from './pages/Documents/documents';
import Reps from './pages/Reps/reps'
import Notifications from './pages/notifications/notifications';


function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname.replace(/\/$/, ''));

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname.replace(/\/$/, ''));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LogIn />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="max-w-7xl mx-auto">
                    {currentPath === '/logins' ? (
                      <Logins />
                    ) : currentPath === '/users' ? (
                      <Users />
                    ): currentPath === '/admin' ? (
                      <Admin />
                    ): currentPath === '/addusers' ? (
                      <AddUsers />
                    ): currentPath === '/teammember' ? (
                      <TeamMember />
                    ): currentPath === '/vendor' ? (
                      <Vendor />
                    ): currentPath === '/master_database_documents' ? (
                      <Documents />
                    ): currentPath === '/all_reps' ? (
                      <Reps />
                    ): currentPath === '/application_notifications' ? (
                      <Notifications />
                    ): currentPath === '/edituser' ? (
                      <EditUsers />
                    ): currentPath === '/documents' ? (
                      <DocumentCenter />
                    ): currentPath === '/documents/new-vendor' ? (
                      <VendorTemplate />
                    ) : currentPath.startsWith('/documents/') ? (
                      <VendorDocuments vendorId={currentPath.split('/')[2]} />
                    ) : currentPath === '/applications' ? (
                      <PreApplications />
                    ) : currentPath === '/secure' ? (
                      <SecurePortal />
                    ) : (
                      <>
                        <div className="mb-8 bg-yellow-400 rounded-lg p-6 shadow-lg">
                          <div className="flex items-center space-x-3">
                            <LayoutDashboard className="h-10 w-10 text-black" />
                            <div>
                              <h2 className="text-3xl font-bold text-black">Dashboard</h2>
                              <p className="text-black/80 mt-1">
                                Welcome back! Here's an overview of your ISO Hub.
                              </p>
                            </div>
                          </div>
                        </div>
                        <DashboardWidgets />
                      </>
                    )}
                  </div>
                  <JACC />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;