"use client";

import React from 'react';
import type { LandingPageContent } from '@/api/landingpageApis';

type Props = {
  content: LandingPageContent;
  fallbackCards: LandingPageContent['features']['cards'];
};

export function FeaturesSection({ content, fallbackCards }: Props) {
  const cards = (content.features.cards || []).slice(0, 3);
  const features = (cards.length ? cards : fallbackCards)
    .slice(0, 3)
    .map((c, idx) => ({
      id: idx + 1,
      title: c.title,
      description: c.description,
      image: c.imageUrl || `/YOUR_IMAGE_${idx + 1}.jpg`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
    }));

  return (
    <section className="w-full py-20 px-6 bg-white font-sans text-center">
      {/* Header Section */}
      <div className="mb-12">
        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-3">
          {content.features.eyebrowText || 'Why Story Gems'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#221f1f] mb-2 tracking-tight">
          {content.features.title || 'What Makes Story Gems Special'}
        </h2>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden border border-gray-100/50 text-left transition-transform duration-300 hover:-translate-y-1"
          >
            <div
              className="relative h-48 sm:h-56 w-full bg-cover bg-center"
              style={{ backgroundImage: `url('${feature.image}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              <div className="absolute bottom-4 left-5 w-10 h-10 bg-[#4b92d4] text-white rounded-xl flex items-center justify-center shadow-md">
                {feature.icon}
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-grow flex flex-col">
              <h3 className="text-lg sm:text-xl font-bold text-[#221f1f] leading-snug mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-grow">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
