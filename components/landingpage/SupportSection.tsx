"use client";

import React, { useState } from 'react';
import type { LandingPageContent } from '@/api/landingpageApis';
import { normalizeYouTubeEmbedUrl, withAutoplay } from '@/api/landingpageApis';
import { youTubeThumbnailFromEmbedUrl } from './utils';

type Props = {
  content: LandingPageContent;
};

export function SupportSection({ content }: Props) {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const supportOptions = [
    {
      id: 1,
      badgeText: content.support.cards?.[0]?.badgeText || '24/7 ACCESS',
      title: content.support.cards?.[0]?.title || 'Learn at Your Own Pace',
      description:
        content.support.cards?.[0]?.description ||
        'Access all lessons, prompts, and story tools anytime, anywhere. No schedules — just progress on your terms.',
      image: content.support.cards?.[0]?.imageUrl || '',
      videoUrl: content.support.cards?.[0]?.videoUrl || '',
      videoLabel: content.support.cards?.[0]?.videoLabel || 'Online Learning',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      badgeText: content.support.cards?.[1]?.badgeText || 'GUIDED PROGRAM ONLY',
      title:
        content.support.cards?.[1]?.title || 'Real-Time Coaching & Community',
      description:
        content.support.cards?.[1]?.description ||
        'Join weekly group sessions with a Story Gems guide. Ask questions, share stories, and stay motivated together.',
      image: content.support.cards?.[1]?.imageUrl || '',
      videoUrl: content.support.cards?.[1]?.videoUrl || '',
      videoLabel: content.support.cards?.[1]?.videoLabel || 'Weekly Live Sessions',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full py-20 px-6 bg-white font-sans flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mb-14 max-w-2xl mx-auto">
        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-3">
          {content.support.eyebrowText || 'Support System'}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#221f1f] mb-2 tracking-tight">
          {content.support.title || 'Support Every Step of the Way'}
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {supportOptions.map((option) => {
          const embedUrl = normalizeYouTubeEmbedUrl(option.videoUrl || '');
          const iframeSrc = withAutoplay(embedUrl);
          const thumbnailUrl =
            option.image ||
            youTubeThumbnailFromEmbedUrl(embedUrl) ||
            '/YOUR_VIDEO_THUMBNAIL.jpg';
          return (
            <div
              key={option.id}
              className="flex flex-col bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100/80"
            >
              {/* Card Header (Icon & Badge) */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-[#eef4fa] text-[#4b92d4] rounded-xl flex items-center justify-center">
                  {option.icon}
                </div>

                <div className="px-3 py-1 bg-[#f4f8fb] border border-[#b9d2ec] text-[#4b92d4] rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                  {option.badgeText}
                </div>
              </div>

              {/* Card Text Content */}
              <div className="flex-grow">
                <h3 className="text-xl sm:text-2xl font-bold text-[#221f1f] mb-3">
                  {option.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
                  {option.description}
                </p>
              </div>

              {/* Video/Image Thumbnail */}
              <div
                className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-cover bg-center group cursor-pointer mt-auto"
                onClick={() => {
                  if (!embedUrl) return;
                  setPlayingId(option.id);
                }}
                style={{ backgroundImage: `url('${thumbnailUrl}')` }}
              >
                {playingId === option.id && embedUrl ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={iframeSrc}
                    title={option.videoLabel || 'Support Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300 mb-3">
                        <svg
                          className="w-5 h-5 ml-1 text-[#4b92d4]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4.018 14L14.41 9 4.018 4v10z" />
                        </svg>
                      </div>

                      <p className="text-white/90 text-sm font-medium tracking-wide">
                        {option.videoLabel}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
