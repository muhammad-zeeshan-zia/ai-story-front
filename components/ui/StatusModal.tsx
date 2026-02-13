"use client";
import Image from "next/image";
import React from "react";
// import { CgClose } from "react-icons/cg";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  // onClose,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000a5] bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-[400px] w-full text-center relative">
        {/* Close button */}
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-[#1D3557] text-2xl font-semibold hover:text-[#000]"
        >
          <CgClose/>
        </button> */}

        <div className="mb-6">
          <Image
            src={"/success.svg"}
            width={114}
            height={114}
            alt="Success"
            className="mx-auto"
          />
        </div>
        <h3 className="text-[#1D3557] font-semibold text-xl mb-4">
          {message}
        </h3>
      </div>
    </div>
  );
};

export default StatusModal;
