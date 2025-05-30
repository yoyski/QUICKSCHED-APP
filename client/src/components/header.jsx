import React, { useContext, useState, useEffect, useRef } from "react";
import { AdminContext } from "../App";
import logo from "../assets/logo.png";

export const Header = () => {
  const { isAdmin, setIsAdmin } = useContext(AdminContext);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- NEW state for toggling password visibility
  const inputRef = useRef(null);

  const handleToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setError("");
    } else {
      setShowPasswordInput(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowPasswordInput(false);
      setPassword("");
      setError("");
      setShowPassword(false); // reset to hidden on success
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
      setShowPassword(false); // reset to hidden on failure
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  useEffect(() => {
    if (showPasswordInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPasswordInput]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowPasswordInput(false);
        setPassword("");
        setError("");
        setShowPassword(false); // reset visibility when closing
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <header className="w-full bg-gray-900 text-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="h-10 flex items-center -mt-2">
            <img src={logo} alt="Logo" className="h-16 object-contain" />
          </div>

          {/* Toggle Mode Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggle}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isAdmin
                  ? "bg-purple-800 text-white-300 hover:bg-purple-700"
                  : "bg-gray-700 text-white-300 hover:bg-white-600"
              }`}
            >
              <span className="relative flex items-center">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${
                    isAdmin ? "bg-green-500" : "bg-gray-500"
                  }`}
                />
                Admin Mode
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Password Prompt */}
      {showPasswordInput && !isAdmin && (
        <div className="fixed top-16 w-full flex justify-center z-40 px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 border border-gray-700 shadow-lg rounded-xl px-6 py-4 flex flex-wrap gap-2 max-w-md w-full"
          >
            <div className="relative flex-grow min-w-[150px]">
              <input
                type={showPassword ? "text" : "password"}
                ref={inputRef}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-gray-700 text-white"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                aria-invalid={error ? "true" : "false"}
                aria-describedby="password-error"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1} // prevent focus on tab
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye" : "fa-eye-slash"
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col md:flex-row justify-center w-full md:w-auto gap-2">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Submit
              </button>

              <button
                type="button"
                className="text-gray-400 hover:text-red-500 text-xl"
                onClick={() => {
                  setShowPasswordInput(false);
                  setPassword("");
                  setError("");
                  setShowPassword(false);
                }}
                title="Cancel"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {error && (
              <p
                id="password-error"
                className="w-full text-sm text-red-600 font-medium pl-1 mt-1"
                style={{ marginLeft: "0.5rem" }}
              >
                {error}
              </p>
            )}
          </form>
        </div>
      )}
    </>
  );
};
