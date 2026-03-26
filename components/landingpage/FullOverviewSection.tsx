"use client";

import React, { useState } from 'react';
import type { LandingPageContent } from '@/api/landingpageApis';
import { normalizeYouTubeEmbedUrl, withAutoplay } from '@/api/landingpageApis';
import { youTubeThumbnailFromEmbedUrl } from './utils';

type Props = {
  content: LandingPageContent;
};

export function FullOverviewSection({ content }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = normalizeYouTubeEmbedUrl(content.learning.videoUrl || '');
  const iframeSrc = withAutoplay(embedUrl);
  const thumbnailUrl =
    content.learning.imageUrl ||
    youTubeThumbnailFromEmbedUrl(embedUrl) ||
    '/YOUR_DESK_THUMBNAIL.jpg';
  const presentationPoints = (content.learning.presentationPoints || [])
    .filter(Boolean)
    .slice(0, 12);
  const fallbackFromDescription = (
    content.learning.description
      ? content.learning.description
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
      : []
  ).slice(0, 12);
  const points = presentationPoints.length
    ? presentationPoints
    : fallbackFromDescription.length
      ? fallbackFromDescription
      : [
          'The origin story of Story Gems and why it was created',
          'How our guided process works for all skill levels',
          "What you'll create and why it matters for future generations",
          'The technology behind story preservation and book creation',
        ];

  return (
    <section className="w-full py-20 px-6 bg-[#f4f8fb] font-sans flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-3">
          {content.learning.eyebrowText || 'Full Overview · 17 Min'}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
          {content.learning.title ||
            'Learn the Who, What, Why, and How Behind Story Gems'}
        </h2>
      </div>

      {/* Video Container */}
      <div
        className="relative w-full max-w-5xl aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl bg-cover bg-center mb-8 flex flex-col items-center justify-center group cursor-pointer"
        onClick={() => {
          if (!embedUrl) return;
          setIsPlaying(true);
        }}
        style={{ backgroundImage: `url('${thumbnailUrl}')` }}
      >
        {isPlaying && embedUrl ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={iframeSrc}
            title={
              content.learning.videoCaption ||
              'Full Story Gems Overview Presentation (17 min)'
            }
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>

            {/* Play Button Interface */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300 mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 ml-1 text-[#4b92d4]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4.018 14L14.41 9 4.018 4v10z" />
                </svg>
              </div>

              <p className="text-white/90 text-sm font-medium tracking-wide">
                {content.learning.videoCaption ||
                  'Full Story Gems Overview Presentation (17 min)'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Presentation Details Card */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 p-8 md:p-10">
        <h3 className="text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-6">
          {content.learning.listHeading || 'In This Presentation'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {points.map((point, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-[#5b8cc2]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-gray-500 text-sm md:text-base leading-snug">
                {point}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
