"use client";
import Image from "next/image";

interface Props {
  isConfirmation?: boolean;
}

export default function StoryImagePanel({ isConfirmation }: Props) {
  return (
    <div className="w-full lg:w-1/2 relative order-1 lg:order-2 mb-6 sm:mb-0">
      <div className="relative w-full h-full">
        <Image
          src="/assets/clarity-confirmation-image.jpg"
          width={2000}
          height={2000}
          alt="Story Confirmation"
          className="w-full h-100 md:h-full object-cover rounded-lg lg:rounded-tr-[120px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#0000004D] to-[#000000B2] rounded-lg lg:rounded-tr-[120px]" />
        {!isConfirmation && (
          <div className="absolute inset-0 flex justify-center items-center text-white px-12">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl mb-6 font-semibold">
                Turn Your Memories into Stories
              </h2>
              <ul className="space-y-2 text-sm sm:text-base md:text-lg">
                <li>Your Memories are More Important than Writing</li>
                <li>Learn Simple Steps and Make Storytelling Easy</li>
                <li>Leave with Meaningful Stories in Hand</li>
              </ul>
              <div className="mt-8">
                <a
                  href="mailto:storygems.support@gmail.com"
                  className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
