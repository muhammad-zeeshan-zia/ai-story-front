"use client";

import React from 'react';
import type { LandingPageContent } from '@/api/landingpageApis';

type Props = {
  onDownloadStarterKit: () => void;
  content: LandingPageContent;
};

export function FinalCTASection({ onDownloadStarterKit, content }: Props) {
  return (
    <section
      className="relative w-full py-24 sm:py-32 flex items-center justify-center bg-cover bg-center px-6 font-sans"
      style={{
        backgroundImage: `url('${content.finalCta.backgroundImageUrl || '/YOUR_BACKGROUND_IMAGE.jpg'}')`,
      }}
    >
      <div className="absolute inset-0 bg-black/75 z-10"></div>

      <div className="relative z-20 flex flex-col items-center text-center max-w-3xl w-full">
        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-4">
          {content.finalCta.eyebrowText || 'Begin Today'}
        </span>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          {content.finalCta.title || 'Start With One Memory'}
        </h2>

        <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-2xl mb-10">
          {content.finalCta.subtitle ||
            "Most meaningful stories begin with a single moment. Try the process today — it's completely free to start."}
        </p>

        <button
          type="button"
          onClick={onDownloadStarterKit}
          className="inline-flex items-center gap-3 bg-[#4b92d4] hover:bg-[#3f7eb8] text-white font-medium text-sm sm:text-base px-8 py-4 rounded-xl transition-colors duration-200 shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          {content.finalCta.buttonText || 'Download the FREE Starter Kit'}
        </button>

        <p className="text-xs text-gray-400 mt-5 font-medium tracking-wide">
          {content.finalCta.microcopy || '"No Credit Card Required" - No Payment Required'}
        </p>
      </div>
    </section>
  );
}
