import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { Eye, EyeOff } from "lucide-react"; // Add this at the top

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowLogin, setShouldShowLogin] = useState(false);
  const [urlParams] = useState(new URLSearchParams(window.location.search));
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false); // Add this with your other state hooks

  // Get the redirect path from location state or default to home
  const from = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
    const cipher = urlParams.get('secX');
    const iv = urlParams.get('secY');
    
    if (cipher && iv) {
      setIsLoading(true);
      handleSpecialLogin(cipher, iv);
    } else {
      setShouldShowLogin(true);
    }
  }, [urlParams]);

  const handleSpecialLogin = async (cipher: string, iv: string) => {
    try {
      // const response = await fetch('https://phpstack-1180784-5314741.cloudwaysapps.com/api/decrypt/cred', {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/decrypt/cred`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ cipher, iv }),
      });

      if (!response.ok) {
        console.error('Decrypt response not ok:', response.status);
        return;
      }

      const data = await response.json();
      const [email, pass] = data.decrypted.split(':');
      
      if (email && pass) {
        const is_tracer_user = "1";
        const new_pass = '123456'; // formality 

        await login(email, new_pass, is_tracer_user);
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Special login error:', error);
      setIsLoading(false);
      setShouldShowLogin(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!shouldShowLogin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-zinc-900 p-10 rounded-lg shadow-lg w-full max-w-md ">
        <div className="pb-6 mb-6 border-b border-yellow-400/20">
          <div className="flex items-center justify-center space-x-2">
             <img src="ISOHubLOGO.png" alt="" style={{ maxWidth: '40%' }} />
          </div>
          <div className="mt-1 text-center text-xs text-yellow-400/60">
            Secure Document Management
          </div>
        </div>

        {/* <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2> */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block font-medium text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder=""
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder=""
                className="w-full px-4 py-2 pr-10 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-yellow-400 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded font-medium uppercase transition duration-200 dsabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
