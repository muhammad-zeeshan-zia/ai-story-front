"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import InputField from "@/components/ui/InputField";
import AuthButton from "@/components/ui/AuthButton";
import { PublicRoute } from "@/utils/RouteProtection";
import AuthSidebar from "@/components/AuthSidebar";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisabled(true);
    setErrors({ email: "", password: "" });
    setAlertMessage("");
    const formData = { email, password };
    try {
      const response = await fetch(`${serverBaseUrl}/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (response.ok) {
        const { token, data } = responseData.response;
        router.push("/admin/");
        localStorage.setItem("token", token);
        localStorage.setItem("admin", JSON.stringify({ email: data.email }));
        toast.success(responseData.message);
      } else if (response.status === 403) {
        const error = typeof responseData.error;
        if (error === "object") {
          setErrors(responseData.error);
        }
      } else {
        setAlertMessage(
          responseData.message || "Login failed. Please try again"
        );
        setTimeout(() => setAlertMessage(""), 3000);
      }
    } catch {
      setAlertMessage("Network error. Please try again.");
      setTimeout(() => setAlertMessage(""), 3000);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <PublicRoute>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden">
        <div className="hidden md:block w-full md:w-[50%]">
          <AuthSidebar />
        </div>
        <div className="flex-1 overflow-auto bg-white flex justify-center items-center min-h-screen font-inter px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg w-full max-w-[400px] sm:w-[380px]">
            <h2 className="text-[#1D3557] text-3xl sm:text-4xl font-bold mb-4 font-cormorant-garamond">
              Welcome Admin!
            </h2>
            {alertMessage && (
              <div
                className={`mt-4 mb-8 bg-red-100 border-red-400 text-red-700 border px-4 py-3 rounded relative`}
                role="alert"
              >
                <span className="block sm:inline">{alertMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <InputField
                label="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                id="email"
                className={`${errors?.email && "!mb-0"}`}
              />
              {errors?.email && (
                <p className="joi-error-message mb-4">{errors?.email[0]}</p>
              )}

              <InputField
                label="Password"
                type={passwordVisible ? "text" : "password"} // Toggle between password and text
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                id="password"
                showPasswordToggle={true}
                onTogglePassword={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
                className={`${errors?.password && "!mb-0"}`}
              />
              {errors?.password && (
                <p className="joi-error-message mb-4">{errors?.password[0]}</p>
              )}

              <AuthButton
                text="Log in"
                type="submit"
                className="mt-3 w-full"
                isDisabled={disabled}
              />
            </form>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};
