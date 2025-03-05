import React from 'react';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-zinc-900 p-10 rounded-lg shadow-lg w-full max-w-md ">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="email"
              id="email"
              placeholder=""
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder=""
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded font-medium uppercase transition duration-200"
          >
            Login
          </button>
        </form>


      </div>
    </div>
  );
}
