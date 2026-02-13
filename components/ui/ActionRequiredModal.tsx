"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";

interface Props {
  onClose: () => void;
}

export default function ActionRequiredModal({ onClose }: Props) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0000007c] backdrop-blur-md">
      <div className="bg-white rounded-xl px-8 py-10 w-11/12 max-w-[550px] text-center shadow-xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-[#457B9D] hover:text-[#3A5A6B] font-bold"
        >
          <FiX/>
        </button>

        <Image
          src="/oops.svg"       // cloud “Oops!” graphic
          width={100}
          height={100}
          alt="Oops!"
          className="mx-auto mb-6"
        />

        <p className="text-[#1D3557] mb-8 px-10 font-semibold leading-snug">
          You have used all of your free stories. Select a Plan to continue
          generating
        </p>

        <button
          onClick={() => router.push('/select-plan')}
          className="bg-[#457B9D] hover:bg-[#3A5A6B] text-white w-full py-3 rounded-full font-semibold transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
