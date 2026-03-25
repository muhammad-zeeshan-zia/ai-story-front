"use client";

import React, { useCallback, useState } from 'react';
import { useLandingPage } from '@/hooks/useLandingPage';
import { normalizeYouTubeEmbedUrl, withAutoplay } from '@/api/landingpageApis';
import type { LandingPageContent } from '@/api/landingpageApis';

function youTubeThumbnailFromEmbedUrl(embedUrl: string): string {
  const match = embedUrl.match(/\/embed\/([^?&#/]+)/);
  const videoId = match?.[1];
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
}

const DEFAULT_CONTENT: LandingPageContent = {
  navbar: { logoUrl: '', menuItems: ['Features', 'Pricing', 'About'], ctaText: 'Get Started' },
  hero: {
    badgeText: 'STORY GEMS — MEMORY PRESERVATION',
    mainHeading: 'Capture the Stories That Matter Most Before They Fade',
    subHeading:
      'A simple, guided process that helps you turn meaningful memory moments into stories your family will treasure.',
    button1Text: 'Download the FREE Story Starter Kit',
    button2Text: 'Watch Demo',
    smallPoints: ['No writing experience needed', 'Free to start', '4,200+ families'],
    videoUrl: '',
    backgroundImageUrl: '',
  },
  startWithOneMemory: {
    eyebrowText: 'Introduction',
    title: 'Start with One Memory',
    description: 'Experience Story Gems for Yourself',
    checklistItems: ["You don't need to be a writer", "Memories don't need to be perfect", "Stories form naturally without pressure"],
    ctaText: 'Download the FREE Starter Kit',
    videoCaption: 'Keith Gibson — Introduction to Story Gems',
    imageUrl: '',
    videoUrl: '',
  },
  watchMemory: {
    eyebrowText: 'See it in Action',
    title: 'Watch a Memory Become a Story',
    videoUrl: '',
    thumbnailUrl: '',
    timelineSteps: ['A memory is shared', 'Prompts surface details', 'A story is born'],
    videoCaption: 'See the full Story Gems transformation',
  },
  features: {
    eyebrowText: 'Why Story Gems',
    title: 'What Makes Story Gems Special',
    cards: [
      { title: 'Awaken the Memory... Not the Writer', description: "Focus on feelings, moments, and natural memory triggers — not grammar or writing skill.", imageUrl: '' },
      { title: 'Compose... Capturing the True Experience', description: 'AI-assisted process that amplifies your authentic voice while keeping every story uniquely yours.', imageUrl: '' },
      { title: 'Storybooks Made Simple', description: 'Turn your stories into beautiful digital PDFs or printed keepsakes your family will cherish forever.', imageUrl: '' },
    ],
  },
  learning: {
    eyebrowText: 'Full Overview · 17 Min',
    title: 'Learn the Who, What, Why, and How Behind Story Gems',
    description:
      'The origin story of Story Gems and why it was created\nHow our guided process works for all skill levels\nWhat you\'ll create and why it matters for future generations\nThe technology behind story preservation and book creation',
    imageUrl: '',
    videoUrl: '',
    videoCaption: 'Full Story Gems Overview Presentation (17 min)',
    listHeading: 'In This Presentation',
    presentationPoints: [
      'The origin story of Story Gems and why it was created',
      'How our guided process works for all skill levels',
      "What you'll create and why it matters for future generations",
      'The technology behind story preservation and book creation',
    ],
  },
  support: {
    eyebrowText: 'Support System',
    title: 'Support Every Step of the Way',
    cards: [
      {
        badgeText: '24/7 ACCESS',
        title: 'Learn at Your Own Pace',
        description:
          'Access all lessons, prompts, and story tools anytime, anywhere. No schedules — just progress on your terms.',
        imageUrl: '',
        videoLabel: 'Online Learning',
        videoUrl: '',
      },
      {
        badgeText: 'GUIDED PROGRAM ONLY',
        title: 'Real-Time Coaching & Community',
        description:
          'Join weekly group sessions with a Story Gems guide. Ask questions, share stories, and stay motivated together.',
        imageUrl: '',
        videoLabel: 'Weekly Live Sessions',
        videoUrl: '',
      },
    ],
  },
  pricing: {
    eyebrowText: 'Pricing',
    title: 'Choose Your Path to Storytelling',
    subtitle: 'Both plans include full access to the Story Gems platform.\nStart free — upgrade anytime.',
    footerNote: 'Secure checkout · 30-day money-back guarantee · No hidden fees',
    plans: [
      {
        name: 'Independent Story Builder (DIY)',
        badgeText: 'SELF-PACED',
        currency: 'USD',
        price: '$277',
        period: 'one-time',
        description: 'Everything you need to start capturing and preserving your family stories on your own schedule.',
        features: ['Full website access', '24 structured lessons', 'Story writing tools', 'Create digital storybooks', 'Memory prompt library', 'PDF export'],
        buttonText: 'Get Started',
      },
      {
        name: 'Guided Story Completion (DWY)',
        badgeText: 'MOST POPULAR',
        recommendedBadge: '★ RECOMMENDED',
        isRecommended: true,
        currency: 'USD',
        price: '$477',
        period: 'one-time',
        description: 'Our complete, supported program with live coaching to take you all the way to a finished storybook.',
        features: ['Everything in Independent', '56 comprehensive lessons', '12 weekly live sessions', 'Personal story coach', 'Community access', 'Printed book option'],
        buttonText: 'Start Guided Program',
      },
    ],
  },
  guarantee: {
    eyebrowText: 'Our Promise To You',
    title: "100% Can't Lose Guarantee",
    description:
      "If after 30 days you feel the program isn't helping you capture and preserve your family stories, we'll provide a full refund — no questions asked.",
    buttonText: 'Learn More',
    pills: ['30-Day Guarantee', 'No Questions Asked', 'Instant Refund'],
  },
  finalCta: {
    eyebrowText: 'Begin Today',
    title: 'Start With One Memory',
    subtitle: "Most meaningful stories begin with a single moment. Try the process today — it's completely free to start.",
    backgroundImageUrl: '',
    buttonText: 'Download the FREE Starter Kit',
    microcopy: '"No Credit Card Required" - No Payment Required',
  },
};

export default function LandingPage2() {
  const { data: contentFromApi } = useLandingPage();
  const content = contentFromApi || DEFAULT_CONTENT;

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successUserName, setSuccessUserName] = useState<string>('');

  const openLeadModal = useCallback(() => setIsLeadModalOpen(true), []);
  const closeLeadModal = useCallback(() => setIsLeadModalOpen(false), []);

  const openSuccessModal = useCallback((userName?: string) => {
    setSuccessUserName((userName ?? '').trim());
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
    [closeLeadModal, openSuccessModal]
  );

    return (
        <>
    <HeroSection onDownloadStarterKit={openLeadModal} content={content} />
    <IntroductionSection onDownloadStarterKit={openLeadModal} content={content} />
      <ActionSection content={content} />
      <FeaturesSection content={content} />
      <FullOverviewSection content={content} />
      <SupportSection content={content} />
      <PricingSection content={content} />
      <GuaranteeSection content={content} />
    <FinalCTASection onDownloadStarterKit={openLeadModal} content={content} />

    <LeadModal isOpen={isLeadModalOpen} onClose={closeLeadModal} onSuccess={handleLeadSubmitSuccess} />
    <SuccessModal isOpen={isSuccessModalOpen} onClose={closeSuccessModal} userName={successUserName} />
        </>
    );
}

type DownloadStarterKitHandler = () => void;

type WithDownloadStarterKitCta = {
  onDownloadStarterKit: DownloadStarterKitHandler;
};

const HeroSection = ({
  onDownloadStarterKit,
  content,
}: WithDownloadStarterKitCta & {
  content: LandingPageContent;
}) => {
  const backgroundImageUrl = content.hero.backgroundImageUrl;
  const trust = (content.hero.smallPoints || []).filter(Boolean).slice(0, 3);

  return (
    <section 
      className="relative w-full min-h-screen flex items-center bg-cover bg-center px-6 md:px-12 lg:px-24 font-sans" 
      style={{ backgroundImage: `url('${backgroundImageUrl || '/YOUR_BACKGROUND_IMAGE_URL.jpg'}')` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65 z-10"></div>

      {/* Content Container */}
      <div className="relative z-20 max-w-3xl w-full">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e2d3c]/60 border border-white/10 text-[10px] sm:text-xs font-semibold tracking-wider text-[#5b8cc2] uppercase mb-6 sm:mb-8">
          <span className="text-[8px]">●</span> {content.hero.badgeText || 'STORY GEMS — MEMORY PRESERVATION'}
        </div>

        {/* Main Typography */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.15] tracking-tight mb-6">
          {content.hero.mainHeading || 'Capture the Stories That Matter Most Before They Fade'}
        </h1>
        
        <p className="text-base sm:text-lg text-gray-200 max-w-2xl leading-relaxed mb-10">
          {content.hero.subHeading ||
            'A simple, guided process that helps you turn meaningful memory moments into stories your family will treasure.'}
        </p>

        {/* Call to Action */}
        <button
          type="button"
          onClick={onDownloadStarterKit}
          className="inline-flex items-center gap-3 bg-white text-black font-medium text-sm sm:text-base px-6 py-3.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          {content.hero.button1Text || 'Download the FREE Story Starter Kit'}
        </button>

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-12 text-xs sm:text-sm text-gray-400">
          {(trust.length ? trust : ['No writing experience needed', 'Free to start', '4,200+ families']).map((t, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              <span className="text-white text-xs">✦</span> {t}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
};

const IntroductionSection = ({
  onDownloadStarterKit,
  content,
}: WithDownloadStarterKitCta & {
  content: LandingPageContent;
}) => {
  // Array to keep the checklist code DRY and easy to update
  const checklistItems = (content.startWithOneMemory.checklistItems || []).filter(Boolean).slice(0, 6);
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = normalizeYouTubeEmbedUrl(content.startWithOneMemory.videoUrl || '');
  const iframeSrc = withAutoplay(embedUrl);

  return (
    <section className="w-full py-20 px-6 bg-white font-sans text-center">
      
      {/* Header Section */}
      <div className="mb-10">
        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-3">
          {content.startWithOneMemory.eyebrowText || 'Introduction'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {content.startWithOneMemory.title || 'Start with One Memory'}
        </h2>
        <p className="text-lg text-gray-500">
          {content.startWithOneMemory.description || 'Experience Story Gems for Yourself'}
        </p>
      </div>

      {/* Video Container */}
      {/* Note: Added an aspect ratio and a subtle hover effect on the play button */}
      <div 
        className="relative max-w-4xl mx-auto w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl mb-10 bg-cover bg-center flex flex-col items-center justify-center group cursor-pointer"
        onClick={() => {
          if (!embedUrl) return;
          setIsPlaying(true);
        }}
        style={{ backgroundImage: `url('${content.startWithOneMemory.imageUrl || '/YOUR_VIDEO_THUMBNAIL.jpg'}')` }}
      >
        {isPlaying && embedUrl ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={iframeSrc}
            title={content.startWithOneMemory.videoCaption || 'Story Gems Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
            
            {/* Play Button */}
            <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300 mb-3">
              <svg 
                className="w-6 h-6 sm:w-8 sm:h-8 ml-1 text-[#d97f27]" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M4.018 14L14.41 9 4.018 4v10z" />
              </svg>
            </div>
            
            {/* Caption */}
            <p className="relative z-10 text-white/90 text-xs sm:text-sm font-medium tracking-wide">
              {content.startWithOneMemory.videoCaption || 'Keith Gibson — Introduction to Story Gems'}
            </p>
          </>
        )}
      </div>

      {/* Checklist / Trust Features */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-10">
        {(checklistItems.length ? checklistItems : [
          "You don't need to be a writer",
          "Memories don't need to be perfect",
          "Stories form naturally without pressure",
        ]).map((text, index) => (
          <div key={index} className="flex items-center gap-2">
            {/* Checkmark Icon Wrapper */}
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#eef4fa] flex items-center justify-center">
              <svg 
                className="w-3 h-3 text-[#5b8cc2]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-600 text-sm">{text}</span>
          </div>
        ))}
      </div>

      {/* Call to Action Button */}
      {/* Notice this button has slightly rounded corners (rounded-lg) compared to the pill shape in the hero */}
      <button
        type="button"
        onClick={onDownloadStarterKit}
        className="bg-[#4b92d4] hover:bg-[#3f7eb8] text-white font-medium text-sm sm:text-base px-8 py-3.5 rounded-lg shadow-sm transition-colors duration-200"
      >
        {content.startWithOneMemory.ctaText || 'Download the FREE Starter Kit'}
      </button>

    </section>
  );
};

const ActionSection = ({ content }: { content: LandingPageContent }) => {
  // Array for the process steps to keep the code DRY
  const processSteps = (content.watchMemory.timelineSteps || []).filter(Boolean).slice(0, 3).map((text, idx) => ({
    num: idx + 1,
    text,
  }));
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = normalizeYouTubeEmbedUrl(content.watchMemory.videoUrl || '');
  const iframeSrc = withAutoplay(embedUrl);

  return (
    <section className="w-full py-20 px-6 bg-[#f8fafc] font-sans text-center">
      
      {/* Header Section */}
      <div className="mb-10">
        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-3">
          {content.watchMemory.eyebrowText || 'See it in Action'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {content.watchMemory.title || 'Watch a Memory Become a Story'}
        </h2>
      </div>

      {/* Video Container */}
      <div 
        className="relative max-w-5xl mx-auto w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden shadow-2xl mb-12 bg-cover bg-center flex flex-col items-center justify-center group cursor-pointer"
        onClick={() => {
          if (!embedUrl) return;
          setIsPlaying(true);
        }}
        style={{ backgroundImage: `url('${content.watchMemory.thumbnailUrl || '/YOUR_COLLAGE_THUMBNAIL.jpg'}')` }}
      >
        {isPlaying && embedUrl ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={iframeSrc}
            title={content.watchMemory.videoCaption || 'Story Gems Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300"></div>
            
            {/* Play Button Interface */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Subtle dark backdrop behind the play button (matches the dark ring in your mockup) */}
              <div className="w-24 h-24 rounded-full bg-black/40 flex items-center justify-center mb-4 backdrop-blur-sm group-hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg 
                    className="w-6 h-6 ml-1 text-[#4b92d4]" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M4.018 14L14.41 9 4.018 4v10z" />
                  </svg>
                </div>
              </div>
              
              <p className="text-white/90 text-sm font-medium tracking-wide">
                {content.watchMemory.videoCaption || 'See the full Story Gems transformation'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* 3-Step Process Flow */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl mx-auto gap-4 md:gap-0">
        {processSteps.map((step, index) => (
          <React.Fragment key={step.num}>
            {/* Step Item */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 flex-shrink-0 rounded-full bg-[#4b92d4] text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                {step.num}
              </div>
              <span className="text-gray-500 text-sm font-medium whitespace-nowrap">
                {step.text}
              </span>
            </div>

            {/* Connecting Line (Hides on mobile, shows on md+ screens) */}
            {index < processSteps.length - 1 && (
              <div className="hidden md:block w-12 lg:w-20 h-[2px] bg-[#b9d2ec] mx-4 lg:mx-6 rounded-full"></div>
            )}
          </React.Fragment>
        ))}
      </div>

    </section>
  );
}

const FeaturesSection = ({ content }: { content: LandingPageContent }) => {
  const cards = (content.features.cards || []).slice(0, 3);
  const features = (cards.length ? cards : DEFAULT_CONTENT.features.cards).slice(0, 3).map((c, idx) => ({
    id: idx + 1,
    title: c.title,
    description: c.description,
    image: c.imageUrl || `/YOUR_IMAGE_${idx + 1}.jpg`,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  }));

  return (
    <section className="w-full py-20 px-6 bg-white font-sans text-center">
      
      {/* Header Section */}
      <div className="mb-12">
        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-3">
          {content.features.eyebrowText || 'Why Story Gems'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#221f1f] mb-2 tracking-tight">
          {content.features.title || 'What Makes Story Gems Special'}
        </h2>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {features.map((feature) => (
          <div 
            key={feature.id} 
            className="flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden border border-gray-100/50 text-left transition-transform duration-300 hover:-translate-y-1"
          >
            {/* Image Wrapper with dark gradient at the bottom for the icon */}
            <div 
              className="relative h-48 sm:h-56 w-full bg-cover bg-center"
              style={{ backgroundImage: `url('${feature.image}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Floating Icon */}
              <div className="absolute bottom-4 left-5 w-10 h-10 bg-[#4b92d4] text-white rounded-xl flex items-center justify-center shadow-md">
                {feature.icon}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-8 flex-grow flex flex-col">
              <h3 className="text-lg sm:text-xl font-bold text-[#221f1f] leading-snug mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-grow">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

const FullOverviewSection = ({ content }: { content: LandingPageContent }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = normalizeYouTubeEmbedUrl(content.learning.videoUrl || '');
  const iframeSrc = withAutoplay(embedUrl);
  const thumbnailUrl =
    content.learning.imageUrl || youTubeThumbnailFromEmbedUrl(embedUrl) || '/YOUR_DESK_THUMBNAIL.jpg';
  const presentationPoints = (content.learning.presentationPoints || []).filter(Boolean).slice(0, 12);
  const fallbackFromDescription = (content.learning.description
    ? content.learning.description.split('\n').map((s) => s.trim()).filter(Boolean)
    : []).slice(0, 12);
  const points = presentationPoints.length
    ? presentationPoints
    : fallbackFromDescription.length
      ? fallbackFromDescription
      : [
          'The origin story of Story Gems and why it was created',
          'How our guided process works for all skill levels',
          "What you'll create and why it matters for future generations",
          'The technology behind story preservation and book creation',
        ];

  return (
    <section className="w-full py-20 px-6 bg-[#f4f8fb] font-sans flex flex-col items-center">
      
      {/* Header Section */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-3">
          {content.learning.eyebrowText || 'Full Overview · 17 Min'}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
          {content.learning.title || 'Learn the Who, What, Why, and How Behind Story Gems'}
        </h2>
      </div>

      {/* Video Container */}
      <div 
        className="relative w-full max-w-5xl aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl bg-cover bg-center mb-8 flex flex-col items-center justify-center group cursor-pointer"
        onClick={() => {
          if (!embedUrl) return;
          setIsPlaying(true);
        }}
        style={{ backgroundImage: `url('${thumbnailUrl}')` }}
      >
        {isPlaying && embedUrl ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={iframeSrc}
            title={content.learning.videoCaption || 'Full Story Gems Overview Presentation (17 min)'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
            
            {/* Play Button Interface */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300 mb-4">
                <svg 
                  className="w-6 h-6 sm:w-8 sm:h-8 ml-1 text-[#4b92d4]" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M4.018 14L14.41 9 4.018 4v10z" />
                </svg>
              </div>
              
              <p className="text-white/90 text-sm font-medium tracking-wide">
                {content.learning.videoCaption || 'Full Story Gems Overview Presentation (17 min)'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Presentation Details Card */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 p-8 md:p-10">
        <h3 className="text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-6">
          {content.learning.listHeading || 'In This Presentation'}
        </h3>
        
        {/* 2x2 Grid for Bullet Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {points.map((point, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {/* Checkmark Circle Icon */}
                <svg className="w-5 h-5 text-[#5b8cc2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-gray-500 text-sm md:text-base leading-snug">
                {point}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

const SupportSection = ({ content }: { content: LandingPageContent }) => {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const supportOptions = [
    {
      id: 1,
      badgeText: content.support.cards?.[0]?.badgeText || '24/7 ACCESS',
      title: content.support.cards?.[0]?.title || 'Learn at Your Own Pace',
      description:
        content.support.cards?.[0]?.description ||
        'Access all lessons, prompts, and story tools anytime, anywhere. No schedules — just progress on your terms.',
      image: content.support.cards?.[0]?.imageUrl || '',
      videoUrl: content.support.cards?.[0]?.videoUrl || '',
      videoLabel: content.support.cards?.[0]?.videoLabel || 'Online Learning',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 2,
      badgeText: content.support.cards?.[1]?.badgeText || 'GUIDED PROGRAM ONLY',
      title: content.support.cards?.[1]?.title || 'Real-Time Coaching & Community',
      description:
        content.support.cards?.[1]?.description ||
        'Join weekly group sessions with a Story Gems guide. Ask questions, share stories, and stay motivated together.',
      image: content.support.cards?.[1]?.imageUrl || '',
      videoUrl: content.support.cards?.[1]?.videoUrl || '',
      videoLabel: content.support.cards?.[1]?.videoLabel || 'Weekly Live Sessions',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full py-20 px-6 bg-white font-sans flex flex-col items-center">
      
      {/* Header Section */}
      <div className="text-center mb-14 max-w-2xl mx-auto">
        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-3">
          {content.support.eyebrowText || 'Support System'}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#221f1f] mb-2 tracking-tight">
          {content.support.title || 'Support Every Step of the Way'}
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {supportOptions.map((option) => {
          const embedUrl = normalizeYouTubeEmbedUrl(option.videoUrl || '');
          const iframeSrc = withAutoplay(embedUrl);
          const thumbnailUrl = option.image || youTubeThumbnailFromEmbedUrl(embedUrl) || '/YOUR_VIDEO_THUMBNAIL.jpg';
          return (
          <div 
            key={option.id} 
            className="flex flex-col bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100/80"
          >
            {/* Card Header (Icon & Badge) */}
            <div className="flex justify-between items-start mb-6">
              {/* Soft Blue Icon Container */}
              <div className="w-12 h-12 bg-[#eef4fa] text-[#4b92d4] rounded-xl flex items-center justify-center">
                {option.icon}
              </div>
              
              {/* Outline Pill Badge */}
              <div className="px-3 py-1 bg-[#f4f8fb] border border-[#b9d2ec] text-[#4b92d4] rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                {option.badgeText}
              </div>
            </div>

            {/* Card Text Content */}
            <div className="flex-grow">
              <h3 className="text-xl sm:text-2xl font-bold text-[#221f1f] mb-3">
                {option.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
                {option.description}
              </p>
            </div>

            {/* Video/Image Thumbnail */}
            <div 
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-cover bg-center group cursor-pointer mt-auto"
              onClick={() => {
                if (!embedUrl) return;
                setPlayingId(option.id);
              }}
              style={{ backgroundImage: `url('${thumbnailUrl}')` }}
            >
              {playingId === option.id && embedUrl ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={iframeSrc}
                  title={option.videoLabel || 'Support Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
                  
                  {/* Play Button & Label Centered Wrapper */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300 mb-3">
                      <svg 
                        className="w-5 h-5 ml-1 text-[#4b92d4]" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M4.018 14L14.41 9 4.018 4v10z" />
                      </svg>
                    </div>
                    
                    {/* Text Label positioned inside the container to stay balanced */}
                    <p className="text-white/90 text-sm font-medium tracking-wide">
                      {option.videoLabel}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          );
        })}
      </div>

    </section>
  );
};


const PricingSection = ({ content }: { content: LandingPageContent }) => {
  const plans = (content.pricing.plans || []).slice(0, 2);
  const planA = plans[0] || DEFAULT_CONTENT.pricing.plans[0];
  const planB = plans[1] || DEFAULT_CONTENT.pricing.plans[1];

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
      cardClasses: 'bg-[#f4f9ff] border-[#4b92d4] shadow-[0_8px_30px_rgba(75,146,212,0.12)]',
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
          {(content.pricing.subtitle || 'Both plans include full access to the Story Gems platform.\nStart free — upgrade anytime.')
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
            {/* Recommended Overhang Badge */}
            {plan.isRecommended && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#4b92d4] text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md whitespace-nowrap">
                {plan.recommendedBadge}
              </div>
            )}

            {/* Inner Pill Badge */}
            <div className="inline-flex w-max px-3 py-1 bg-white/60 border border-[#b9d2ec] text-[#4b92d4] rounded-full text-[10px] font-bold tracking-wider uppercase mb-5">
              {plan.badgeText}
            </div>

            {/* Title & Description */}
            <h3 className="text-xl sm:text-2xl font-bold text-[#221f1f] mb-3">
              {plan.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed min-h-[40px]">
              {plan.description}
            </p>

            {/* Price Block */}
            <div className="flex items-baseline gap-1.5 mt-8 mb-6">
              <span className="text-sm font-medium text-gray-400">{plan.currency}</span>
              <span className="text-5xl sm:text-6xl font-black text-[#221f1f] tracking-tighter">
                {plan.price}
              </span>
              <span className="text-sm font-medium text-gray-400">{plan.period}</span>
            </div>

            <hr className="border-t border-gray-200/80 mb-8" />

            {/* Features List */}
            <ul className="flex flex-col gap-4 mb-10 flex-grow">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-[#eef4fa] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-[#5b8cc2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Action Button */}
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

      {/* Trust Indicators Footer */}
      <div className="mt-10 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
        <svg className="w-4 h-4 text-[#a3a3a3]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>{content.pricing.footerNote || 'Secure checkout · 30-day money-back guarantee · No hidden fees'}</span>
      </div>

    </section>
  );
};


const GuaranteeSection = ({ content }: { content: LandingPageContent }) => {
  // Array for the guarantee features to keep the pills DRY
  const guaranteePills = (content.guarantee.pills || []).filter(Boolean).slice(0, 6);

  return (
    <section className="w-full py-20 px-6 bg-white font-sans flex justify-center">
      
      {/* Guarantee Card */}
      <div className="w-full max-w-4xl bg-[#f4f9ff] rounded-[2rem] p-10 sm:p-14 md:p-16 flex flex-col items-center text-center border border-[#e8f1fa]">
        
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-full border-2 border-[#4b92d4] bg-transparent flex items-center justify-center mb-6">
          <svg 
            className="w-8 h-8 text-[#4b92d4]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        {/* Subheading */}
        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-4">
          {content.guarantee.eyebrowText || 'Our Promise To You'}
        </span>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#221f1f] mb-6 tracking-tight">
          {content.guarantee.title || "100% Can't Lose Guarantee"}
        </h2>

        {/* Body Paragraph with targeted bolding */}
        <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mb-10">
          {content.guarantee.description || (
            <>If after <span className="font-bold text-[#221f1f]">30 days</span> you feel the program isn't helping you capture and preserve your family stories, we'll provide a <span className="font-bold text-[#221f1f]">full refund</span> — no questions asked.</>
          )}
        </p>

        {/* Trust Pills Container */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {(guaranteePills.length ? guaranteePills : ['30-Day Guarantee', 'No Questions Asked', 'Instant Refund']).map((text, index) => (
            <div 
              key={index} 
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e4f0fc] text-[#4b92d4] text-xs sm:text-sm font-medium rounded-full"
            >
              {/* Checkmark Icon inside the pill */}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {text}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
const FinalCTASection = ({
  onDownloadStarterKit,
  content,
}: WithDownloadStarterKitCta & {
  content: LandingPageContent;
}) => {
  return (
    <section 
      className="relative w-full py-24 sm:py-32 flex items-center justify-center bg-cover bg-center px-6 font-sans"
      style={{ backgroundImage: `url('${content.finalCta.backgroundImageUrl || '/YOUR_BACKGROUND_IMAGE.jpg'}')` }} // Replace with your image path
    >
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/75 z-10"></div>

      {/* Content Container */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-3xl w-full">
        
        {/* Eyebrow / Small Heading */}
        <span className="block text-[#5b8cc2] text-xs font-bold tracking-widest uppercase mb-4">
          {content.finalCta.eyebrowText || 'Begin Today'}
        </span>

        {/* Main Headline */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          {content.finalCta.title || 'Start With One Memory'}
        </h2>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-2xl mb-10">
          {content.finalCta.subtitle ||
            "Most meaningful stories begin with a single moment. Try the process today — it's completely free to start."}
        </p>

        {/* Call to Action Button */}
        {/* Using rounded-xl here to match the slightly softer rectangle shape in the design */}
        <button
          type="button"
          onClick={onDownloadStarterKit}
          className="inline-flex items-center gap-3 bg-[#4b92d4] hover:bg-[#3f7eb8] text-white font-medium text-sm sm:text-base px-8 py-4 rounded-xl transition-colors duration-200 shadow-lg"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          {content.finalCta.buttonText || 'Download the FREE Starter Kit'}
        </button>

        {/* Microcopy / Trust Text */}
        <p className="text-xs text-gray-400 mt-5 font-medium tracking-wide">
          {content.finalCta.microcopy || '"No Credit Card Required" - No Payment Required'}
        </p>

      </div>
    </section>
  );
};

type LeadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userName?: string) => void;
};

const LeadModal = ({ isOpen, onClose, onSuccess }: LeadModalProps) => {
  // Array for the bottom trust features to keep the code DRY
  const trustFeatures = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      text: "Tips, prompts & worksheets"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      text: "Simple step-by-step process"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      text: "Preserve memories for generations"
    }
  ];

  if (!isOpen) return null;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = String(formData.get('firstName') ?? '').trim();
    onSuccess(firstName || undefined);
  };

  return (
    // Modal Backdrop Overlay
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm font-sans overflow-y-auto">
      
      {/* Modal Container */}
      <div className="relative max-h-[95vh] flex flex-col md:flex-row w-full max-w-5xl bg-[#fcfcfb] rounded-[2rem] shadow-2xl overflow-y-auto overflow-x-hidden">
        
        {/* Left Column (Image & Book Graphic) */}
        <div 
          className="relative hidden md:flex flex-col items-center justify-center w-2/5 p-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/YOUR_MODAL_BG.jpg')" }} // Background behind the book
        >
          {/* Dark Overlay for the background image */}
          <div className="absolute inset-0 bg-[#1a2b3c]/80"></div>
          
          {/* Simulated 3D Book Graphic */}
          <div className="relative z-10 w-48 h-64 bg-[#e8c892] rounded-r-lg rounded-l-sm shadow-[15px_15px_20px_rgba(0,0,0,0.3)] flex flex-col items-center overflow-hidden border-l-[12px] border-[#cda766]">
            {/* Top image on the book */}
            <div 
              className="w-full h-[45%] bg-cover bg-center bg-[#cda766]"
              style={{ backgroundImage: "url('/YOUR_BOOK_COVER_IMG.jpg')" }}
            ></div>
            {/* Book Text */}
            <div className="flex-grow flex flex-col justify-center items-center text-[#5c4a2e] text-center p-3">
              <span className="text-[9px] uppercase tracking-widest font-bold mb-1">Free</span>
              <h4 className="text-sm font-bold leading-tight">Story<br/>Starter<br/>Kit</h4>
              <span className="text-[10px] mt-2">✦ ✦ ✦</span>
            </div>
          </div>

          {/* Under-book Text */}
          <p className="relative z-10 text-white text-sm font-medium mt-8 text-center px-4 leading-relaxed">
            Your family stories deserve to be remembered.
          </p>
        </div>

        {/* Right Column (Form & Content) */}
        <div className="relative w-full md:w-3/5 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-[#f4f8fb] text-[#4b92d4] text-[10px] font-bold tracking-wider uppercase w-max">
            <span className="text-[8px]">●</span> FREE DOWNLOAD
          </div>

          {/* Typography */}
          <h2 className="text-2xl sm:text-3xl font-bold text-[#221f1f] mb-3 leading-tight tracking-tight">
            Capture a Meaningful Memory — Even If You're Not a Writer
          </h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-md">
            Discover simple prompts to help you write and preserve your cherished family stories.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-3 w-full max-w-sm">
            
            {/* First Name Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="firstName" className="text-xs font-semibold text-gray-600 ml-1">First Name</label>
              <input 
                type="text" 
                id="firstName"
                name="firstName"
                placeholder="Your first name" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-gray-600 ml-1">Email Address</label>
              <input 
                type="email" 
                id="email"
                name="email"
                placeholder="your@email.com" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full mt-2 py-3.5 px-6 bg-[#4b92d4] hover:bg-[#3f7eb8] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
            >
              Get the FREE Starter Kit →
            </button>
          </form>

          {/* Microcopy */}
          <p className="text-[10px] text-gray-400 text-center max-w-sm mt-2 mb-10">
            No spam, ever. Unsubscribe at any time.
          </p>

          {/* Trust Features / Badges */}
          <div className="flex flex-row justify-between items-start gap-4 pt-6 border-t border-gray-100 max-w-md">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="flex gap-2 w-1/3">
                <div className="flex-shrink-0 w-6 h-6 rounded bg-[#f4f8fb] text-[#4b92d4] flex items-center justify-center">
                  {feature.icon}
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500 leading-tight">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
};

const SuccessModal = ({ isOpen, onClose, userName = "Muhammad" }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    // Modal Backdrop Overlay
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm font-sans overflow-y-auto">
      
      {/* Modal Container */}
      <div className="relative max-h-[95vh] flex flex-col md:flex-row w-full max-w-5xl bg-[#fcfcfb] rounded-[2rem] shadow-2xl overflow-y-auto overflow-x-hidden">
        
        {/* Left Column (Image & Book Graphic - Same as LeadModal) */}
        <div 
          className="relative hidden md:flex flex-col items-center justify-center w-2/5 p-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/YOUR_MODAL_BG.jpg')" }} 
        >
          <div className="absolute inset-0 bg-[#1a2b3c]/80"></div>
          
          <div className="relative z-10 w-48 h-64 bg-[#e8c892] rounded-r-lg rounded-l-sm shadow-[15px_15px_20px_rgba(0,0,0,0.3)] flex flex-col items-center overflow-hidden border-l-[12px] border-[#cda766]">
            <div 
              className="w-full h-[45%] bg-cover bg-center bg-[#cda766]"
              style={{ backgroundImage: "url('/YOUR_BOOK_COVER_IMG.jpg')" }}
            ></div>
            <div className="flex-grow flex flex-col justify-center items-center text-[#5c4a2e] text-center p-3">
              <span className="text-[9px] uppercase tracking-widest font-bold mb-1">Free</span>
              <h4 className="text-sm font-bold leading-tight">Story<br/>Starter<br/>Kit</h4>
              <span className="text-[10px] mt-2">✦ ✦ ✦</span>
            </div>
          </div>

          <p className="relative z-10 text-white text-sm font-medium mt-8 text-center px-4 leading-relaxed">
            Your family stories deserve to be remembered.
          </p>
        </div>

        {/* Right Column (Success Content) */}
        <div className="relative w-full md:w-3/5 p-8 sm:p-12 lg:p-14 flex flex-col justify-center items-center text-center bg-[#fcfcfb]">
          
          {/* Top Right Close Button (X) */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Success Checkmark Icon */}
          <div className="w-20 h-20 bg-[#f4f8fb] rounded-full flex items-center justify-center mb-8">
            <svg 
              className="w-8 h-8 text-[#4b92d4]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Typography */}
          <h2 className="text-2xl sm:text-3xl font-bold text-[#221f1f] mb-4 leading-tight tracking-tight">
            You're all set, {userName}!
          </h2>
          <p className="text-base text-gray-500 mb-10 leading-relaxed max-w-sm">
            Check your inbox — your free Story Starter Kit is on its way.
          </p>

          {/* Action Button */}
          <button 
            onClick={onClose}
            className="py-2.5 px-10 bg-transparent border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 font-medium text-sm rounded-xl transition-colors shadow-sm"
          >
            Close
          </button>

        </div>
      </div>
    </div>
  );
};

