import Image from "next/image";
import React from "react";

interface LeafCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
}

const LeafCard: React.FC<LeafCardProps> = ({
  title,
  description,
  imageSrc,
  imageWidth,
  imageHeight
}) => {
  return (
    <div className="w-full sm:w-[300px] px-5 sm:px-10 py-8 sm:py-15 bg-[#F1FAEE] rounded-lg">
      <div className="flex justify-center mb-6 sm:mb-10">
        <Image 
          width={imageWidth}
          height={imageHeight}
          src={imageSrc} 
          alt="Leaf Icon" 
        />
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold text-center text-[#1D3557] mb-4 sm:mb-6">
        {title}
      </h2>
      <p className="text-center text-[#457B9D] text-sm sm:text-base">
        {description}
      </p>
    </div>
  );
};

export default LeafCard;
