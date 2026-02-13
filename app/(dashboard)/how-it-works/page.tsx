"use client";

import React, { useState } from "react";
import {
  FaRegLightbulb,
  FaRegQuestionCircle,
  FaRobot,
  FaRegEdit,
} from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

export default function HowItWorksPage() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const steps = [
    {
      title: "Step 1: Share Your Memory",
      description:
        "You begin by simply speaking or typing a meaningful memory — no writing skills required!",
      icon: <FaRegLightbulb size={32} className="text-[#457B9D]" />,
    },
    {
      title: "Step 2: Answer Clarity Questions",
      description:
        "We guide you through a few thoughtful questions to help uncover depth and feeling behind your experience.",
      icon: <FaRegQuestionCircle size={32} className="text-[#457B9D]" />,
    },
    {
      title: "Step 3: Apply Story Weaving App",
      description:
        "It weaves what happened and how you felt into a story that draws people in and leaves a lasting impression.",
      icon: <FaRobot size={32} className="text-[#457B9D]" />,
    },
    {
      title: "Step 4: Review & Personalize",
      description:
        "You’ll have a chance to review the story and make small tweaks to ensure it truly represents your memory.",
      icon: <FaRegEdit size={32} className="text-[#457B9D]" />,
    },
  ];

  return (
    <div className="px-6 py-12 md:py-20 max-w-5xl mx-auto font-[Inter]">
      <h1 className="text-4xl sm:text-6xl font-[Cormorant_Garamond] text-[#1D3557] mb-12 text-center">
        How It Works
      </h1>

      <div className="grid gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-start gap-5 p-6 bg-[#F1FAEE] rounded-xl border border-[#A8DADC] shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex-shrink-0 mt-1">{step.icon}</div>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1D3557] mb-2">
                {step.title}
              </h2>
              <p className="text-[#5A9AAF] text-base sm:text-lg">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center mt-8">
        <button
          onClick={() => {
            setShowModal(true);
            setLoading(true);
          }}
          className="flex gap-2 bg-[#457B9D] text-[#FAF9F6] py-2 px-8 rounded-full text-lg font-semibold hover:bg-[#375E73] transition"
        >
          View Step by Step Guide
        </button>
      </div>
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-4xl w-full relative p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute bg-gray-600  hover:bg-gray-800 w-8 h-8 flex items-center justify-center -top-8 -right-8 text-white rounded-full text-2xl font-bold transition-all ease-in"
            >
              <RxCross2 />
            </button>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}

            <iframe
              src="/capturing_story_gems_quickstart_real_screenshots.pdf"
              className="w-full h-[80vh] rounded overflow-hidden"
              style={{ border: "none" }}
              title="Step by Step Guide"
              onLoad={() => setLoading(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
