"use client";

import React, { useState } from "react";
import type { LandingPageContent } from "@/api/landingpageApis";
import { normalizeYouTubeEmbedUrl, withAutoplay } from "@/api/landingpageApis";
import { youTubeThumbnailFromEmbedUrl } from "./utils";

type Props = {
  content: LandingPageContent;
  onDownloadStarterKit?: () => void;
};

export function FullOverviewSection({ content, onDownloadStarterKit }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = normalizeYouTubeEmbedUrl(content.learning.videoUrl || "");
  const iframeSrc = withAutoplay(embedUrl);
  const thumbnailUrl =
    content.learning.imageUrl ||
    youTubeThumbnailFromEmbedUrl(embedUrl) ||
    "/YOUR_DESK_THUMBNAIL.jpg";

  return (
    <section className="w-full py-20 px-6 bg-[#f4f8fb] font-sans flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-3">
          {content.learning.eyebrowText || "Full Overview · 17 Min"}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
          {content.learning.title ||
            "Learn the Who, What, Why, and How Behind Story Gems"}
        </h2>
      </div>

      {/* Video Container */}
      <div
        className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-cover bg-center mb-8 flex flex-col items-center justify-center group cursor-pointer"
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
              "Full Story Gems Overview Presentation (17 min)"
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
                  "Full Story Gems Overview Presentation (17 min)"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* CTA under video */}
      <div className="w-full max-w-5xl flex items-center justify-center mb-10">
        <button
          type="button"
          onClick={onDownloadStarterKit}
          className="inline-flex items-center gap-3 bg-white text-black font-medium text-sm sm:text-base px-6 py-3.5 rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-sm border border-gray-200"
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
          {content.learning.buttonText || "Download the FREE Story Starter Kit"}
        </button>
      </div>
    </section>
  );
}
