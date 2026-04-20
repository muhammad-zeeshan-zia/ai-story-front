import React from "react";
import MarketingVideo from "./MarketingVideo";

type PracticeStoryContent = {
  label?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
};

const PracticeStoryTwoComponent = ({ content }: { content?: PracticeStoryContent }) => {
  return (
    // Outer wrapper with a white background
    <div className="w-full bg-white py-10 md:py-12 px-5 sm:px-8 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col items-start">
        {/* Top Label */}
        <span className="text-[#76AEC3] text-xs font-semibold tracking-[0.2em] uppercase mb-4 whitespace-pre-line">
          {content?.label ?? "Practice Story (2 of 2)"}
        </span>

        {/* Main Heading */}
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-[#2E2E2E] mb-4 tracking-tight leading-[1.15] whitespace-pre-line">
          {content?.title ?? "Practice 2: Use Your Own Memory"}
        </h2>

        {/* Description Paragraph */}
        <p className="text-[#6C6C6C] text-sm md:text-base leading-relaxed mb-8 max-w-3xl whitespace-pre-line">
          {content?.description ??
            "Now it's time to use your own memory experience. Follow the same process, but this time with a memory that's meaningful to you."}
        </p>

        <MarketingVideo videoUrl={content?.videoUrl} />
      </div>
    </div>
  );
};

export default PracticeStoryTwoComponent;
