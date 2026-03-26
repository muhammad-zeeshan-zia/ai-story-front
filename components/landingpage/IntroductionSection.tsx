"use client";

import React, { useState } from 'react';
import type { LandingPageContent } from '@/api/landingpageApis';
import { normalizeYouTubeEmbedUrl, withAutoplay } from '@/api/landingpageApis';

type Props = {
  onDownloadStarterKit: () => void;
  content: LandingPageContent;
};

export function IntroductionSection({ onDownloadStarterKit, content }: Props) {
  const checklistItems = (content.startWithOneMemory.checklistItems || [])
    .filter(Boolean)
    .slice(0, 6);
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = normalizeYouTubeEmbedUrl(content.startWithOneMemory.videoUrl || '');
  const iframeSrc = withAutoplay(embedUrl);

  return (
    <section className="w-full py-20 px-6 bg-white font-sans text-center">
      {/* Header Section */}
      <div className="mb-10">
        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-3">
          {content.startWithOneMemory.eyebrowText || 'Introduction'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {content.startWithOneMemory.title || 'Start with One Memory'}
        </h2>
        <p className="text-lg text-gray-500">
          {content.startWithOneMemory.description ||
            'Experience Story Gems for Yourself'}
        </p>
      </div>

      {/* Video Container */}
      <div
        className="relative max-w-4xl mx-auto w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl mb-10 bg-cover bg-center flex flex-col items-center justify-center group cursor-pointer"
        onClick={() => {
          if (!embedUrl) return;
          setIsPlaying(true);
        }}
        style={{
          backgroundImage: `url('${content.startWithOneMemory.imageUrl || '/YOUR_VIDEO_THUMBNAIL.jpg'}')`,
        }}
      >
        {isPlaying && embedUrl ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={iframeSrc}
            title={content.startWithOneMemory.videoCaption || 'Story Gems Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>

            {/* Play Button */}
            <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300 mb-3">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 ml-1 text-[#d97f27]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4.018 14L14.41 9 4.018 4v10z" />
              </svg>
            </div>

            {/* Caption */}
            <p className="relative z-10 text-white/90 text-xs sm:text-sm font-medium tracking-wide">
              {content.startWithOneMemory.videoCaption ||
                'Keith Gibson — Introduction to Story Gems'}
            </p>
          </>
        )}
      </div>

      {/* Checklist / Trust Features */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-10">
        {(checklistItems.length
          ? checklistItems
          : [
              "You don't need to be a writer",
              "Memories don't need to be perfect",
              'Stories form naturally without pressure',
            ]
        ).map((text, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#eef4fa] flex items-center justify-center">
              <svg
                className="w-3 h-3 text-[#5b8cc2]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-600 text-sm">{text}</span>
          </div>
        ))}
      </div>

      {/* Call to Action Button */}
      <button
        type="button"
        onClick={onDownloadStarterKit}
        className="bg-[#4b92d4] hover:bg-[#3f7eb8] text-white font-medium text-sm sm:text-base px-8 py-3.5 rounded-lg shadow-sm transition-colors duration-200"
      >
        {content.startWithOneMemory.ctaText || 'Download the FREE Starter Kit'}
      </button>
    </section>
  );
}
