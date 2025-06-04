import React, { useState, useEffect } from "react";
import {
  Shield,
  DollarSign,
  Users,
  FileText,
  Lock,
  Sparkles,
  Calendar,
  CheckCircle,
  Presentation,
} from "lucide-react";
import PitchDeck from "../components/PitchDeck";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function LandingPage() {
  const [showPitchDeck, setShowPitchDeck] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if we're on the landing page (/) and have a token
    const token = localStorage.getItem("auth_token");
    if (token && location.pathname === "/") {
      navigate("/logins");
    }
  }, [navigate, location]);

  const handleGetStarted = () => {
    // Open Calendly in a new tab
    window.open("https://calendly.com/your-calendar", "_blank");
  };

  const handleDashboard = () => {
    navigate("/login"); // redirect to login
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Version Toggle - for demo purposes */}
      <div className="fixed top-4 right-4 flex space-x-2 z-50">
        <button
          onClick={() => setShowPitchDeck(true)}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
        >
          <Presentation className="h-5 w-5" />
        </button>
      </div>

      {showPitchDeck && <PitchDeck onClose={() => setShowPitchDeck(false)} />}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute bg-gradient-to-br from-yellow-400/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <img src="ISOHubLOGO.png" alt="" style={{ maxWidth: '12%' }} />

              {/* <Shield className="h-12 w-12 text-yellow-400" /> */}
              {/* <h1 className="text-4xl font-bold text-white ml-3">
                
                
              </h1> */}
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Streamline Your ISO Operations
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The all-in-one platform for Independent Sales Organizations to
              manage documents, process applications, and grow their merchant
              portfolio.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <a
                href="#calender"
                className="inline-flex items-center px-6 py-3 text-lg font-medium text-black bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-colors duration-200"
              >
                Book a Demo
                <Calendar className="ml-2 h-5 w-5" />
              </a>
              <button
                onClick={handleDashboard}
                className="inline-flex items-center px-6 py-3 text-lg font-medium text-yellow-400 bg-yellow-400/10 rounded-lg hover:bg-yellow-400/20 transition-colors duration-200 border border-yellow-400/20"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="py-24 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              See ISOHub in Action
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Watch how ISOHub can transform your document management and
              streamline your operations.
            </p>
          </div>

          <div className="relative w-full max-w-4xl mx-auto bg-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="w-full h-[500px] bg-zinc-800 flex items-center justify-center">
              {" "}
              {/* height can be adjusted */}
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="ISOHub Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Powerful tools and features designed specifically for ISOs and
              merchant services providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Document Management */}
            <div className="bg-zinc-800 rounded-xl p-6 border border-yellow-400/20">
              <div className="h-12 w-12 bg-yellow-400/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Document Management
              </h3>
              <p className="text-gray-400">
                Centralize all your processor agreements, gateway documentation,
                and hardware guides in one secure location.
              </p>
            </div>

            {/* AI Assistant */}
            <div className="bg-zinc-800 rounded-xl p-6 border border-yellow-400/20">
              <div className="h-12 w-12 bg-yellow-400/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                AI-Powered Assistant
              </h3>
              <p className="text-gray-400">
                Get instant answers about processor requirements, integration
                guides, and hardware specifications.
              </p>
            </div>

            {/* Secure Portal */}
            <div className="bg-zinc-800 rounded-xl p-6 border border-yellow-400/20">
              <div className="h-12 w-12 bg-yellow-400/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Secure Document Portal
              </h3>
              <p className="text-gray-400">
                Share sensitive documents with merchants securely and maintain
                complete access control.
              </p>
            </div>

            {/* Pre-Applications */}
            <div className="bg-zinc-800 rounded-xl p-6 border border-yellow-400/20">
              <div className="h-12 w-12 bg-yellow-400/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Pre-Application System
              </h3>
              <p className="text-gray-400">
                Streamline merchant onboarding with digital pre-applications and
                automated workflows.
              </p>
            </div>

            {/* Revenue Tracking */}
            <div className="bg-zinc-800 rounded-xl p-6 border border-yellow-400/20">
              <div className="h-12 w-12 bg-yellow-400/10 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Revenue Tracking
              </h3>
              <p className="text-gray-400">
                Monitor your portfolio performance and track residual income
                across all processors.
              </p>
            </div>

            {/* Compliance */}
            <div className="bg-zinc-800 rounded-xl p-6 border border-yellow-400/20">
              <div className="h-12 w-12 bg-yellow-400/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Compliance Tools
              </h3>
              <p className="text-gray-400">
                Stay compliant with built-in tools for document retention and
                audit trails.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section with Calendar */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose ISOHub?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Built specifically for ISOs, our platform helps you save time,
              reduce costs, and grow your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {[
                "Centralize all processor and gateway documentation",
                "Reduce time spent searching for information",
                "Streamline merchant onboarding process",
                "Ensure document security and compliance",
                "Track portfolio performance in real-time",
                "Access AI-powered support 24/7",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                  <span className="ml-3 text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="bg-zinc-800 rounded-xl p-8 border border-yellow-400/20">
              <h3 id="calender" className="text-2xl font-bold text-white mb-4">
                Schedule a Demo
              </h3>
              <p className="text-gray-400 mb-6">
                See how ISOHub can transform your operations with a personalized
                demo.
              </p>

              {/* Calendar Embed Container */}
              <div className="w-full bg-zinc-900/50 rounded-lg mb-6">
                <iframe
                  src="https://api.leadconnectorhq.com/widget/booking/w81N45IZKBMP1TwyhPbW"
                  style={{
                    width: "100%",
                    height: "690px",
                    border: "none",
                    overflow: "hidden",
                  }}
                  scrolling="yes"
                  id="w81N45IZKBMP1TwyhPbW_1747062225604"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="py-24 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Have questions? We're here to help. Fill out the form below and
              we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/XlJsv8aFfLYN18CDgQub"
              scrolling="no"
              style={{
                width: "100%",
                height: "641px",
                border: "none",
                borderRadius: "4px",
              }}
              id="inline-XlJsv8aFfLYN18CDgQub"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Contact Us"
              data-height="700"
              data-layout-iframe-id="inline-XlJsv8aFfLYN18CDgQub"
              data-form-id="XlJsv8aFfLYN18CDgQub"
              title="Contact Us"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-yellow-400/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
               <img src="ISOHubLOGO.png" alt="" style={{ maxWidth: '12%' }} />
              {/* <Shield className="h-8 w-8 text-yellow-400" />
              <span className="ml-2 text-xl font-bold text-white">
                ISO<span className="text-yellow-400">Hub</span>
              </span> */}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-400">
              <Link to="/privacy-policy" className="hover:text-white underline">
                Privacy Policy
              </Link>
              <span>
                © {new Date().getFullYear()} ISOHub. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Load the form embed script */}
      <script
        src="https://link.msgsndr.com/js/form_embed.js"
        type="text/javascript"
      ></script>
    </div>
  );
}
