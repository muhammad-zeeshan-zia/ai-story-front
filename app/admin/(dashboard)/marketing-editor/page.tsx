"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { normalizeYouTubeEmbedUrl, readFileAsDataUrl } from "@/api/landingpageApis";
import { MarketingPageContent } from "@/api/marketingPageApis";
import {
  useAdminMarketingPage,
  useUpdateAdminMarketingPage,
  useUploadMarketingPageImage,
} from "@/hooks/useMarketingPage";

type NullableContent = MarketingPageContent | null;

function toMultiline(values?: string[]) {
  return (values || []).join("\n");
}

function fromMultiline(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function MarketingEditorPage() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { data, isLoading } = useAdminMarketingPage(token);
  const updateMutation = useUpdateAdminMarketingPage();
  const uploadMutation = useUploadMarketingPageImage();
  const heroFileRef = useRef<HTMLInputElement | null>(null);
  const [content, setContent] = useState<NullableContent>(null);

  useEffect(() => {
    if (data && !content) setContent(data);
  }, [data, content]);

  const saveAll = async () => {
    if (!token || !content) return toast.error("Please login again");
    try {
      await updateMutation.mutateAsync({ token, content });
      toast.success("Marketing page saved");
    } catch (error: any) {
      toast.error(error?.message || "Failed to save marketing page");
    }
  };

  if (isLoading || !content) {
    return <div className="p-8 text-gray-600">Loading marketing editor...</div>;
  }

  const uploadHeroImage: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!token) {
      toast.error("Please login again");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const uploadedUrl = await uploadMutation.mutateAsync({
        token,
        imageDataUrl: dataUrl,
        folder: "marketing_page/hero",
      });
      setContent((prev) =>
        prev
          ? { ...prev, hero: { ...prev.hero, backgroundImageUrl: uploadedUrl } }
          : prev
      );
      toast.success("Hero image uploaded");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload image");
    } finally {
      if (heroFileRef.current) heroFileRef.current.value = "";
    }
  };

  const renderStepEditor = (
    section:
      | "gettingStartedOne"
      | "storyDevelopment"
      | "reviewAndComplete"
      | "gettingStartedTwo"
      | "refiningYourStory"
      | "complete",
    title: string
  ) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <textarea
        rows={2}
        className="w-full rounded-lg border border-gray-200 px-3 py-2"
        value={content[section].title}
        onChange={(e) =>
          setContent((prev) =>
            prev ? { ...prev, [section]: { ...prev[section], title: e.target.value } } : prev
          )
        }
        placeholder="Section title"
      />
      <textarea
        rows={2}
        className="w-full rounded-lg border border-gray-200 px-3 py-2"
        value={content[section].subtitle}
        onChange={(e) =>
          setContent((prev) =>
            prev ? { ...prev, [section]: { ...prev[section], subtitle: e.target.value } } : prev
          )
        }
        placeholder="Section subtitle"
      />
      {content[section].steps.map((step, idx) => (
        <div key={idx} className="rounded-lg border border-gray-200 p-3 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <textarea
              rows={2}
              className="rounded border border-gray-200 px-2 py-1"
              value={step.number}
              onChange={(e) =>
                setContent((prev) => {
                  if (!prev) return prev;
                  const steps = [...prev[section].steps];
                  steps[idx] = { ...steps[idx], number: e.target.value };
                  return { ...prev, [section]: { ...prev[section], steps } };
                })
              }
              placeholder="Number"
            />
            <textarea
              rows={2}
              className="col-span-2 rounded border border-gray-200 px-2 py-1"
              value={step.label}
              onChange={(e) =>
                setContent((prev) => {
                  if (!prev) return prev;
                  const steps = [...prev[section].steps];
                  steps[idx] = { ...steps[idx], label: e.target.value };
                  return { ...prev, [section]: { ...prev[section], steps } };
                })
              }
              placeholder="Step label"
            />
          </div>
          <textarea
            rows={2}
            className="w-full rounded border border-gray-200 px-2 py-1"
            value={step.title}
            onChange={(e) =>
              setContent((prev) => {
                if (!prev) return prev;
                const steps = [...prev[section].steps];
                steps[idx] = { ...steps[idx], title: e.target.value };
                return { ...prev, [section]: { ...prev[section], steps } };
              })
            }
            placeholder="Step title"
          />
          <textarea
            className="w-full rounded border border-gray-200 px-2 py-1"
            rows={4}
            value={toMultiline(step.points)}
            onChange={(e) =>
              setContent((prev) => {
                if (!prev) return prev;
                const steps = [...prev[section].steps];
                steps[idx] = { ...steps[idx], points: fromMultiline(e.target.value) };
                return { ...prev, [section]: { ...prev[section], steps } };
              })
            }
            placeholder="One line per bullet point"
          />
          <textarea
            rows={2}
            className="w-full rounded border border-gray-200 px-2 py-1"
            value={step.timeNote || ""}
            onChange={(e) =>
              setContent((prev) => {
                if (!prev) return prev;
                const steps = [...prev[section].steps];
                steps[idx] = { ...steps[idx], timeNote: e.target.value };
                return { ...prev, [section]: { ...prev[section], steps } };
              })
            }
            placeholder="Optional time note"
          />
          {"copyBlockText" in step ? (
            <textarea
              className="w-full rounded border border-gray-200 px-2 py-1"
              rows={4}
              value={step.copyBlockText || ""}
              onChange={(e) =>
                setContent((prev) => {
                  if (!prev) return prev;
                  const steps = [...prev[section].steps];
                  steps[idx] = { ...steps[idx], copyBlockText: e.target.value };
                  return { ...prev, [section]: { ...prev[section], steps } };
                })
              }
              placeholder="Optional copy block text"
            />
          ) : null}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f6f9] p-6 space-y-6">
      <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Marketing Page Editor</h1>
        <button
          type="button"
          onClick={saveAll}
          disabled={updateMutation.isPending}
          className="bg-[#4b92d4] text-white px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800">Hero</h3>
        <div className="flex items-center gap-4">
          <div className="w-36 h-24 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center text-gray-400 text-xs">
            {content.hero.backgroundImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.hero.backgroundImageUrl}
                alt="Hero preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>No image</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={heroFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadHeroImage}
            />
            <button
              type="button"
              onClick={() => heroFileRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="w-max rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload Hero Image"}
            </button>
          </div>
        </div>
        <textarea rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2" value={content.hero.title} onChange={(e) => setContent((prev) => prev ? { ...prev, hero: { ...prev.hero, title: e.target.value } } : prev)} placeholder="Title" />
        <textarea rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2" value={content.hero.subtitle} onChange={(e) => setContent((prev) => prev ? { ...prev, hero: { ...prev.hero, subtitle: e.target.value } } : prev)} placeholder="Subtitle" />
        <textarea className="w-full rounded-lg border border-gray-200 px-3 py-2" rows={3} value={content.hero.description} onChange={(e) => setContent((prev) => prev ? { ...prev, hero: { ...prev.hero, description: e.target.value } } : prev)} placeholder="Description" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800">Practice Story 1</h3>
        <textarea rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2" value={content.practiceStoryOne.label} onChange={(e) => setContent((prev) => prev ? { ...prev, practiceStoryOne: { ...prev.practiceStoryOne, label: e.target.value } } : prev)} placeholder="Label" />
        <textarea rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2" value={content.practiceStoryOne.title} onChange={(e) => setContent((prev) => prev ? { ...prev, practiceStoryOne: { ...prev.practiceStoryOne, title: e.target.value } } : prev)} placeholder="Title" />
        <textarea className="w-full rounded-lg border border-gray-200 px-3 py-2" rows={4} value={content.practiceStoryOne.description} onChange={(e) => setContent((prev) => prev ? { ...prev, practiceStoryOne: { ...prev.practiceStoryOne, description: e.target.value } } : prev)} placeholder="Description" />
        <input className="w-full rounded-lg border border-gray-200 px-3 py-2" value={content.practiceStoryOne.videoUrl} onChange={(e) => setContent((prev) => prev ? { ...prev, practiceStoryOne: { ...prev.practiceStoryOne, videoUrl: normalizeYouTubeEmbedUrl(e.target.value) } } : prev)} placeholder="YouTube URL" />
      </div>

      {renderStepEditor("gettingStartedOne", "Getting Started (Practice 1)")}
      {renderStepEditor("storyDevelopment", "Story Development")}
      {renderStepEditor("reviewAndComplete", "Review and Complete")}

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800">Practice Story 2</h3>
        <textarea rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2" value={content.practiceStoryTwo.label} onChange={(e) => setContent((prev) => prev ? { ...prev, practiceStoryTwo: { ...prev.practiceStoryTwo, label: e.target.value } } : prev)} placeholder="Label" />
        <textarea rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2" value={content.practiceStoryTwo.title} onChange={(e) => setContent((prev) => prev ? { ...prev, practiceStoryTwo: { ...prev.practiceStoryTwo, title: e.target.value } } : prev)} placeholder="Title" />
        <textarea className="w-full rounded-lg border border-gray-200 px-3 py-2" rows={4} value={content.practiceStoryTwo.description} onChange={(e) => setContent((prev) => prev ? { ...prev, practiceStoryTwo: { ...prev.practiceStoryTwo, description: e.target.value } } : prev)} placeholder="Description" />
        <input className="w-full rounded-lg border border-gray-200 px-3 py-2" value={content.practiceStoryTwo.videoUrl} onChange={(e) => setContent((prev) => prev ? { ...prev, practiceStoryTwo: { ...prev.practiceStoryTwo, videoUrl: normalizeYouTubeEmbedUrl(e.target.value) } } : prev)} placeholder="YouTube URL" />
      </div>

      {renderStepEditor("gettingStartedTwo", "Getting Started (Practice 2)")}
      {renderStepEditor("refiningYourStory", "Refining Your Story")}
      {renderStepEditor("complete", "Complete")}

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800">Learning Center</h3>
        <textarea rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2" value={content.learningCenter.title} onChange={(e) => setContent((prev) => prev ? { ...prev, learningCenter: { ...prev.learningCenter, title: e.target.value } } : prev)} placeholder="Section title" />
        <textarea className="w-full rounded-lg border border-gray-200 px-3 py-2" rows={4} value={toMultiline(content.learningCenter.paragraphs)} onChange={(e) => setContent((prev) => prev ? { ...prev, learningCenter: { ...prev.learningCenter, paragraphs: fromMultiline(e.target.value) } } : prev)} placeholder="Paragraphs (one per line)" />
        <input className="w-full rounded-lg border border-gray-200 px-3 py-2" value={content.learningCenter.videoUrl} onChange={(e) => setContent((prev) => prev ? { ...prev, learningCenter: { ...prev.learningCenter, videoUrl: normalizeYouTubeEmbedUrl(e.target.value) } } : prev)} placeholder="YouTube URL" />
        <textarea rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2" value={content.learningCenter.accountSetup.title} onChange={(e) => setContent((prev) => prev ? { ...prev, learningCenter: { ...prev.learningCenter, accountSetup: { ...prev.learningCenter.accountSetup, title: e.target.value } } } : prev)} placeholder="Account setup title" />
        <textarea rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2" value={content.learningCenter.accountSetup.subtitle} onChange={(e) => setContent((prev) => prev ? { ...prev, learningCenter: { ...prev.learningCenter, accountSetup: { ...prev.learningCenter.accountSetup, subtitle: e.target.value } } } : prev)} placeholder="Account setup subtitle" />
      </div>
    </div>
  );
}
