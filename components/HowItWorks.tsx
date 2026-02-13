"use client";

import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Share a Memory",
    description:
      "Type it, speak it, or upload a draft, however you remember it best.",
  },
  {
    number: "02",
    title: "Answer a Few Heartfelt Questions",
    description:
      "Our story shaping app gently asks you clarity questions… to bring out details, emotions and meaning.",
  },
  {
    number: "03",
    title: "Receive a Beautiful, Meaningful Story",
    description: "It captures the spirit of your memory and makes it shine.",
  },
];

export default function HowItWorks() {
  return (
    <div className="flex flex-col md:flex-row h-auto md:h-170 bg-[#A8DADC] w-full rounded-tl-[120px]">
      {/* Image section */}
      <div className="w-full md:w-5/12">
        <Image
          src={"/assets/how_it_works.jpg"}
          width={1200} // Increased width
          height={1000}
          alt="How It Works"
          className="object-cover object-left w-full h-full md:h-170 rounded-tl-[120px]"
        />
      </div>

      {/* Content section */}
      <div className="w-full md:w-7/12 flex flex-col justify-center p-8 text-[#1D3557]">
        <h1 className="text-4xl sm:text-6xl font-[Cormorant_Garamond] mb-12">
          How It Works?
        </h1>
        <div className="flex flex-col gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col gap-3">
              <p className="text-2xl font-[500]">
                {step.number} | {step.title}
              </p>
              <p className="text-xl font-[300]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
