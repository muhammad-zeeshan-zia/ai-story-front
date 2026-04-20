import React from "react";

export default function MarketingVideo({
  videoUrl,
}: {
  videoUrl?: string;
}) {
  if (videoUrl) {
    return (
      <div className="w-full max-w-4xl mx-auto relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={videoUrl}
          title="Marketing video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto relative aspect-[16/9] bg-[#313131] rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#76AEC3] rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1 sm:ml-2"
        >
          <path
            fillRule="evenodd"
            d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
