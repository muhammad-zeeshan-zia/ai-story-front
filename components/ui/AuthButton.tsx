// components/AuthButton.tsx
"use client";
import React from "react";

interface AuthButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  isDisabled?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  text,
  onClick,
  type = "button",
  className = "",
  isDisabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full h-[47px] bg-[#1D3557] text-white rounded-md hover:bg-[#142C47] transition disabled:bg-gray-400 disabled:hover:bg-gray-400 cursor-pointer ${className}`}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
};

export default AuthButton;
