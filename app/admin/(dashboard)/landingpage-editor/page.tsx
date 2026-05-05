"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  LandingPageContent,
  normalizeYouTubeEmbedUrl,
  readFileAsDataUrl,
} from "@/api/landingpageApis";
import {
  useAdminLandingPage,
  useUpdateAdminLandingPage,
  useUploadLandingPageImage,
} from "@/hooks/useLandingPage";
import { handleSessionExpiry } from "@/utils/handleSessionExpiry";

const DRAFT_KEY = "landingPageEditorDraft_v1";

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

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function deepMerge<T>(base: T, override: any): T {
  if (override === null || override === undefined) return base;
  if (Array.isArray(base))
    return (Array.isArray(override) ? override : base) as any;
  if (typeof base !== "object" || base === null) return override as T;
  const out: any = { ...(base as any) };
  if (typeof override !== "object" || override === null) return out;
  for (const [k, v] of Object.entries(override)) {
    if (k in out) out[k] = deepMerge(out[k], v);
    else out[k] = v;
  }
  return out as T;
}

function ImagePicker({
  label,
  value,
  onChange,
  folder,
  token,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  token: string | null;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const uploadMutation = useUploadLandingPageImage();

  const disabled = !token || uploadMutation.isPending;

  const pick = () => fileRef.current?.click();

  const onFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!token) return toast.error("Please login again");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const url = await uploadMutation.mutateAsync({
        token,
        imageDataUrl: dataUrl,
        folder,
      });
      onChange(url);
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload image");
    } finally {
      // allow selecting the same file again
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-3">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className="w-32 h-20 bg-[#f1f3f6] border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 overflow-hidden">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
        />

        <button
          type="button"
          disabled={disabled}
          onClick={pick}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          {uploadMutation.isPending ? "Uploading..." : "Upload Image"}
        </button>
      </div>
    </div>
  );
}

export default function LandingPageEditor() {
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const { data: serverContent, isLoading, error } = useAdminLandingPage(token);
  const updateMutation = useUpdateAdminLandingPage();

  const [content, setContent] = useState<LandingPageContent>(DEFAULT_CONTENT);
  const [hydrated, setHydrated] = useState(false);
  const dirtyRef = useRef(false);
  const restoredRef = useRef(false);

  const mergedFromServer = useMemo(
    () => serverContent ?? DEFAULT_CONTENT,
    [serverContent],
  );

  // hydrate state from server + local draft
  useEffect(() => {
    if (hydrated) return;
    if (isLoading) return;

    // handle auth errors in a consistent way
    if (error) {
      const msg = (error as any)?.message || "Failed to load landing page";
      if (handleSessionExpiry(msg, router, true)) return;
      toast.error(msg);
    }

    const draft = safeJsonParse<{
      content: LandingPageContent;
      savedAt: number;
    }>(typeof window !== "undefined" ? localStorage.getItem(DRAFT_KEY) : null);

    let next = mergedFromServer;
    if (draft?.content) {
      next = deepMerge(mergedFromServer, draft.content);
      if (!restoredRef.current) {
        restoredRef.current = true;
        toast.message("Restored unsaved draft");
      }
    }

    setContent(next);
    setHydrated(true);
  }, [hydrated, isLoading, mergedFromServer, error, router]);

  // autosave draft
  useEffect(() => {
    if (!hydrated) return;
    if (!dirtyRef.current) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ content, savedAt: Date.now() }),
        );
      } catch {
        // ignore
      }
    }, 500);
    return () => clearTimeout(t);
  }, [content, hydrated]);

  const markDirty = () => {
    dirtyRef.current = true;
  };

  const saveAll = async () => {
    if (!token) return toast.error("Please login again");
    try {
      await updateMutation.mutateAsync({ token, content });
      dirtyRef.current = false;
      localStorage.removeItem(DRAFT_KEY);
      toast.success("Landing page saved");
    } catch (err: any) {
      const msg = err?.message || "Failed to save landing page";
      if (handleSessionExpiry(msg, router, true)) return;
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f9] p-6 sm:p-10 font-sans text-gray-800">
      {/* Top Action Bar */}
      <div className="w-full bg-white rounded-xl p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl font-bold text-[#1e293b]">
          Marketing Free-Trial Page Editor
        </h1>
        <button
          type="button"
          onClick={saveAll}
          disabled={updateMutation.isPending}
          className="inline-flex items-center gap-2 bg-[#4b92d4] hover:bg-[#3a7ebd] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          {updateMutation.isPending ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <HeroSectionEditor
        content={content}
        setContent={setContent}
        markDirty={markDirty}
        token={token}
      />
      <StartWithOneMemoryEditor
        content={content}
        setContent={setContent}
        markDirty={markDirty}
      />
      <WatchMemoryEditor
        content={content}
        setContent={setContent}
        markDirty={markDirty}
      />
      <FeaturesSectionEditor
        content={content}
        setContent={setContent}
        markDirty={markDirty}
        token={token}
      />
      <LearningSectionEditor
        content={content}
        setContent={setContent}
        markDirty={markDirty}
      />
      <SupportSectionEditor
        content={content}
        setContent={setContent}
        markDirty={markDirty}
      />
      <PricingSectionEditor
        content={content}
        setContent={setContent}
        markDirty={markDirty}
      />
      <GuaranteeSectionEditor
        content={content}
        setContent={setContent}
        markDirty={markDirty}
      />
      <FinalCTASectionEditor
        content={content}
        setContent={setContent}
        markDirty={markDirty}
        token={token}
        onSave={saveAll}
        saving={updateMutation.isPending}
      />
    </div>
  );
}

const HeroSectionEditor = ({
  content,
  setContent,
  markDirty,
  token,
}: {
  content: LandingPageContent;
  setContent: React.Dispatch<React.SetStateAction<LandingPageContent>>;
  markDirty: () => void;
  token: string | null;
}) => {
  const smallPoints = [
    { idx: 0, id: "point1" },
    { idx: 1, id: "point2" },
    { idx: 2, id: "point3" },
  ];

  return (
    <div className="w-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      {/* Card Header */}
      <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#1e293b]">1. Hero Section</h2>
      </div>

      {/* Card Body / Form */}
      <div className="p-6 sm:p-8 flex flex-col gap-6">
        {/* Badge Text */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="badgeText"
            className="text-sm font-semibold text-gray-600"
          >
            Badge Text
          </label>
          <input
            type="text"
            id="badgeText"
            value={content.hero.badgeText}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                hero: { ...prev.hero, badgeText: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* Main Heading */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="mainHeading"
            className="text-sm font-semibold text-gray-600"
          >
            Main Heading
          </label>
          <input
            type="text"
            id="mainHeading"
            value={content.hero.mainHeading}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                hero: { ...prev.hero, mainHeading: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* Sub Heading */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="subHeading"
            className="text-sm font-semibold text-gray-600"
          >
            Sub Heading
          </label>
          <textarea
            id="subHeading"
            rows={4}
            value={content.hero.subHeading}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                hero: { ...prev.hero, subHeading: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors resize-none"
          ></textarea>
        </div>

        {/* Buttons Text Grid */}
        <div className="flex flex-col gap-2">
          <label htmlFor="btn1" className="text-sm font-semibold text-gray-600">
            CTA Button Text
          </label>
          <input
            type="text"
            id="btn1"
            value={content.hero.button1Text}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                hero: { ...prev.hero, button1Text: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4]"
          />
        </div>

        {/* Small Points (3 items) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">
            Small Points (3 items)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {smallPoints.map((point) => (
              <input
                key={point.id}
                type="text"
                value={content.hero.smallPoints[point.idx] ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  markDirty();
                  setContent((prev) => {
                    const nextPoints = [...(prev.hero.smallPoints || [])];
                    nextPoints[point.idx] = val;
                    return {
                      ...prev,
                      hero: { ...prev.hero, smallPoints: nextPoints },
                    };
                  });
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-400 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4]"
              />
            ))}
          </div>
        </div>

        <ImagePicker
          label="Background Image"
          value={content.hero.backgroundImageUrl}
          token={token}
          folder="landing_page/hero"
          onChange={(url) => {
            markDirty();
            setContent((prev) => ({
              ...prev,
              hero: { ...prev.hero, backgroundImageUrl: url },
            }));
          }}
        />
      </div>
    </div>
  );
};

const StartWithOneMemoryEditor = ({
  content,
  setContent,
  markDirty,
}: {
  content: LandingPageContent;
  setContent: React.Dispatch<React.SetStateAction<LandingPageContent>>;
  markDirty: () => void;
}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-8 font-sans">
      {/* Card Header */}
      <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#1e293b]">
          2. "Start with One Memory" Section
        </h2>
      </div>

      {/* Card Body / Form */}
      <div className="p-6 sm:p-8 flex flex-col gap-6">
        {/* Eyebrow Text */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="startEyebrow"
            className="text-sm font-semibold text-gray-600"
          >
            Eyebrow Text
          </label>
          <input
            type="text"
            id="startEyebrow"
            value={content.startWithOneMemory.eyebrowText ?? ""}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                startWithOneMemory: {
                  ...prev.startWithOneMemory,
                  eyebrowText: e.target.value,
                },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* Section Title */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="sectionTitle"
            className="text-sm font-semibold text-gray-600"
          >
            Section Title
          </label>
          <input
            type="text"
            id="sectionTitle"
            value={content.startWithOneMemory.title}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                startWithOneMemory: {
                  ...prev.startWithOneMemory,
                  title: e.target.value,
                },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* Description Text */}
        {/* Checklist Items */}
        <div className="flex flex-col gap-3 mt-1">
          <label className="text-sm font-semibold text-gray-600">
            Checklist Items
          </label>

          <div className="flex flex-col gap-3">
            {(content.startWithOneMemory.checklistItems || []).map(
              (item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const val = e.target.value;
                      markDirty();
                      setContent((prev) => {
                        const next = [
                          ...(prev.startWithOneMemory.checklistItems || []),
                        ];
                        next[index] = val;
                        return {
                          ...prev,
                          startWithOneMemory: {
                            ...prev.startWithOneMemory,
                            checklistItems: next,
                          },
                        };
                      });
                    }}
                    className="grow px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      markDirty();
                      setContent((prev) => {
                        const next = [
                          ...(prev.startWithOneMemory.checklistItems || []),
                        ];
                        next.splice(index, 1);
                        return {
                          ...prev,
                          startWithOneMemory: {
                            ...prev.startWithOneMemory,
                            checklistItems: next,
                          },
                        };
                      });
                    }}
                    className="shrink-0 text-red-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Remove checklist item"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                startWithOneMemory: {
                  ...prev.startWithOneMemory,
                  checklistItems: [
                    ...(prev.startWithOneMemory.checklistItems || []),
                    "",
                  ],
                },
              }));
            }}
            className="inline-flex items-center gap-1.5 text-[#4b92d4] hover:text-[#3a7ebd] text-xs font-medium mt-1 w-max transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Item
          </button>
        </div>

        {/* CTA Text */}
        <div className="flex flex-col gap-2 mt-1">
          <label
            htmlFor="startCtaText"
            className="text-sm font-semibold text-gray-600"
          >
            CTA Button Text
          </label>
          <input
            type="text"
            id="startCtaText"
            value={content.startWithOneMemory.ctaText ?? ""}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                startWithOneMemory: {
                  ...prev.startWithOneMemory,
                  ctaText: e.target.value,
                },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* Video Caption */}
        <div className="flex flex-col gap-2 mt-1">
          <label
            htmlFor="startVideoCaption"
            className="text-sm font-semibold text-gray-600"
          >
            Video Caption
          </label>
          <input
            type="text"
            id="startVideoCaption"
            value={content.startWithOneMemory.videoCaption ?? ""}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                startWithOneMemory: {
                  ...prev.startWithOneMemory,
                  videoCaption: e.target.value,
                },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="descriptionText"
            className="text-sm font-semibold text-gray-600"
          >
            Description Text
          </label>
          <textarea
            id="descriptionText"
            rows={4}
            value={content.startWithOneMemory.description}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                startWithOneMemory: {
                  ...prev.startWithOneMemory,
                  description: e.target.value,
                },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors resize-none"
          ></textarea>
        </div>

        {/* YouTube Embed Link */}
        <div className="flex flex-col gap-2 mt-1">
          <label
            htmlFor="startYoutubeEmbed"
            className="text-sm font-semibold text-gray-600"
          >
            YouTube Embed Link
          </label>
          <input
            type="text"
            id="startYoutubeEmbed"
            placeholder="Paste YouTube link (youtu.be / watch?v= / embed)"
            value={content.startWithOneMemory.videoUrl}
            onChange={(e) => {
              markDirty();
              const normalized = normalizeYouTubeEmbedUrl(e.target.value);
              setContent((prev) => ({
                ...prev,
                startWithOneMemory: {
                  ...prev.startWithOneMemory,
                  videoUrl: normalized,
                },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
          <p className="text-xs text-gray-400">
            You can paste any YouTube URL — it will be converted to an embed
            link.
          </p>
        </div>
      </div>
    </div>
  );
};

const WatchMemoryEditor = ({
  content,
  setContent,
  markDirty,
}: {
  content: LandingPageContent;
  setContent: React.Dispatch<React.SetStateAction<LandingPageContent>>;
  markDirty: () => void;
}) => {
  const timelineSteps = [
    { idx: 0, id: "timelineStep1", placeholder: "Share a Memory" },
    { idx: 1, id: "timelineStep2", placeholder: "We Craft Your Story" },
    { idx: 2, id: "timelineStep3", placeholder: "Cherish Forever" },
  ];

  return (
    <div className="w-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-8 font-sans">
      {/* Card Header */}
      <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#1e293b]">
          3. "Watch Memory Become Story" Section
        </h2>
      </div>

      {/* Card Body / Form */}
      <div className="p-6 sm:p-8 flex flex-col gap-6">
        {/* Eyebrow Text */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="watchEyebrow"
            className="text-sm font-semibold text-gray-600"
          >
            Eyebrow Text
          </label>
          <input
            type="text"
            id="watchEyebrow"
            value={content.watchMemory.eyebrowText ?? ""}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                watchMemory: {
                  ...prev.watchMemory,
                  eyebrowText: e.target.value,
                },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* Section Title */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="watchSectionTitle"
            className="text-sm font-semibold text-gray-600"
          >
            Section Title
          </label>
          <input
            type="text"
            id="watchSectionTitle"
            value={content.watchMemory.title}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                watchMemory: { ...prev.watchMemory, title: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* YouTube Embed Link */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="watchYoutubeEmbed"
            className="text-sm font-semibold text-gray-600"
          >
            YouTube Embed Link
          </label>
          <input
            type="text"
            id="watchYoutubeEmbed"
            placeholder="Paste YouTube link (youtu.be / watch?v= / embed)"
            value={content.watchMemory.videoUrl}
            onChange={(e) => {
              markDirty();
              const normalized = normalizeYouTubeEmbedUrl(e.target.value);
              setContent((prev) => ({
                ...prev,
                watchMemory: { ...prev.watchMemory, videoUrl: normalized },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
          <p className="text-xs text-gray-400">
            You can paste any YouTube URL — it will be converted to an embed
            link.
          </p>
        </div>

        {/* Timeline Texts (Stacked) */}
        {/* Video Caption */}
        <div className="flex flex-col gap-2 mt-1">
          <label
            htmlFor="watchVideoCaption"
            className="text-sm font-semibold text-gray-600"
          >
            Video Caption
          </label>
          <input
            type="text"
            id="watchVideoCaption"
            value={content.watchMemory.videoCaption ?? ""}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                watchMemory: {
                  ...prev.watchMemory,
                  videoCaption: e.target.value,
                },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Timeline Texts (3 steps)
          </label>

          <div className="flex flex-col gap-3">
            {timelineSteps.map((step) => (
              <input
                key={step.id}
                type="text"
                id={step.id}
                placeholder={step.placeholder}
                value={content.watchMemory.timelineSteps[step.idx] ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  markDirty();
                  setContent((prev) => {
                    const nextSteps = [
                      ...(prev.watchMemory.timelineSteps || []),
                    ];
                    nextSteps[step.idx] = val;
                    return {
                      ...prev,
                      watchMemory: {
                        ...prev.watchMemory,
                        timelineSteps: nextSteps,
                      },
                    };
                  });
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturesSectionEditor = ({
  content,
  setContent,
  markDirty,
  token,
}: {
  content: LandingPageContent;
  setContent: React.Dispatch<React.SetStateAction<LandingPageContent>>;
  markDirty: () => void;
  token: string | null;
}) => {
  const ensureFeatureCards = (
    cards: LandingPageContent["features"]["cards"],
  ) => {
    const next = Array.isArray(cards) ? [...cards] : [];
    while (next.length < 3)
      next.push({ title: "", description: "", imageUrl: "" });
    return next;
  };

  const featureCards = [
    { idx: 0, id: "card1", label: "Card 1" },
    { idx: 1, id: "card2", label: "Card 2" },
    { idx: 2, id: "card3", label: "Card 3" },
  ];

  return (
    <div className="w-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-8 font-sans">
      {/* Card Header */}
      <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#1e293b]">
          4. Features Section
        </h2>
      </div>

      {/* Card Body / Form */}
      <div className="p-6 sm:p-8 flex flex-col gap-6">
        {/* Eyebrow Text */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="featuresEyebrow"
            className="text-sm font-semibold text-gray-600"
          >
            Eyebrow Text
          </label>
          <input
            type="text"
            id="featuresEyebrow"
            value={content.features.eyebrowText ?? ""}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                features: { ...prev.features, eyebrowText: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* Section Title */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="featuresTitle"
            className="text-sm font-semibold text-gray-600"
          >
            Section Title
          </label>
          <input
            type="text"
            id="featuresTitle"
            value={content.features.title ?? ""}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                features: { ...prev.features, title: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {featureCards.map((card) => (
          <div
            key={card.id}
            className="bg-[#f9fafb] border border-gray-100 rounded-xl p-5 sm:p-6 flex flex-col gap-5"
          >
            {/* Inner Card Label */}
            <h3 className="text-sm font-bold text-[#1e293b]">{card.label}</h3>

            {/* Title Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor={`${card.id}-title`}
                className="text-xs font-semibold text-gray-600"
              >
                Title
              </label>
              <input
                type="text"
                id={`${card.id}-title`}
                value={content.features.cards[card.idx]?.title ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  markDirty();
                  setContent((prev) => {
                    const cards = ensureFeatureCards(prev.features.cards);
                    cards[card.idx] = {
                      ...(cards[card.idx] || {
                        title: "",
                        description: "",
                        imageUrl: "",
                      }),
                      title: val,
                    };
                    return { ...prev, features: { ...prev.features, cards } };
                  });
                }}
                className="w-full px-3 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
              />
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor={`${card.id}-desc`}
                className="text-xs font-semibold text-gray-600"
              >
                Description
              </label>
              <textarea
                id={`${card.id}-desc`}
                rows={4}
                value={content.features.cards[card.idx]?.description ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  markDirty();
                  setContent((prev) => {
                    const cards = ensureFeatureCards(prev.features.cards);
                    cards[card.idx] = {
                      ...(cards[card.idx] || {
                        title: "",
                        description: "",
                        imageUrl: "",
                      }),
                      description: val,
                    };
                    return { ...prev, features: { ...prev.features, cards } };
                  });
                }}
                className="w-full px-3 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors resize-none"
              ></textarea>
            </div>

            {/* Icon/Image Upload */}
            <ImagePicker
              label="Card Image"
              value={content.features.cards[card.idx]?.imageUrl ?? ""}
              token={token}
              folder="landing_page/features"
              onChange={(url) => {
                markDirty();
                setContent((prev) => {
                  const cards = ensureFeatureCards(prev.features.cards);
                  cards[card.idx] = {
                    ...(cards[card.idx] || {
                      title: "",
                      description: "",
                      imageUrl: "",
                    }),
                    imageUrl: url,
                  };
                  return { ...prev, features: { ...prev.features, cards } };
                });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const LearningSectionEditor = ({
  content,
  setContent,
  markDirty,
}: {
  content: LandingPageContent;
  setContent: React.Dispatch<React.SetStateAction<LandingPageContent>>;
  markDirty: () => void;
}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-8 font-sans">
      {/* Card Header */}
      <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#1e293b]">
          5. Learning Section
        </h2>
      </div>

      {/* Card Body / Form */}
      <div className="p-6 sm:p-8 flex flex-col gap-6">
        {/* Eyebrow Text */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="learningEyebrow"
            className="text-sm font-semibold text-gray-600"
          >
            Eyebrow Text
          </label>
          <input
            type="text"
            id="learningEyebrow"
            value={content.learning.eyebrowText ?? ""}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                learning: { ...prev.learning, eyebrowText: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* Section Title */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="learningSectionTitle"
            className="text-sm font-semibold text-gray-600"
          >
            Section Title
          </label>
          <input
            type="text"
            id="learningSectionTitle"
            value={content.learning.title}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                learning: { ...prev.learning, title: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* Video Link */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="learningVideoUrl"
            className="text-sm font-semibold text-gray-600"
          >
            Video (YouTube link)
          </label>
          <input
            type="text"
            id="learningVideoUrl"
            value={content.learning.videoUrl ?? ""}
            onChange={(e) => {
              const normalized = normalizeYouTubeEmbedUrl(e.target.value);
              markDirty();
              setContent((prev) => ({
                ...prev,
                learning: { ...prev.learning, videoUrl: normalized },
              }));
            }}
            placeholder="Paste YouTube link (watch, youtu.be, shorts, or embed)"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* Video Caption */}
        <div className="flex flex-col gap-2 mt-1">
          <label
            htmlFor="learningVideoCaption"
            className="text-sm font-semibold text-gray-600"
          >
            Video Caption
          </label>
          <input
            type="text"
            id="learningVideoCaption"
            value={content.learning.videoCaption ?? ""}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                learning: { ...prev.learning, videoCaption: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* List Heading */}
        <div className="flex flex-col gap-2 mt-1">
          <label
            htmlFor="learningListHeading"
            className="text-sm font-semibold text-gray-600"
          >
            List Heading
          </label>
          <input
            type="text"
            id="learningListHeading"
            value={content.learning.listHeading ?? ""}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                learning: { ...prev.learning, listHeading: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* Starter Kit Button Text */}
        <div className="flex flex-col gap-2 mt-1">
          <label
            htmlFor="learningButtonText"
            className="text-sm font-semibold text-gray-600"
          >
            Starter Kit Button Text
          </label>
          <input
            type="text"
            id="learningButtonText"
            value={content.learning.buttonText ?? ""}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                learning: { ...prev.learning, buttonText: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

const SupportSectionEditor = ({
  content,
  setContent,
  markDirty,
}: {
  content: LandingPageContent;
  setContent: React.Dispatch<React.SetStateAction<LandingPageContent>>;
  markDirty: () => void;
}) => {
  const ensureSupportCards = (
    cards: LandingPageContent["support"]["cards"],
  ) => {
    const next = Array.isArray(cards) ? [...cards] : [];
    while (next.length < 2) {
      next.push({
        badgeText: "",
        title: "",
        description: "",
        videoLabel: "",
        videoUrl: "",
        imageUrl: "",
      });
    }
    return next;
  };

  const supportCards = [
    { idx: 0, id: "support1", label: "Card 1" },
    { idx: 1, id: "support2", label: "Card 2" },
  ];

  const cardsForRender = ensureSupportCards(content.support.cards);

  return (
    <div className="w-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-8 font-sans">
      {/* Card Header */}
      <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#1e293b]">6. Support Section</h2>
      </div>

      {/* Card Body / Form */}
      <div className="p-6 sm:p-8 flex flex-col gap-6">
        {/* Eyebrow Text */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="supportEyebrow"
            className="text-sm font-semibold text-gray-600"
          >
            Eyebrow Text
          </label>
          <input
            type="text"
            id="supportEyebrow"
            value={content.support.eyebrowText ?? ""}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                support: { ...prev.support, eyebrowText: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* Section Title */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="supportMainTitle"
            className="text-sm font-semibold text-gray-600"
          >
            Section Title
          </label>
          <input
            type="text"
            id="supportMainTitle"
            value={content.support.title}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                support: { ...prev.support, title: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* Support Cards Wrapper */}
        <div className="flex flex-col gap-5 mt-2">
          {supportCards.map((card) => (
            <div
              key={card.id}
              className="bg-[#f9fafb] border border-gray-100 rounded-xl p-5 sm:p-6 flex flex-col gap-5"
            >
              {/* Inner Card Label */}
              <h3 className="text-sm font-bold text-[#1e293b]">{card.label}</h3>

              {/* Title Input */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${card.id}-title`}
                  className="text-xs font-semibold text-gray-500"
                >
                  Title
                </label>
                <input
                  type="text"
                  id={`${card.id}-title`}
                  value={cardsForRender[card.idx]?.title ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    markDirty();
                    setContent((prev) => {
                      const cards = ensureSupportCards(prev.support.cards);
                      cards[card.idx] = {
                        ...(cards[card.idx] || {
                          badgeText: "",
                          title: "",
                          description: "",
                          videoLabel: "",
                          videoUrl: "",
                          imageUrl: "",
                        }),
                        title: val,
                      };
                      return { ...prev, support: { ...prev.support, cards } };
                    });
                  }}
                  className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
                />
              </div>

              {/* Badge Text */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${card.id}-badge`}
                  className="text-xs font-semibold text-gray-500"
                >
                  Badge Text
                </label>
                <input
                  type="text"
                  id={`${card.id}-badge`}
                  value={cardsForRender[card.idx]?.badgeText ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    markDirty();
                    setContent((prev) => {
                      const cards = ensureSupportCards(prev.support.cards);
                      const current = cards[card.idx] || {
                        badgeText: "",
                        title: "",
                        description: "",
                        videoLabel: "",
                        videoUrl: "",
                        imageUrl: "",
                      };
                      cards[card.idx] = { ...current, badgeText: val };
                      return { ...prev, support: { ...prev.support, cards } };
                    });
                  }}
                  className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${card.id}-desc`}
                  className="text-xs font-semibold text-gray-500"
                >
                  Description
                </label>
                <textarea
                  id={`${card.id}-desc`}
                  rows={3}
                  value={cardsForRender[card.idx]?.description ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    markDirty();
                    setContent((prev) => {
                      const cards = ensureSupportCards(prev.support.cards);
                      const current = cards[card.idx] || {
                        badgeText: "",
                        title: "",
                        description: "",
                        videoLabel: "",
                        videoUrl: "",
                        imageUrl: "",
                      };
                      cards[card.idx] = { ...current, description: val };
                      return { ...prev, support: { ...prev.support, cards } };
                    });
                  }}
                  className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors resize-none"
                />
              </div>

              {/* Video Label */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${card.id}-videoLabel`}
                  className="text-xs font-semibold text-gray-500"
                >
                  Video Label
                </label>
                <input
                  type="text"
                  id={`${card.id}-videoLabel`}
                  value={cardsForRender[card.idx]?.videoLabel ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    markDirty();
                    setContent((prev) => {
                      const cards = ensureSupportCards(prev.support.cards);
                      const current = cards[card.idx] || {
                        badgeText: "",
                        title: "",
                        description: "",
                        videoLabel: "",
                        videoUrl: "",
                        imageUrl: "",
                      };
                      cards[card.idx] = { ...current, videoLabel: val };
                      return { ...prev, support: { ...prev.support, cards } };
                    });
                  }}
                  className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
                />
              </div>

              {/* Video Link */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${card.id}-videoUrl`}
                  className="text-xs font-semibold text-gray-500"
                >
                  Video (YouTube link)
                </label>
                <input
                  type="text"
                  id={`${card.id}-videoUrl`}
                  value={cardsForRender[card.idx]?.videoUrl ?? ""}
                  onChange={(e) => {
                    const val = normalizeYouTubeEmbedUrl(e.target.value);
                    markDirty();
                    setContent((prev) => {
                      const cards = ensureSupportCards(prev.support.cards);
                      const current = cards[card.idx] || {
                        badgeText: "",
                        title: "",
                        description: "",
                        videoLabel: "",
                        videoUrl: "",
                        imageUrl: "",
                      };
                      cards[card.idx] = { ...current, videoUrl: val };
                      return { ...prev, support: { ...prev.support, cards } };
                    });
                  }}
                  placeholder="Paste YouTube link"
                  className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PricingSectionEditor = ({
  content,
  setContent,
  markDirty,
}: {
  content: LandingPageContent;
  setContent: React.Dispatch<React.SetStateAction<LandingPageContent>>;
  markDirty: () => void;
}) => {
  const pricingPlans = [
    { idx: 0, id: "diy", label: "DIY Plan" },
    { idx: 1, id: "guided", label: "Guided Plan" },
  ];

  return (
    <div className="w-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-8 font-sans">
      {/* Card Header */}
      <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#1e293b]">7. Pricing Section</h2>
      </div>

      {/* Card Body / Form */}
      <div className="p-6 sm:p-8 flex flex-col gap-8">
        {/* Eyebrow / Title / Subtitle / Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="pricingEyebrow"
              className="text-sm font-semibold text-gray-600"
            >
              Eyebrow Text
            </label>
            <input
              type="text"
              id="pricingEyebrow"
              value={content.pricing.eyebrowText ?? ""}
              onChange={(e) => {
                markDirty();
                setContent((prev) => ({
                  ...prev,
                  pricing: { ...prev.pricing, eyebrowText: e.target.value },
                }));
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="pricingTitle"
              className="text-sm font-semibold text-gray-600"
            >
              Section Title
            </label>
            <input
              type="text"
              id="pricingTitle"
              value={content.pricing.title ?? ""}
              onChange={(e) => {
                markDirty();
                setContent((prev) => ({
                  ...prev,
                  pricing: { ...prev.pricing, title: e.target.value },
                }));
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="pricingSubtitle"
            className="text-sm font-semibold text-gray-600"
          >
            Subtitle (use new lines to break)
          </label>
          <textarea
            id="pricingSubtitle"
            rows={3}
            value={content.pricing.subtitle ?? ""}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                pricing: { ...prev.pricing, subtitle: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="pricingFooterNote"
            className="text-sm font-semibold text-gray-600"
          >
            Footer Note
          </label>
          <input
            type="text"
            id="pricingFooterNote"
            value={content.pricing.footerNote ?? ""}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                pricing: { ...prev.pricing, footerNote: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-[#f9fafb] border border-gray-100 rounded-xl p-5 sm:p-6 flex flex-col gap-5"
          >
            {/* Inner Card Label */}
            <h3 className="text-sm font-bold text-[#1e293b]">{plan.label}</h3>

            {/* Plan Name Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor={`${plan.id}-name`}
                className="text-xs font-semibold text-gray-500"
              >
                Plan Name
              </label>
              <input
                type="text"
                id={`${plan.id}-name`}
                value={content.pricing.plans[plan.idx]?.name ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  markDirty();
                  setContent((prev) => {
                    const plans = [...prev.pricing.plans];
                    const current = plans[plan.idx] || {
                      name: "",
                      price: "",
                      description: "",
                      features: [],
                    };
                    plans[plan.idx] = { ...current, name: val };
                    return { ...prev, pricing: { ...prev.pricing, plans } };
                  });
                }}
                className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
              />
            </div>

            {/* Price Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor={`${plan.id}-price`}
                className="text-xs font-semibold text-gray-500"
              >
                Price
              </label>
              <input
                type="text"
                id={`${plan.id}-price`}
                value={content.pricing.plans[plan.idx]?.price ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  markDirty();
                  setContent((prev) => {
                    const plans = [...prev.pricing.plans];
                    const current = plans[plan.idx] || {
                      name: "",
                      price: "",
                      description: "",
                      features: [],
                    };
                    plans[plan.idx] = { ...current, price: val };
                    return { ...prev, pricing: { ...prev.pricing, plans } };
                  });
                }}
                className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
              />
            </div>

            {/* Badges / Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${plan.id}-badgeText`}
                  className="text-xs font-semibold text-gray-500"
                >
                  Badge Text
                </label>
                <input
                  type="text"
                  id={`${plan.id}-badgeText`}
                  value={content.pricing.plans[plan.idx]?.badgeText ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    markDirty();
                    setContent((prev) => {
                      const plans = [...prev.pricing.plans];
                      const current = plans[plan.idx] || {
                        name: "",
                        price: "",
                        description: "",
                        features: [],
                      };
                      plans[plan.idx] = { ...current, badgeText: val };
                      return { ...prev, pricing: { ...prev.pricing, plans } };
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${plan.id}-buttonText`}
                  className="text-xs font-semibold text-gray-500"
                >
                  Button Text
                </label>
                <input
                  type="text"
                  id={`${plan.id}-buttonText`}
                  value={content.pricing.plans[plan.idx]?.buttonText ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    markDirty();
                    setContent((prev) => {
                      const plans = [...prev.pricing.plans];
                      const current = plans[plan.idx] || {
                        name: "",
                        price: "",
                        description: "",
                        features: [],
                      };
                      plans[plan.idx] = { ...current, buttonText: val };
                      return { ...prev, pricing: { ...prev.pricing, plans } };
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${plan.id}-currency`}
                  className="text-xs font-semibold text-gray-500"
                >
                  Currency
                </label>
                <input
                  type="text"
                  id={`${plan.id}-currency`}
                  value={content.pricing.plans[plan.idx]?.currency ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    markDirty();
                    setContent((prev) => {
                      const plans = [...prev.pricing.plans];
                      const current = plans[plan.idx] || {
                        name: "",
                        price: "",
                        description: "",
                        features: [],
                      };
                      plans[plan.idx] = { ...current, currency: val };
                      return { ...prev, pricing: { ...prev.pricing, plans } };
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${plan.id}-period`}
                  className="text-xs font-semibold text-gray-500"
                >
                  Period
                </label>
                <input
                  type="text"
                  id={`${plan.id}-period`}
                  value={content.pricing.plans[plan.idx]?.period ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    markDirty();
                    setContent((prev) => {
                      const plans = [...prev.pricing.plans];
                      const current = plans[plan.idx] || {
                        name: "",
                        price: "",
                        description: "",
                        features: [],
                      };
                      plans[plan.idx] = { ...current, period: val };
                      return { ...prev, pricing: { ...prev.pricing, plans } };
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id={`${plan.id}-isRecommended`}
                  checked={Boolean(
                    content.pricing.plans[plan.idx]?.isRecommended,
                  )}
                  onChange={(e) => {
                    const val = e.target.checked;
                    markDirty();
                    setContent((prev) => {
                      const plans = [...prev.pricing.plans];
                      const current = plans[plan.idx] || {
                        name: "",
                        price: "",
                        description: "",
                        features: [],
                      };
                      plans[plan.idx] = { ...current, isRecommended: val };
                      return { ...prev, pricing: { ...prev.pricing, plans } };
                    });
                  }}
                  className="h-4 w-4"
                />
                <label
                  htmlFor={`${plan.id}-isRecommended`}
                  className="text-xs font-semibold text-gray-500"
                >
                  Recommended
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor={`${plan.id}-recommendedBadge`}
                className="text-xs font-semibold text-gray-500"
              >
                Recommended Badge
              </label>
              <input
                type="text"
                id={`${plan.id}-recommendedBadge`}
                value={content.pricing.plans[plan.idx]?.recommendedBadge ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  markDirty();
                  setContent((prev) => {
                    const plans = [...prev.pricing.plans];
                    const current = plans[plan.idx] || {
                      name: "",
                      price: "",
                      description: "",
                      features: [],
                    };
                    plans[plan.idx] = { ...current, recommendedBadge: val };
                    return { ...prev, pricing: { ...prev.pricing, plans } };
                  });
                }}
                className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
              />
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor={`${plan.id}-desc`}
                className="text-xs font-semibold text-gray-500"
              >
                Description
              </label>
              <textarea
                id={`${plan.id}-desc`}
                rows={3}
                value={content.pricing.plans[plan.idx]?.description ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  markDirty();
                  setContent((prev) => {
                    const plans = [...prev.pricing.plans];
                    const current = plans[plan.idx] || {
                      name: "",
                      price: "",
                      description: "",
                      features: [],
                    };
                    plans[plan.idx] = { ...current, description: val };
                    return { ...prev, pricing: { ...prev.pricing, plans } };
                  });
                }}
                className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors resize-none"
              ></textarea>
            </div>

            {/* Features List Section */}
            <div className="flex flex-col gap-3 mt-1">
              <label className="text-xs font-semibold text-gray-500">
                Features
              </label>

              {/* Dynamic Feature Inputs */}
              <div className="flex flex-col gap-3">
                {(content.pricing.plans[plan.idx]?.features || []).map(
                  (feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const val = e.target.value;
                          markDirty();
                          setContent((prev) => {
                            const plans = [...prev.pricing.plans];
                            const current = plans[plan.idx] || {
                              name: "",
                              price: "",
                              description: "",
                              features: [],
                            };
                            const nextFeatures = [...(current.features || [])];
                            nextFeatures[index] = val;
                            plans[plan.idx] = {
                              ...current,
                              features: nextFeatures,
                            };
                            return {
                              ...prev,
                              pricing: { ...prev.pricing, plans },
                            };
                          });
                        }}
                        className="grow px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-500 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
                      />
                      {/* Delete (Trash) Button */}
                      <button
                        type="button"
                        onClick={() => {
                          markDirty();
                          setContent((prev) => {
                            const plans = [...prev.pricing.plans];
                            const current = plans[plan.idx] || {
                              name: "",
                              price: "",
                              description: "",
                              features: [],
                            };
                            const nextFeatures = [...(current.features || [])];
                            nextFeatures.splice(index, 1);
                            plans[plan.idx] = {
                              ...current,
                              features: nextFeatures,
                            };
                            return {
                              ...prev,
                              pricing: { ...prev.pricing, plans },
                            };
                          });
                        }}
                        className="shrink-0 text-red-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove feature"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.75"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ),
                )}
              </div>

              {/* Add Feature Button */}
              <button
                type="button"
                onClick={() => {
                  markDirty();
                  setContent((prev) => {
                    const plans = [...prev.pricing.plans];
                    const current = plans[plan.idx] || {
                      name: "",
                      price: "",
                      description: "",
                      features: [],
                    };
                    plans[plan.idx] = {
                      ...current,
                      features: [...(current.features || []), ""],
                    };
                    return { ...prev, pricing: { ...prev.pricing, plans } };
                  });
                }}
                className="inline-flex items-center gap-1.5 text-[#4b92d4] hover:text-[#3a7ebd] text-xs font-medium mt-1 w-max transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Feature
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GuaranteeSectionEditor = ({
  content,
  setContent,
  markDirty,
}: {
  content: LandingPageContent;
  setContent: React.Dispatch<React.SetStateAction<LandingPageContent>>;
  markDirty: () => void;
}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-8 font-sans">
      {/* Card Header */}
      <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#1e293b]">
          8. Guarantee Section
        </h2>
      </div>

      {/* Card Body / Form */}
      <div className="p-6 sm:p-8 flex flex-col gap-6">
        {/* Eyebrow Text */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="guaranteeEyebrow"
            className="text-sm font-semibold text-gray-600"
          >
            Eyebrow Text
          </label>
          <input
            type="text"
            id="guaranteeEyebrow"
            value={content.guarantee.eyebrowText ?? ""}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                guarantee: { ...prev.guarantee, eyebrowText: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* Title Input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="guaranteeTitle"
            className="text-sm font-semibold text-gray-600"
          >
            Title
          </label>
          <input
            type="text"
            id="guaranteeTitle"
            value={content.guarantee.title}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                guarantee: { ...prev.guarantee, title: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>

        {/* Description Textarea */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="guaranteeDescription"
            className="text-sm font-semibold text-gray-600"
          >
            Description
          </label>
          <textarea
            id="guaranteeDescription"
            rows={4}
            value={content.guarantee.description}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                guarantee: { ...prev.guarantee, description: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors resize-none"
          ></textarea>
        </div>

        {/* Button Text Input */}
        {/* Pills */}
        <div className="flex flex-col gap-3 mt-1">
          <label className="text-sm font-semibold text-gray-600">Pills</label>

          <div className="flex flex-col gap-3">
            {(content.guarantee.pills || []).map((pill, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={pill}
                  onChange={(e) => {
                    const val = e.target.value;
                    markDirty();
                    setContent((prev) => {
                      const next = [...(prev.guarantee.pills || [])];
                      next[index] = val;
                      return {
                        ...prev,
                        guarantee: { ...prev.guarantee, pills: next },
                      };
                    });
                  }}
                  className="grow px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => {
                    markDirty();
                    setContent((prev) => {
                      const next = [...(prev.guarantee.pills || [])];
                      next.splice(index, 1);
                      return {
                        ...prev,
                        guarantee: { ...prev.guarantee, pills: next },
                      };
                    });
                  }}
                  className="shrink-0 text-red-400 hover:text-red-500 transition-colors p-1"
                  aria-label="Remove pill"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                guarantee: {
                  ...prev.guarantee,
                  pills: [...(prev.guarantee.pills || []), ""],
                },
              }));
            }}
            className="inline-flex items-center gap-1.5 text-[#4b92d4] hover:text-[#3a7ebd] text-xs font-medium mt-1 w-max transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Pill
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="guaranteeButtonText"
            className="text-sm font-semibold text-gray-600"
          >
            Button Text
          </label>
          <input
            type="text"
            id="guaranteeButtonText"
            value={content.guarantee.buttonText}
            onChange={(e) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                guarantee: { ...prev.guarantee, buttonText: e.target.value },
              }));
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

const FinalCTASectionEditor = ({
  content,
  setContent,
  markDirty,
  token,
  onSave,
  saving,
}: {
  content: LandingPageContent;
  setContent: React.Dispatch<React.SetStateAction<LandingPageContent>>;
  markDirty: () => void;
  token: string | null;
  onSave: () => void;
  saving: boolean;
}) => {
  return (
    <div className="font-sans">
      {/* Main Card */}
      <div className="w-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-8">
        {/* Card Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#1e293b]">
            9. Final CTA Section
          </h2>
        </div>

        {/* Card Body / Form */}
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          {/* Eyebrow Text */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="finalCtaEyebrow"
              className="text-sm font-semibold text-gray-600"
            >
              Eyebrow Text
            </label>
            <input
              type="text"
              id="finalCtaEyebrow"
              value={content.finalCta.eyebrowText ?? ""}
              onChange={(e) => {
                markDirty();
                setContent((prev) => ({
                  ...prev,
                  finalCta: { ...prev.finalCta, eyebrowText: e.target.value },
                }));
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
            />
          </div>

          {/* Title Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="finalCtaTitle"
              className="text-sm font-semibold text-gray-600"
            >
              Title
            </label>
            <input
              type="text"
              id="finalCtaTitle"
              value={content.finalCta.title}
              onChange={(e) => {
                markDirty();
                setContent((prev) => ({
                  ...prev,
                  finalCta: { ...prev.finalCta, title: e.target.value },
                }));
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
            />
          </div>

          {/* Subtitle Textarea */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="finalCtaSubtitle"
              className="text-sm font-semibold text-gray-600"
            >
              Subtitle
            </label>
            <textarea
              id="finalCtaSubtitle"
              rows={4}
              value={content.finalCta.subtitle}
              onChange={(e) => {
                markDirty();
                setContent((prev) => ({
                  ...prev,
                  finalCta: { ...prev.finalCta, subtitle: e.target.value },
                }));
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors resize-none"
            ></textarea>
          </div>

          <ImagePicker
            label="Background Image"
            value={content.finalCta.backgroundImageUrl}
            token={token}
            folder="landing_page/final_cta"
            onChange={(url) => {
              markDirty();
              setContent((prev) => ({
                ...prev,
                finalCta: { ...prev.finalCta, backgroundImageUrl: url },
              }));
            }}
          />

          {/* Button Text Input */}
          {/* Microcopy */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="finalCtaMicrocopy"
              className="text-sm font-semibold text-gray-600"
            >
              Microcopy
            </label>
            <input
              type="text"
              id="finalCtaMicrocopy"
              value={content.finalCta.microcopy ?? ""}
              onChange={(e) => {
                markDirty();
                setContent((prev) => ({
                  ...prev,
                  finalCta: { ...prev.finalCta, microcopy: e.target.value },
                }));
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="finalCtaButtonText"
              className="text-sm font-semibold text-gray-600"
            >
              Button Text
            </label>
            <input
              type="text"
              id="finalCtaButtonText"
              value={content.finalCta.buttonText}
              onChange={(e) => {
                markDirty();
                setContent((prev) => ({
                  ...prev,
                  finalCta: { ...prev.finalCta, buttonText: e.target.value },
                }));
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#4b92d4] focus:ring-1 focus:ring-[#4b92d4] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      <div className="w-full flex justify-end mt-6 mb-12">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#4b92d4] hover:bg-[#3a7ebd] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors shadow-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
};
