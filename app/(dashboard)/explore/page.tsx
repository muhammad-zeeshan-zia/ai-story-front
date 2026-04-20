"use client";

import React, { useCallback, useState } from "react";
import { useLandingPage } from "@/hooks/useLandingPage";
import type { LandingPageContent } from "@/api/landingpageApis";
import {
  ActionSection,
  FeaturesSection,
  FinalCTASection,
  FullOverviewSection,
  GuaranteeSection,
  HeroSection,
  IntroductionSection,
  LeadModal,
  PricingSection,
  SuccessModal,
  SupportSection,
} from "@/components/landingpage";

const DEFAULT_CONTENT: LandingPageContent = {
  navbar: {
    logoUrl: "",
    menuItems: ["Features", "Pricing", "About"],
    ctaText: "Get Started",
  },
  hero: {
    badgeText: "STORY GEMS — MEMORY PRESERVATION",
    mainHeading: "Capture the Stories That Matter Most Before They Fade",
    subHeading:
      "A simple, guided process that helps you turn meaningful memory moments into stories your family will treasure.",
    button1Text: "Download the FREE Story Starter Kit",
    button2Text: "Watch Demo",
    smallPoints: [
      "No writing experience needed",
      "Free to start",
      "4,200+ families",
    ],
    videoUrl: "",
    backgroundImageUrl: "",
  },
  startWithOneMemory: {
    eyebrowText: "Introduction",
    title: "Start with One Memory",
    description: "Experience Story Gems for Yourself",
    checklistItems: [
      "You don't need to be a writer",
      "Memories don't need to be perfect",
      "Stories form naturally without pressure",
    ],
    ctaText: "Download the FREE Starter Kit",
    videoCaption: "Keith Gibson — Introduction to Story Gems",
    imageUrl: "",
    videoUrl: "",
  },
  watchMemory: {
    eyebrowText: "See it in Action",
    title: "Watch a Memory Become a Story",
    videoUrl: "",
    thumbnailUrl: "",
    timelineSteps: [
      "A memory is shared",
      "Prompts surface details",
      "A story is born",
    ],
    videoCaption: "See the full Story Gems transformation",
  },
  features: {
    eyebrowText: "Why Story Gems",
    title: "What Makes Story Gems Special",
    cards: [
      {
        title: "Awaken the Memory... Not the Writer",
        description:
          "Focus on feelings, moments, and natural memory triggers — not grammar or writing skill.",
        imageUrl: "",
      },
      {
        title: "Compose... Capturing the True Experience",
        description:
          "AI-assisted process that amplifies your authentic voice while keeping every story uniquely yours.",
        imageUrl: "",
      },
      {
        title: "Storybooks Made Simple",
        description:
          "Turn your stories into beautiful digital PDFs or printed keepsakes your family will cherish forever.",
        imageUrl: "",
      },
    ],
  },
  learning: {
    eyebrowText: "Full Overview · 17 Min",
    title: "Learn the Who, What, Why, and How Behind Story Gems",
    description:
      "The origin story of Story Gems and why it was created\nHow our guided process works for all skill levels\nWhat you'll create and why it matters for future generations\nThe technology behind story preservation and book creation",
    imageUrl: "",
    videoUrl: "",
    videoCaption: "Full Story Gems Overview Presentation (17 min)",
    listHeading: "In This Presentation",
    buttonText: "Download the FREE Story Starter Kit",
  },
  support: {
    eyebrowText: "Support System",
    title: "Support Every Step of the Way",
    cards: [
      {
        badgeText: "24/7 ACCESS",
        title: "Learn at Your Own Pace",
        description:
          "Access all lessons, prompts, and story tools anytime, anywhere. No schedules — just progress on your terms.",
        imageUrl: "",
        videoLabel: "Online Learning",
        videoUrl: "",
      },
      {
        badgeText: "GUIDED PROGRAM ONLY",
        title: "Real-Time Coaching & Community",
        description:
          "Join weekly group sessions with a Story Gems guide. Ask questions, share stories, and stay motivated together.",
        imageUrl: "",
        videoLabel: "Weekly Live Sessions",
        videoUrl: "",
      },
    ],
  },
  pricing: {
    eyebrowText: "Pricing",
    title: "Choose Your Path to Storytelling",
    subtitle:
      "Both plans include full access to the Story Gems platform.\nStart free — upgrade anytime.",
    footerNote:
      "Secure checkout · 30-day money-back guarantee · No hidden fees",
    plans: [
      {
        name: "Independent Story Builder (DIY)",
        badgeText: "SELF-PACED",
        currency: "USD",
        price: "$277",
        period: "one-time",
        description:
          "Everything you need to start capturing and preserving your family stories on your own schedule.",
        features: [
          "Full website access",
          "24 structured lessons",
          "Story writing tools",
          "Create digital storybooks",
          "Memory prompt library",
          "PDF export",
        ],
        buttonText: "Get Started",
      },
      {
        name: "Guided Story Completion (DWY)",
        badgeText: "MOST POPULAR",
        recommendedBadge: "★ RECOMMENDED",
        isRecommended: true,
        currency: "USD",
        price: "$477",
        period: "one-time",
        description:
          "Our complete, supported program with live coaching to take you all the way to a finished storybook.",
        features: [
          "Everything in Independent",
          "56 comprehensive lessons",
          "12 weekly live sessions",
          "Personal story coach",
          "Community access",
          "Printed book option",
        ],
        buttonText: "Start Guided Program",
      },
    ],
  },
  guarantee: {
    eyebrowText: "Our Promise To You",
    title: "100% Can't Lose Guarantee",
    description:
      "If after 30 days you feel the program isn't helping you capture and preserve your family stories, we'll provide a full refund — no questions asked.",
    buttonText: "Learn More",
    pills: ["30-Day Guarantee", "No Questions Asked", "Instant Refund"],
  },
  finalCta: {
    eyebrowText: "Begin Today",
    title: "Start With One Memory",
    subtitle:
      "Most meaningful stories begin with a single moment. Try the process today — it's completely free to start.",
    backgroundImageUrl: "",
    buttonText: "Download the FREE Starter Kit",
    microcopy: '"No Credit Card Required" - No Payment Required',
  },
};

export default function LandingPage2() {
  const { data: contentFromApi } = useLandingPage();
  const content = contentFromApi || DEFAULT_CONTENT;

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successUserName, setSuccessUserName] = useState<string>("");

  const openLeadModal = useCallback(() => setIsLeadModalOpen(true), []);
  const closeLeadModal = useCallback(() => setIsLeadModalOpen(false), []);

  const openSuccessModal = useCallback((userName?: string) => {
    setSuccessUserName((userName ?? "").trim());
    setIsSuccessModalOpen(true);
  }, []);

  const closeSuccessModal = useCallback(() => {
    setIsSuccessModalOpen(false);
  }, []);

  const handleLeadSubmitSuccess = useCallback(
    (userName?: string) => {
      closeLeadModal();
      openSuccessModal(userName);
    },
    [closeLeadModal, openSuccessModal],
  );

  return (
    <>
      <HeroSection onDownloadStarterKit={openLeadModal} content={content} />
      <IntroductionSection
        onDownloadStarterKit={openLeadModal}
        content={content}
      />
      <ActionSection content={content} />
      <FeaturesSection
        content={content}
        fallbackCards={DEFAULT_CONTENT.features.cards}
      />
      <FullOverviewSection
        content={content}
        onDownloadStarterKit={openLeadModal}
      />
      <SupportSection content={content} />
      <PricingSection
        content={content}
        fallbackPlans={DEFAULT_CONTENT.pricing.plans}
      />
      <GuaranteeSection content={content} />
      <FinalCTASection onDownloadStarterKit={openLeadModal} content={content} />

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={closeLeadModal}
        onSuccess={handleLeadSubmitSuccess}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        userName={successUserName}
      />
    </>
  );
}
