import React from "react";
import { MarketingStep } from "@/api/marketingPageApis";
import MarketingVideo from "./MarketingVideo";

const defaultSteps: MarketingStep[] = [
  {
    number: "1",
    label: "Step 1 of 4",
    title: "Create Your Learning Center Account",
    points: [
      "Use your active email address to create your free 10-day trial account.",
      "Complete the required registration details and submit the form.",
    ],
  },
  {
    number: "2",
    label: "Step 2 of 4",
    title: "Verify Your Email",
    points: [
      "Open the verification email sent to your inbox.",
      "Enter the verification code to activate your account.",
    ],
  },
  {
    number: "3",
    label: "Step 3 of 4",
    title: "Open Starter Modules",
    points: [
      "Go to your dashboard and open the starter learning modules.",
      "Review the guided lessons and activities in order.",
    ],
  },
  {
    number: "4",
    label: "Step 4 of 4",
    title: "Begin Your Next Story Session",
    points: [
      "Choose one memory activity and complete your first session.",
      "Save your progress so you can continue building your storybook.",
    ],
  },
];

const LearningCenterSetup = ({
  content,
}: {
  content?: {
    label?: string;
    title?: string;
    description?: string;
    paragraphs?: string[];
    videoUrl?: string;
    steps?: MarketingStep[];
    accountSetup?: { title?: string; subtitle?: string; steps?: MarketingStep[] };
  };
}) => {
  const steps = content?.steps?.length
    ? content.steps.slice(0, 4)
    : content?.accountSetup?.steps?.length
    ? content.accountSetup.steps.slice(0, 4)
    : defaultSteps;
  const description =
    content?.description ||
    (content?.paragraphs?.length ? content.paragraphs.join("\n\n") : "");

  return (
    // Outer wrapper with the light pastel blue background
    <div className="w-full bg-[#E5F1F4] py-10 md:py-12 px-5 sm:px-8 lg:px-12 font-sans flex justify-center">
      {/* Main Content Constrainer */}
      <div className="w-full max-w-6xl flex flex-col items-start">
        {/* Top Header Section */}
        <div className="mb-8">
          <span className="text-[#76AEC3] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block whitespace-pre-line">
            {content?.label ?? "Learning Center"}
          </span>
          {/* Main Heading */}
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-[#2E2E2E] mb-4 tracking-tight leading-[1.15] whitespace-pre-line">
            {content?.title ?? "CSG Learning Center - Free 10-Day Trial"}
          </h2>

          {/* Description Paragraph */}
          <p className="text-[#6C6C6C] text-sm md:text-base leading-relaxed max-w-3xl whitespace-pre-line">
            {description ||
              "Great work completing your practice stories. Start your free Learning Center trial and follow these steps to continue your story journey."}
          </p>
        </div>

        <div className="mb-8 w-full">
          <MarketingVideo videoUrl={content?.videoUrl} />
        </div>

        {/* Main White Card Container */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-10">
          {/* Steps Container */}
          <div className="space-y-10">
            {steps.map((step, idx) => (
              <div key={`${step.number}-${idx}`} className="flex gap-5 sm:gap-6">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#76AEC3] text-white flex items-center justify-center font-bold text-sm mt-1">
                  {step.number}
                </div>
                <div className="flex-1">
                  <span className="block text-[#76AEC3] text-[11px] font-semibold tracking-[0.2em] uppercase mb-2 whitespace-pre-line">
                    {step.label}
                  </span>
                  <h4 className="font-serif text-xl font-medium text-[#2E2E2E] mb-3 leading-tight whitespace-pre-line">
                    {step.title}
                  </h4>
                  <div className="text-gray-600 text-sm md:text-base space-y-2 leading-relaxed">
                    {step.points?.map((point, pointIdx) => (
                      <p key={pointIdx} className="whitespace-pre-line">{point}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningCenterSetup;
