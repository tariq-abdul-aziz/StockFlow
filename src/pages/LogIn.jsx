import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const LoginIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {login, signup} = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Invalid email and password.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else {
        setError(err.message || "Failed to sign in.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if(!email || !password) {
      setError("Password enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);
      await signup(email, password);
      alert("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email addresss is already in use.");
      } else {
        setError(err.message || "Failed to create account.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex w-screen h-screen">
      <div className="bg-[#045DC9] hidden md:flex md-w-1/2 text-white font-semibold tracking-wide italic text-4xl justify-center items-center">
        <h1>StockFlow</h1>
      </div>
      <div className="w-full md:w-1/2 h-full flex flex-col gap-4 justify-center items-center p-8 sm:p-16 bg-white">
        <div className="w-full md:1/2 h-full flex flex-col gap-4">
        <h1 className="font-bold text-3xl text-gray-900">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-500">Sign in to your account or create a new one.</p>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">
            {error}
          </div>
        )}
         <form className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Email Address</label>
            <input type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Password</label>
            <input type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3 mt-3">
            <button
            type="button"
            onClick={handleLogin}
            disabled={isSubmitting}
            className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-lg text-sm cursor-pointer hover:bg-blue-700 active:scale-95 transition disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Login"}
            </button>
            <button
            type="button"
            onClick={handleSignUp}
            disabled={isSubmitting}
            className="flex-1 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg text-sm cursor-pointer hover:bg-gray-200 active:scale-95 transition disabled:opacity-50"
            >
              Sign Up
            </button>
          </div>
         </form>
        </div>
      </div>
    </div>
  );
};

export default LoginIn;
