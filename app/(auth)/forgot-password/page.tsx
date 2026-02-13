"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link from next/link
import { toast } from "sonner";
import InputField from "@/components/ui/InputField";
import AuthButton from "@/components/ui/AuthButton";
import { PublicRoute } from "@/utils/RouteProtection";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      email: "",
    });
    setDisabled(true);
    setAlertMessage("");
    setSuccess(false);
    try {
      const response = await fetch(`${serverBaseUrl}/user/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("resetPasswordEmail", email);
        router.push("/reset-password");
        toast.success(data.message)
      } else if (response.status === 403) {
        const error = typeof data.error;
        if (error === "object") {
          setErrors(data.error);
        }
      } else {
        setAlertMessage(data.message || "Failed to send reset code");
      }
    } catch {
      setAlertMessage("Network error. Please try again");
    } finally {
      setDisabled(false);
    }
  };

  return (
    <PublicRoute>
      <div className="flex justify-center items-center min-h-screen font-inter px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg w-full max-w-[400px] sm:w-[380px]">
          <h2 className="text-[#1D3557] text-3xl sm:text-4xl font-bold mb-4 font-cormorant-garamond">
            Forgot Password?
          </h2>
          {alertMessage && (
            <div
              className={`mt-4 mb-8 ${
                success
                  ? "bg-green-100 border-green-400 text-green-700"
                  : "bg-red-100 border-red-400 text-red-700"
              } border px-4 py-3 rounded relative`}
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
              <p className="joi-error-message mb-2">{errors?.email[0]}</p>
            )}

            <AuthButton
              text="Send Me Code"
              type="submit"
              className="mt-3 w-full"
              isDisabled={disabled}
            />
          </form>

          <div className="flex justify-center text-sm text-[#1D3557] gap-2 mt-3">
            <span className="">Remembered your password?</span>
            <Link
              href="/login"
              className="font-semibold underline decoration-[#1D3557] hover:decoration-transparent"
            >
              Login here
            </Link>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

export default ForgotPassword;
