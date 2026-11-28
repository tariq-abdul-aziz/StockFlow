import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoginIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [unverifiedUser, setUnverifiedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup, logout, verifyEmail, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setError("");
      setInfoMessage("");
      setUnverifiedUser(null);
      setIsSubmitting(true);

      const userCredential = await login(email, password);
      await userCredential.user.reload();

      if (!userCredential.user.emailVerified) {
        setUnverifiedUser(userCredential.user);
        setError(
          "Your email is not verified yet. Please check your inbox (and spam folder) for the verification link.",
        );
        await logout();
        return;
      }
      localStorage.removeItem("defaultInvoiceNotes");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
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
    if (!email || !password) {
      setError("Password enter both email and password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setError("");
      setInfoMessage("");
      setUnverifiedUser(null);
      setIsSubmitting(true);

      const userCredential = await signup(email, password);
      await verifyEmail(userCredential.user);
      await logout();

      setInfoMessage(
        `Verification link sent to ${email}. Please verify your email before logging in.`,
      );
      setPassword("");
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

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError(
        "Please enter your email address above first, then click Forgot Password.",
      );
      setInfoMessage("");
      return;
    }

    try {
      setError("");
      setInfoMessage("");
      setUnverifiedUser(null);
      setIsSubmitting(true);

      await resetPassword(email.trim());
      setInfoMessage(
        `Password reset link sent to ${email.trim()}. Check your inbox (and spam folder) to set a new password.`,
      );
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-email") {
        setError("Please enter a valid emailaddress.");
      } else if (err.code === "auth/too-many-requests") {
        setError(
          "Too many requests. Please wait a minute before trying again.",
        );
      } else {
        setError(err.message || "Failed to send password reset email.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email || !password || isSubmitting) {
      setError(
        "Please enter your email and password above, then click Resend.",
      );
      return;
    }
    try {
      setIsSubmitting(true);
      const cred = await login(email, password);
      await verifyEmail(cred.user);
      await logout();
      setError("");
      setInfoMessage(
        `A new verification email has been sent to ${email}. Please check your inbox and spam folder.`,
      );
      setUnverifiedUser(null);
    } catch (err) {
      console.error(err);
      setError(
        err.code === "auth/too-many-requests"
          ? "Too many requests. Please wait a minute before resending."
          : "Failed to resend verification email. Check your credentials and try again.",
      );
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
          <h1 className="font-bold text-3xl text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500">
            Sign in to your account or create a new one.
          </p>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">
              <p>{error}</p>
              {unverifiedUser && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isSubmitting}
                  className="underline font-semibold text-red-700 hover:text-red-900 cursor-pointer"
                >
                  Resend Verification Email
                </button>
              )}
            </div>
          )}

          {infoMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs">
              {infoMessage}
            </div>
          )}
          <form
            onSubmit={handleLogin}
            autoComplete="off"
            className="flex flex-col gap-3"
          >
            <div>
              <label className="text-xs font-medium text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-600">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isSubmitting}
                  className="text-xs font-medium text-blue-600 hover:underline cursor-pointer disabled:opacity-50"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
