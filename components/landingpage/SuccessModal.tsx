"use client";

import React from 'react';
import book from '@/public/assets/book.png';

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
};

export function SuccessModal({
  isOpen,
  onClose,
  userName = 'Muhammad',
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm font-sans overflow-y-auto">
      <div className="relative w-full max-w-[980px] bg-white rounded-lg overflow-hidden shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-gray-500 hover:bg-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <section className="flex flex-col md:flex-row bg-gradient-to-br from-[#f4f9fc] to-[#e6f1f8]">
          <div className="w-full md:w-1/2 p-6 md:p-8 flex items-center justify-center">
            <img
              src={book.src}
              alt="Free Story Starter Kit Book"
              className="w-full max-w-[260px] rounded shadow-md object-cover aspect-[4/5]"
            />
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-8 md:pl-0 flex flex-col justify-center">
            <div className="w-12 h-12 bg-white/70 border border-white/60 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#4b92d4]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl leading-[1.2] font-semibold text-gray-900 mb-3 tracking-tight">
              You're all set, {userName}!
            </h2>

            <p className="text-gray-700 text-base mb-6 max-w-sm">
              Check your inbox — your free Story Starter Kit is on its way.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-[#4a8ecc] hover:bg-[#397abb] text-white font-medium text-sm py-2.5 px-5 rounded transition duration-200"
              >
                Done
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </section>

        <section className="p-6 md:p-8 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-full flex items-center mb-4">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="px-3 text-gray-800 font-medium text-sm whitespace-nowrap">Inside the Starter Kit</span>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>

              <div className="w-full aspect-[3/2] bg-[#dcf1f9] rounded-sm flex items-center justify-center mb-3 shadow-inner overflow-hidden">
                <img src="/assets/image1.png" alt="Inside the Starter Kit" className="w-full h-full object-cover" />
              </div>

              <p className="text-xs text-gray-800 font-semibold">Tips, prompts &amp; worksheets</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-full flex items-center mb-4">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="px-3 text-gray-800 font-medium text-sm whitespace-nowrap">How the Starter Kit Works</span>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>

              <div className="w-full aspect-[3/2] bg-[#f9f1de] rounded-sm flex items-center justify-center mb-3 shadow-inner overflow-hidden">
                <img src="/assets/image2.png" alt="How the Starter Kit works" className="w-full h-full object-cover" />
              </div>

              <p className="text-xs text-gray-800 font-semibold">Simple step-by-step process</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-full flex items-center mb-4">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="px-3 text-gray-800 font-medium text-sm whitespace-nowrap">Why Capture These Stories?</span>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>

              <div className="w-full aspect-[3/2] bg-[#f5efe3] rounded-sm flex items-center justify-center mb-3 shadow-inner overflow-hidden">
                <img src="/assets/image3.png" alt="Why capture these stories" className="w-full h-full object-cover" />
              </div>

              <p className="text-xs text-gray-800 font-semibold">Preserve memories for generations</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
