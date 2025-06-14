import { useState } from "react";
import { useGlobalStore } from "../store";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const login = useGlobalStore((e) => e.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { identifier, password });
    login({ identifier, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Login</h2>

        <div>
          <label className="block mb-1 font-medium">Identifier</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
