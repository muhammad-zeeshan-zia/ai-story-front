"use client";

import React from 'react';
import book from '@/public/assets/book.png';
import { toast } from 'sonner';
import { subscribeNewsletter } from '@/api/emailTemplateApis';

const TEMPLATE_KEY = 'lead-newsletter';

type LeadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userName?: string) => void;
};

export function LeadModal({ isOpen, onClose, onSuccess }: LeadModalProps) {
  if (!isOpen) return null;

  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const fullName = String(formData.get('fullName') ?? '').trim();
      const email = String(formData.get('email') ?? '').trim();
      const firstName = fullName.split(/\s+/).filter(Boolean)[0] ?? '';

      await subscribeNewsletter({
        key: TEMPLATE_KEY,
        fullName,
        email,
      });

      onSuccess(firstName || undefined);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 max-h-[95vh] flex items-start justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm font-sans overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-lg overflow-hidden shadow-xl">
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
          <div className="w-full md:w-1/2 p-2 flex items-center justify-center">
            <img
              src={book.src}
              alt="Free Story Starter Kit Book"
              className="w-full max-w-[260px] rounded shadow-md object-cover aspect-[4/5]"
            />
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-8 md:pl-0 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl leading-[1.2] font-semibold text-gray-900 mb-3 tracking-tight">
              Capture a Meaningful Memoir —<br />
              Even If You're Not a Writer
            </h1>

            <p className="text-gray-700 text-base mb-6">
              Discover simple prompts to help you write and preserve your cherished family stories.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-sm">
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  required
                  className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#4a8ecc] hover:bg-[#397abb] text-white font-medium text-sm py-2.5 px-4 rounded transition duration-200"
              >
                {submitting ? 'Sending…' : 'Get the FREE Starter Kit →'}
              </button>
            </form>
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
                <img
                  src="/assets/image1.png"
                  alt="Inside the Starter Kit"
                  className="w-full h-full object-cover"
                />
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
                <img
                  src="/assets/image2.png"
                  alt="How the Starter Kit works"
                  className="w-full h-full object-cover"
                />
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
                <img
                  src="/assets/image3.png"
                  alt="Why capture these stories"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs text-gray-800 font-semibold">Preserve memories for generations</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
