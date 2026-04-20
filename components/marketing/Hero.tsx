import React from "react";

type HeroContent = {
  backgroundImageUrl?: string;
  title?: string;
  subtitle?: string;
  description?: string;
};

const HeroComponent = ({ content }: { content?: HeroContent }) => {
  return (
    <div
      className="relative bg-cover bg-center text-white font-sans"
      style={{
        backgroundImage: content?.backgroundImageUrl
          ? `url(${content.backgroundImageUrl})`
          : undefined,
        backgroundColor: content?.backgroundImageUrl ? undefined : "#3B2D22",
        minHeight: "500px",
      }}
    >
      {/* This is the color overlay. We use a semi-transparent dark brown 
        to ensure text is readable while letting the image show through.
      */}
      <div className="absolute inset-0 bg-[#3B2D22]/85"></div>

      {/* Main content container. We add padding to control text position. 
        It is left-aligned and centrally stacked vertically.
      */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-10 lg:px-14 py-14 md:py-20 lg:py-24 flex flex-col items-start justify-center h-full">
        <div className="max-w-3xl space-y-4 md:space-y-5">
          {/* Main Heading (Using Serif Font) */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.15] tracking-tight whitespace-pre-line">
            {content?.title ?? "Begin Memory to Story Experience"}
          </h1>

          {/* Subheading (Using Serif Font) */}
          <h2 className="font-serif text-xl md:text-2xl font-medium tracking-tight whitespace-pre-line">
            {content?.subtitle ?? "Starter Kit Free 10-Day Trial"}
          </h2>

          {/* Body Paragraph (Using default Sans Font) */}
          <p className="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed whitespace-pre-line">
            {content?.description ??
              "In the first memory to story practice... we're not asking you to think of your own memory experience yet."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroComponent;
