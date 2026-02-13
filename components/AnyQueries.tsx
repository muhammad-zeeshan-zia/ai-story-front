"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AnyQueries() {
  const router = useRouter();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqData = [
    {
      question: "Is the story private?",
      answer: "Yes, your story is completely private and secure. We use industry-standard encryption to protect your personal memories and stories."
    },
    {
      question: "What is the workshop about?",
      answer:
        "Our workshop guides you through the process of tickling fading memories, crafting your personal story. You'll learn how to structure your memories into engaging and meaningful stories.",
    },
    {
      question: "How much does it cost?",
      answer: (
        <>
          We offer different plans. Checkout our detailed pricing information
          and available packages. View{" "}
          <button
            onClick={() => router.push("/select-plan")}
            className="text-blue-400 underline"
          >
            Pricing
          </button>
        </>
      ),
    },
    {
      question: "How does the story shaping app help me write?",
      answer:
        "Our story app helps structure your thoughts, suggests narrative improvements, and assists with writing flow while preserving your authentic memory experience.",
    },
    {
      question: "What if I only remember a little?",
      answer:
        "That's perfectly fine! Our program can help you expand on small memories and guide you through exercises to recall more details about your experiences.",
    },
  ];

  return (
    <div className="px-5">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6 group hover:shadow-xl transition-all duration-300">
            <svg
              className="w-8 h-8 text-[#457B9D] group-hover:scale-110 transition-transform duration-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L8.5 8.5L2 12L8.5 15.5L12 22L15.5 15.5L22 12L15.5 8.5L12 2Z" />
            </svg>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1D3557] mb-4">
            Any{" "}
            <span className="underline decoration-[#457B9D] decoration-2 underline-offset-4">
              Queries
            </span>
            ?
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-[#1D3557] font-medium text-lg">
                  {item.question}
                </span>
                <div className="ml-4 flex-shrink-0">
                  {openItems.includes(index) ? (
                    <Minus className="w-5 h-5 text-[#457B9D]" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#457B9D]" />
                  )}
                </div>
              </button>

              {openItems.includes(index) && (
                <div className="px-6 pb-5 border-t border-gray-100">
                  <p className="text-[#1D3557]/80 leading-relaxed pt-4">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
