// client/src/components/LoginForm.tsx

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { useAuth } from "../providers/AuthContext";

const LoginForm: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // Clear previous errors
    setSuccessMessage("");
    try {
      loginSchema.parse(formData); // Validate input on client-side
      const response = await fetch(
        `${import.meta.env.VITE_API_HOST}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.userId);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to login");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.format()._errors.join(", "));
      } else {
        toast.error("An error occurred during login");
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="w-full h-dvh flex flex-col md:flex-row items-center justify-center">
      <div className="w-full md:w-1/2 flex items-center justify-center flex-col h-full p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-left w-full md:w-1/2 tracking-tighter flex items-center justify-center md:justify-start">
          <Icon icon="mdi:library" className="text-4xl mr-2" />
          My Library
        </h1>
        <div className="w-full md:w-1/2 h-[1px] bg-gray-300 mb-6"></div>
        <h2 className="text-3xl font-bold mb-2 text-left w-full md:w-1/2">
          Login
        </h2>
        <p className="text-gray-500 w-full md:w-1/2 text-left mb-6">
          Enter your email and password to login.
        </p>
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 w-full md:w-1/2">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 flex items-center gap-2 hover:gap-4 transition-all justify-center !mt-6 w-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 text-white py-4 px-4 rounded"
          >
            {isLoading ? (
              "Logging in..."
            ) : (
              <>
                Login
                <Icon
                  icon="tabler:arrow-right"
                  className="inline-block w-4 h-4"
                />
              </>
            )}
          </button>

          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
      <div className="w-full md:w-1/2 h-full p-8 hidden md:block">
        <img
          src="./books.jpg"
          alt="books"
          className="w-full rounded-lg h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginForm;
