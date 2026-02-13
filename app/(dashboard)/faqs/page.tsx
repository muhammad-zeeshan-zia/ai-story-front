// app/faqs/page.tsx
"use client";

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  {
    question: "Do I need to be a good writer to use this?",
    answer:
      "Absolutely not! This gentle story-shaping process is designed for anyone who has a memory to capture and a story to share. Just speak or jot down your thoughts… and the rest is easy.",
  },
  {
    question: "Can I make changes while shaping my story?",
    answer:
      "Absolutely! As your story takes form, you’ll be able to review it and add your own touches, changes, or details anytime you wish.",
  },
  {
    question: "What happens to my stories after I share them?",
    answer:
      "They’re tucked away in a secure place for a year… waiting for you whenever you want to revisit them. And if you decide you no longer want them saved, you can remove them with a click.",
  },
  {
    question: "Can I use this on my phone?",
    answer:
      "Yes! The platform is fully responsive and mobile-friendly. You can create your story on any device.",
  },
  {
    question: "Does it cost anything to shape my story?",
    answer:
      "Yes, but we’ve kept our packages simple and affordable… so capturing your memories feels exciting... not expensive.",
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto font-[Inter]">
      <h1 className="text-4xl sm:text-6xl font-[Cormorant_Garamond] text-[#1D3557] mb-10 text-center">
        Frequently Asked Questions
      </h1>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border border-[#A8DADC] rounded-lg overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex justify-between items-center px-5 py-4 bg-[#F1FAEE] text-left text-[#1D3557] font-semibold text-lg sm:text-xl hover:bg-[#E9F1F2] transition"
            >
              {faq.question}
              {openIndex === idx ? (
                <FaChevronUp className="text-[#5A9AAF]" />
              ) : (
                <FaChevronDown className="text-[#5A9AAF]" />
              )}
            </button>
            {openIndex === idx && (
              <div className="px-5 pt-2 pb-4 text-[#5A9AAF] text-base sm:text-lg">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}