// components/ui/InputField.tsx
"use client";
import React from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // React Icons for visibility toggle

// Reusable Input Component
const InputField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  id,
  showPasswordToggle = false,
  disabled = false,
  onTogglePassword, // Function to toggle password visibility
  className,
}: {
  label: string;
  type: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  id: string;
  showPasswordToggle?: boolean;
  disabled?: boolean;
  onTogglePassword?: () => void; // Optional function for password toggle
  className?: string;
}) => {
  return (
    <div className={`mb-4 relative ${className}`}>
      <label className="block text-[#1D3557] text-sm font-semibold mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled} // Disable the field
        className="w-full h-[47px] px-3 border-2 border-[#A8DADC] rounded-md focus:outline-none focus:border-[#1D3557] text-[#1D3557] bg-[#F1FAEE]"
        placeholder={placeholder}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword} // Trigger password visibility toggle
          className={`absolute right-3 cursor-pointer top-2/3 transform -translate-y-1/2`}
        >
          {type === "password" ? (
            <AiOutlineEyeInvisible size={20} color="#1D3557" />
          ) : (
            <AiOutlineEye size={20} color="#1D3557" />
          )}
        </button>
      )}
    </div>
  );
};

export default InputField;
