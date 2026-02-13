"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import InputField from "@/components/ui/InputField";
import AuthButton from "@/components/ui/AuthButton";
import StatusModal from "@/components/ui/StatusModal"; // Importing StatusModal
import { handleSessionExpiry } from "@/utils/handleSessionExpiry";
import { PrivateRoute } from "@/utils/RouteProtection";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

const ChangePassword = () => {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
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
    setAlertMessage("");
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
    try {
      // Get token from localStorage or cookies as per your auth implementation
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverBaseUrl}/user/auth/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: oldPassword, newPassword, confirmPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsModalOpen(true);
        setTimeout(() => {
          router.push("/profile");
        }, 1000);
        toast.success(data.message)
      } else if (response.status === 403) {
        const error = typeof data.error;
        if (error === "object") {
          setErrors(data.error);
        }
      } else {
        if (handleSessionExpiry(data.message, router)) return;
        const msg = data.message || "Failed to change password";
        setAlertMessage(msg);
      }
    } catch {
      setAlertMessage("Network error. Please try again.");
    } finally {
      setDisabled(false);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PrivateRoute>
      <div className="flex justify-center items-center min-h-screen font-inter px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg w-full max-w-[400px] sm:w-[380px]">
          <h2 className="text-[#1D3557] text-3xl sm:text-4xl font-bold mb-4 font-cormorant-garamond">
            Change Password
          </h2>

          <form onSubmit={handleSubmit}>
            {alertMessage && (
              <div
                className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{alertMessage}</span>
              </div>
            )}

            <InputField
              label="Old Password"
              type={oldPasswordVisible ? "text" : "password"}
              value={oldPassword}
              onChange={handleOldPasswordChange}
              placeholder="Enter your old password"
              id="oldPassword"
              showPasswordToggle={true}
              onTogglePassword={() =>
                setOldPasswordVisible(!oldPasswordVisible)
              }
              className={`${errors?.currentPassword && "!mb-0"}`}
            />
            {errors?.currentPassword && (
              <p className="joi-error-message mb-2">{errors?.currentPassword[0]}</p>
            )}
            <InputField
              label="New Password"
              type={newPasswordVisible ? "text" : "password"}
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="Enter your new password"
              id="newPassword"
              showPasswordToggle={true}
              onTogglePassword={() =>
                setNewPasswordVisible(!newPasswordVisible)
              }
              className={`${errors?.newPassword && "!mb-0"}`}
            />
            {errors?.newPassword && (
              <p className="joi-error-message mb-2">{errors?.newPassword[0]}</p>
            )}
            <InputField
              label="Confirm Password"
              type={confirmPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Re-enter your new password"
              id="confirmPassword"
              showPasswordToggle={true}
              onTogglePassword={() =>
                setConfirmPasswordVisible(!confirmPasswordVisible)
              }
              className={`${errors?.confirmPassword && "!mb-0"}`}
            />
            {errors?.confirmPassword && (
              <p className="joi-error-message mb-2">{errors?.confirmPassword[0]}</p>
            )}

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
          message="Password has been changed successfully!"
        />
      </div>
    </PrivateRoute>
  );
};

export default ChangePassword;
