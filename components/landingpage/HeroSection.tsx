"use client";

import React from 'react';
import type { LandingPageContent } from '@/api/landingpageApis';

type Props = {
  onDownloadStarterKit: () => void;
  content: LandingPageContent;
};

export function HeroSection({ onDownloadStarterKit, content }: Props) {
  const backgroundImageUrl = content.hero.backgroundImageUrl;
  const trust = (content.hero.smallPoints || []).filter(Boolean).slice(0, 3);

  return (
    <section
      className="relative w-full min-h-screen flex items-center bg-cover bg-center px-6 md:px-12 lg:px-24 font-sans"
      style={{
        backgroundImage: `url('${backgroundImageUrl || '/YOUR_BACKGROUND_IMAGE_URL.jpg'}')`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65 z-10"></div>

      {/* Content Container */}
      <div className="relative z-20 max-w-3xl w-full">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e2d3c]/60 border border-white/10 text-[10px] sm:text-xs font-semibold tracking-wider text-[#5b8cc2] uppercase mb-6 sm:mb-8">
          <span className="text-[8px]">●</span>{' '}
          {content.hero.badgeText || 'STORY GEMS — MEMORY PRESERVATION'}
        </div>

        {/* Main Typography */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.15] tracking-tight mb-6">
          {content.hero.mainHeading ||
            'Capture the Stories That Matter Most Before They Fade'}
        </h1>

        <p className="text-base sm:text-lg text-gray-200 max-w-2xl leading-relaxed mb-10">
          {content.hero.subHeading ||
            'A simple, guided process that helps you turn meaningful memory moments into stories your family will treasure.'}
        </p>

        {/* Call to Action */}
        <button
          type="button"
          onClick={onDownloadStarterKit}
          className="inline-flex items-center gap-3 bg-white text-black font-medium text-sm sm:text-base px-6 py-3.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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
          {content.hero.button1Text || 'Download the FREE Story Starter Kit'}
        </button>

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-12 text-xs sm:text-sm text-gray-400">
          {(trust.length
            ? trust
            : ['No writing experience needed', 'Free to start', '4,200+ families']
          ).map((t, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              <span className="text-white text-xs">✦</span> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
