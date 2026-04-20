import React from "react";
import MarketingVideo from "./MarketingVideo";

type PracticeStoryContent = {
  label?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
};

const PracticeStoryComponent = ({ content }: { content?: PracticeStoryContent }) => {
  return (
    // Outer wrapper with the light cream background color
    <div className="w-full bg-[#F4F3EE] py-10 md:py-12 px-5 sm:px-8 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col items-start">
        {/* Top Label */}
        <span className="text-[#76AEC3] text-xs font-semibold tracking-[0.2em] uppercase mb-4 whitespace-pre-line">
          {content?.label ?? "Practice Story (1 of 2)"}
        </span>

        {/* Main Heading (Assuming 'font-serif' is configured as shown previously) */}
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-[#2E2E2E] mb-4 tracking-tight leading-[1.15] whitespace-pre-line">
          {content?.title ?? "Practice 1: Just Experience the Core Process"}
        </h2>

        {/* Description Paragraph */}
        <p className="text-[#6C6C6C] text-sm md:text-base leading-relaxed mb-8 max-w-3xl whitespace-pre-line">
          {content?.description ??
            "In the first memory to story practice... we're not asking you to think of your own memory experience yet. Instead, you'll use a memory example we've created for the first practice story. Our goal with the practice stories is not perfection... it's only to experience the process."}
        </p>

        <MarketingVideo videoUrl={content?.videoUrl} />
      </div>
    </div>
  );
};

export default PracticeStoryComponent;
