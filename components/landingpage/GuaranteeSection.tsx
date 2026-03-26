"use client";

import React from 'react';
import type { LandingPageContent } from '@/api/landingpageApis';

type Props = {
  content: LandingPageContent;
};

export function GuaranteeSection({ content }: Props) {
  const guaranteePills = (content.guarantee.pills || []).filter(Boolean).slice(0, 6);

  return (
    <section className="w-full py-20 px-6 bg-white font-sans flex justify-center">
      <div className="w-full max-w-4xl bg-[#f4f9ff] rounded-[2rem] p-10 sm:p-14 md:p-16 flex flex-col items-center text-center border border-[#e8f1fa]">
        <div className="w-16 h-16 rounded-full border-2 border-[#4b92d4] bg-transparent flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-[#4b92d4]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-4">
          {content.guarantee.eyebrowText || 'Our Promise To You'}
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#221f1f] mb-6 tracking-tight">
          {content.guarantee.title || "100% Can't Lose Guarantee"}
        </h2>

        <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mb-10">
          {content.guarantee.description || (
            <>
              If after <span className="font-bold text-[#221f1f]">30 days</span> you
              feel the program isn't helping you capture and preserve your family
              stories, we'll provide a{' '}
              <span className="font-bold text-[#221f1f]">full refund</span> — no
              questions asked.
            </>
          )}
        </p>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {(guaranteePills.length
            ? guaranteePills
            : ['30-Day Guarantee', 'No Questions Asked', 'Instant Refund']
          ).map((text, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e4f0fc] text-[#4b92d4] text-xs sm:text-sm font-medium rounded-full"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
