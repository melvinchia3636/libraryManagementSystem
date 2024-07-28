// client/src/components/RegisterForm.tsx

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      registerSchema.parse(formData); // Validate input
      const response = await fetch(
        `${import.meta.env.VITE_API_HOST}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Registered successfully, please log in.");
        navigate;
        setFormData({ email: "", password: "", firstName: "", lastName: "" });
      } else {
        const data = await response.json();
        toast.error(data.error || { general: "Failed to register" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.format()._errors.join(", "));
      } else {
        toast.error("An error occurred during registration");
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-dvh flex flex-col md:flex-row items-center justify-center">
      <div className="w-full md:w-1/2 flex items-center justify-center flex-col h-full p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-left w-full md:w-1/2 tracking-tighter flex items-center justify-center md:justify-start">
          <Icon icon="mdi:library" className="text-4xl mr-2" />
          My Library
        </h1>
        <div className="w-full md:w-1/2 h-[1px] bg-gray-300 mb-6"></div>
        <h2 className="text-3xl font-bold mb-2 text-left w-full md:w-1/2">
          Register
        </h2>
        <p className="text-gray-500 w-full md:w-1/2 text-left mb-6">
          Start your reading journey by creating an account.
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
              className={`mt-1 p-3 block w-full rounded-md border shadow-sm focus:ring-indigo-500 sm:text-sm
              ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-indigo-500"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
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
              className={`mt-1 p-3 block w-full rounded-md border shadow-sm focus:ring-indigo-500 sm:text-sm
              ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-indigo-500"
              }`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* First Name Input */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name Input */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 !mt-6 w-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 text-white py-4 px-4 rounded"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
              Log in
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

export default RegisterForm;
