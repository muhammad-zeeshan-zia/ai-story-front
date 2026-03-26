"use client";

import React from 'react';
import type { LandingPageContent } from '@/api/landingpageApis';

type Props = {
  content: LandingPageContent;
  fallbackPlans: LandingPageContent['pricing']['plans'];
};

export function PricingSection({ content, fallbackPlans }: Props) {
  const plans = (content.pricing.plans || []).slice(0, 2);
  const planA = plans[0] || fallbackPlans[0];
  const planB = plans[1] || fallbackPlans[1];

  const pricingPlans = [
    {
      id: 'diy',
      badgeText: planA.badgeText || 'SELF-PACED',
      title: planA.name,
      description: planA.description,
      currency: planA.currency || 'USD',
      price: planA.price,
      period: planA.period || 'one-time',
      features: planA.features || [],
      buttonText: planA.buttonText || 'Get Started',
      buttonStyle: 'outline',
      isRecommended: false,
      cardClasses: 'bg-white border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]',
    },
    {
      id: 'dwy',
      badgeText: planB.badgeText || 'MOST POPULAR',
      recommendedBadge: planB.recommendedBadge || '★ RECOMMENDED',
      title: planB.name,
      description: planB.description,
      currency: planB.currency || 'USD',
      price: planB.price,
      period: planB.period || 'one-time',
      features: planB.features || [],
      buttonText: planB.buttonText || 'Start Guided Program',
      buttonStyle: 'solid',
      isRecommended: Boolean(planB.isRecommended ?? true),
      cardClasses:
        'bg-[#f4f9ff] border-[#4b92d4] shadow-[0_8px_30px_rgba(75,146,212,0.12)]',
    },
  ];

  return (
    <section className="w-full py-20 px-6 bg-[#f8fafc] font-sans flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-3">
          {content.pricing.eyebrowText || 'Pricing'}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#221f1f] mb-4 tracking-tight">
          {content.pricing.title || 'Choose Your Path to Storytelling'}
        </h2>
        <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
          {(content.pricing.subtitle ||
            'Both plans include full access to the Story Gems platform.\nStart free — upgrade anytime.')
            .split('\n')
            .map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx === 0 ? <br className="hidden sm:block" /> : null}
              </React.Fragment>
            ))}
        </p>
      </div>

      {/* Pricing Cards Container */}
      <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 w-full max-w-5xl">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col w-full lg:w-1/2 rounded-[2rem] p-8 sm:p-10 border ${plan.cardClasses} transition-transform duration-300 hover:-translate-y-1`}
          >
            {plan.isRecommended && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#4b92d4] text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md whitespace-nowrap">
                {plan.recommendedBadge}
              </div>
            )}

            <div className="inline-flex w-max px-3 py-1 bg-white/60 border border-[#b9d2ec] text-[#4b92d4] rounded-full text-[10px] font-bold tracking-wider uppercase mb-5">
              {plan.badgeText}
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#221f1f] mb-3">
              {plan.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed min-h-[40px]">
              {plan.description}
            </p>

            <div className="flex items-baseline gap-1.5 mt-8 mb-6">
              <span className="text-sm font-medium text-gray-400">{plan.currency}</span>
              <span className="text-5xl sm:text-6xl font-black text-[#221f1f] tracking-tighter">
                {plan.price}
              </span>
              <span className="text-sm font-medium text-gray-400">{plan.period}</span>
            </div>

            <hr className="border-t border-gray-200/80 mb-8" />

            <ul className="flex flex-col gap-4 mb-10 flex-grow">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-[#eef4fa] flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-[#5b8cc2]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-4 px-6 rounded-xl font-semibold text-sm sm:text-base transition-colors duration-200 ${
                plan.buttonStyle === 'solid'
                  ? 'bg-[#4b92d4] hover:bg-[#3f7eb8] text-white shadow-md'
                  : 'bg-transparent border-2 border-[#b9d2ec] text-[#4b92d4] hover:bg-[#f4f9ff]'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
        <svg className="w-4 h-4 text-[#a3a3a3]" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        <span>
          {content.pricing.footerNote ||
            'Secure checkout · 30-day money-back guarantee · No hidden fees'}
        </span>
      </div>
    </section>
  );
}
