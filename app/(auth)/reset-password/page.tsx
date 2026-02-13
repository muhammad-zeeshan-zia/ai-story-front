"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/InputField";
import AuthButton from "@/components/ui/AuthButton";
import StatusModal from "@/components/ui/StatusModal";
import { PublicRoute } from "@/utils/RouteProtection";
import { toast } from "sonner";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

const ResetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    code: "",
    password: "",
    confirmPassword: "",
  });
  const [timer, setTimer] = useState(120);
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsResendEnabled(true);
    }
  }, [timer]);

  useEffect(() => {
    const emailFromStorage = sessionStorage.getItem("resetPasswordEmail");
    if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      router.push("/forgot-password");
    }
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisabled(true);
    setErrors({
      code: "",
      password: "",
      confirmPassword: "",
    });
    setAlertMessage("");
    setSuccess(false);
    try {
      const response = await fetch(`${serverBaseUrl}/user/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          password: newPassword,
          confirmPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsModalOpen(true);
        setTimeout(() => {
          router.push("/login");
          sessionStorage.removeItem("resetPasswordEmail");
          setIsModalOpen(false);
        }, 2000);
      } else if (response.status === 403) {
        const error = typeof data.error;
        if (error === "object") {
          setErrors(data.error);
        }
      } else {
        setAlertMessage(data.message || "Failed to updated password");
      }
    } catch {
      setAlertMessage("Network error. Please try again");
    } finally {
      setDisabled(false);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleResend = async () => {
    try {
      const response = await fetch(`${serverBaseUrl}/user/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          type: "reset",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setAlertMessage(data.message);
        setTimeout(() => {
          setSuccess(false);
          setAlertMessage("");
        }, 5000);
        setTimer(120);
        setIsResendEnabled(false);
        toast.success(data.message)
      } else {
        setAlertMessage(data.message || "Failed to code otp");
      }
    } catch {
      setAlertMessage("Network error. Please try again");
    }
  };

  return (
    <PublicRoute>
      <div className="flex justify-center items-center min-h-screen font-inter px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg w-full max-w-[400px] sm:w-[380px]">
          <h2 className="text-[#1D3557] text-3xl sm:text-4xl font-bold mb-4 font-cormorant-garamond">
            Create New Password
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
              label="Reset Code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="Enter the code sent to your email"
              id="code"
              className={`${errors?.code && "!mb-0"}`}
            />
            {errors?.code && (
              <p className="joi-error-message mb-2">{errors?.code[0]}</p>
            )}

            <InputField
              label="New Password"
              type={passwordVisible ? "text" : "password"}
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="Enter your password"
              id="newPassword"
              showPasswordToggle={true}
              onTogglePassword={() => setPasswordVisible(!passwordVisible)}
              className={`${errors?.password && "!mb-0"}`}
            />
            {errors?.password && (
              <p className="joi-error-message mb-2">{errors?.password[0]}</p>
            )}

            <InputField
              label="Confirm Password"
              type={confirmPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Re-enter Password"
              id="confirmPassword"
              showPasswordToggle={true}
              onTogglePassword={() =>
                setConfirmPasswordVisible(!confirmPasswordVisible)
              }
              className={`${errors?.confirmPassword && "!mb-0"}`}
            />
            {errors?.confirmPassword && (
              <p className="joi-error-message mb-2">
                {errors?.confirmPassword[0]}
              </p>
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
              text="Submit"
              type="submit"
              className="mt-3 w-full"
              isDisabled={disabled}
            />
          </form>
        </div>

        {/* StatusModal component */}
        <StatusModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          message="Password has been reset successfully!"
        />
      </div>
    </PublicRoute>
  );
};

export default ResetPassword;
