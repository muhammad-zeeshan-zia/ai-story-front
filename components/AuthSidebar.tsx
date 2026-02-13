"use client";
import Image from "next/image";

export default function AuthSidebar() {
  return (
    <div className="relative h-full w-full">
      <Image
        src={"/assets/auth-background-image.png"}
        width={926}
        height={1012}
        alt="AuthSidebar"
        className="object-cover w-full h-full"
      />

      <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4 font-[Cormorant_Garamond]">
        <span className="text-3xl font-semibold mb-2">-LOGO-</span>
        <p className="text-[36px] md:text-[48px] lg:text-[64px] font-semibold leading-tight max-w-[90%] md:max-w-[70%]">
          Let&apos;s continue crafting the stories only you can tell.
        </p>
      </div>
    </div>
  );
}
