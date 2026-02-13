"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import InputField from "@/components/ui/InputField";
import AuthButton from "@/components/ui/AuthButton";
import StatusModal from "@/components/ui/StatusModal";
import { PublicRoute } from "@/utils/RouteProtection";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

const VerifyOTP = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timer, setTimer] = useState(120);
  const [isResendEnabled, setIsResendEnabled] = useState(false); // To enable/disable resend button
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState({
    code: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  useEffect(() => {
    // Decrease timer every second when timer > 0
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsResendEnabled(true); // Enable resend after timer reaches 0
    }
  }, [timer]);

  useEffect(() => {
    const emailFromStorage = sessionStorage.getItem("signupEmail");
    if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      router.push("/signup");
    }
  }, []);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisabled(true);
    setErrors({
      code: "",
    });
    setAlertMessage("");
    setSuccess(false);
    try {
      const response = await fetch(`${serverBaseUrl}/user/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsModalOpen(true);
        setTimeout(() => {
          router.push("/login");
          setIsModalOpen(false);
          sessionStorage.removeItem("signupEmail");
        }, 2000);
      } else if (response.status === 403) {
        const error = typeof data.error;
        if (error === "object") {
          setErrors(data.error);
        }
      } else {
        setAlertMessage(data.message || "Failed to verify code.");
      }
    } catch {
      setAlertMessage("Network error. Please try again.");
    } finally {
      setDisabled(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await fetch(`${serverBaseUrl}/user/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          type: "verify",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        toast.success(data.message)
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
        setTimer(120);
        setIsResendEnabled(false);
      } else {
        setAlertMessage(data.message || "Failed to code otp");
      }
    } catch {
      setAlertMessage("Network error. Please try again");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PublicRoute>
      <div className="flex justify-center items-center min-h-screen font-inter px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg w-full max-w-[400px] sm:w-[380px]">
          <h2 className="text-[#1D3557] text-3xl sm:text-4xl font-bold mb-4 font-cormorant-garamond">
            Verify OTP
          </h2>
          {alertMessage && (
            <div
              className={`mb-4 ${
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
              label="Enter 5-digit code sent to your email"
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter here"
              id="otp"
              className={`${errors?.code && "!mb-0"}`}
            />
            {errors?.code && (
              <p className="joi-error-message mb-2">{errors?.code[0]}</p>
            )}

            <div className="flex justify-between text-sm text-[#1D3557] mt-2">
              <p>Resend OTP in: {formattedTime}</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={!isResendEnabled}
                className={`${
                  !isResendEnabled
                    ? "text-[#D1D5DB] cursor-not-allowed "
                    : "text-[#1D3557] cursor-pointer underline"
                } font-semibold  decoration-[#1D3557] hover:decoration-transparent`}
              >
                Resend Code
              </button>
            </div>
            <AuthButton
              text="Verify"
              type="submit"
              className="mt-3 w-full"
              isDisabled={disabled}
            />
          </form>
        </div>
        <StatusModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          message="Email has been verified successfully!"
        />
      </div>
    </PublicRoute>
  );
};

export default VerifyOTP;
