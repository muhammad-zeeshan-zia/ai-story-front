"use client";

import React from "react";

type TrialBannerProps = {
  trialEndDate?: string | Date | null;
  className?: string;
};

function formatYmd(dateInput: string | Date) {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function TrialBanner({
  trialEndDate,
  className,
}: TrialBannerProps) {
  if (!trialEndDate) return null;
  const end = formatYmd(trialEndDate);
  if (!end) return null;

  return (
    <div
      className={
        className ||
        "w-full rounded-xl border border-[#A8DADC] bg-[#F1FAEE] px-4 py-3 text-sm text-[#1D3557]"
      }
    >
      <div className="font-semibold">
        You’re currently using the free trial.
      </div>
      <div className="text-[#457B9D]">Your trial ends on {end}.</div>
    </div>
  );
}
