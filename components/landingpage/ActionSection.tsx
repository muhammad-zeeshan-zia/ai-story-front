"use client";

import React, { useState } from 'react';
import type { LandingPageContent } from '@/api/landingpageApis';
import { normalizeYouTubeEmbedUrl, withAutoplay } from '@/api/landingpageApis';

type Props = {
  content: LandingPageContent;
};

export function ActionSection({ content }: Props) {
  const processSteps = (content.watchMemory.timelineSteps || [])
    .filter(Boolean)
    .slice(0, 3)
    .map((text, idx) => ({
      num: idx + 1,
      text,
    }));
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = normalizeYouTubeEmbedUrl(content.watchMemory.videoUrl || '');
  const iframeSrc = withAutoplay(embedUrl);

  return (
    <section className="w-full py-20 px-6 bg-[#f8fafc] font-sans text-center">
      {/* Header Section */}
      <div className="mb-10">
        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-3">
          {content.watchMemory.eyebrowText || 'See it in Action'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {content.watchMemory.title || 'Watch a Memory Become a Story'}
        </h2>
      </div>

      {/* Video Container */}
      <div
        className="relative max-w-5xl mx-auto w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden shadow-2xl mb-12 bg-cover bg-center flex flex-col items-center justify-center group cursor-pointer"
        onClick={() => {
          if (!embedUrl) return;
          setIsPlaying(true);
        }}
        style={{
          backgroundImage: `url('${content.watchMemory.thumbnailUrl || '/YOUR_COLLAGE_THUMBNAIL.jpg'}')`,
        }}
      >
        {isPlaying && embedUrl ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={iframeSrc}
            title={content.watchMemory.videoCaption || 'Story Gems Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300"></div>

            {/* Play Button Interface */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-black/40 flex items-center justify-center mb-4 backdrop-blur-sm group-hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 ml-1 text-[#4b92d4]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.018 14L14.41 9 4.018 4v10z" />
                  </svg>
                </div>
              </div>

              <p className="text-white/90 text-sm font-medium tracking-wide">
                {content.watchMemory.videoCaption || 'See the full Story Gems transformation'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* 3-Step Process Flow */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl mx-auto gap-4 md:gap-0">
        {processSteps.map((step, index) => (
          <React.Fragment key={step.num}>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 flex-shrink-0 rounded-full bg-[#4b92d4] text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                {step.num}
              </div>
              <span className="text-gray-500 text-sm font-medium whitespace-nowrap">
                {step.text}
              </span>
            </div>

            {index < processSteps.length - 1 && (
              <div className="hidden md:block w-12 lg:w-20 h-[2px] bg-[#b9d2ec] mx-4 lg:mx-6 rounded-full"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
