import { normalizeYouTubeEmbedUrl } from "./landingpageApis";

export type MarketingStep = {
  number: string;
  label: string;
  title: string;
  points: string[];
  timeNote?: string;
  copyBlockText?: string;
};

export type MarketingPageContent = {
  hero: {
    backgroundImageUrl: string;
    title: string;
    subtitle: string;
    description: string;
  };
  practiceStoryOne: {
    label: string;
    title: string;
    description: string;
    videoUrl: string;
  };
  gettingStartedOne: {
    title: string;
    subtitle: string;
    steps: MarketingStep[];
  };
  storyDevelopment: {
    title: string;
    subtitle: string;
    steps: MarketingStep[];
  };
  reviewAndComplete: {
    title: string;
    subtitle: string;
    steps: MarketingStep[];
  };
  practiceStoryTwo: {
    label: string;
    title: string;
    description: string;
    videoUrl: string;
  };
  gettingStartedTwo: {
    title: string;
    subtitle: string;
    steps: MarketingStep[];
  };
  refiningYourStory: {
    title: string;
    subtitle: string;
    steps: MarketingStep[];
  };
  complete: {
    title: string;
    subtitle: string;
    steps: MarketingStep[];
  };
  learningCenter: {
    title: string;
    paragraphs: string[];
    videoUrl: string;
    accountSetup: {
      title: string;
      subtitle: string;
      steps: MarketingStep[];
    };
  };
};

type MarketingResponse = {
  message: string;
  response: { data: MarketingPageContent; updatedAt?: string | null } | null;
  error: any;
};

const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

function assertBaseUrl() {
  if (!serverBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_SERVER_URL");
  }
}

export async function getMarketingPagePublic(): Promise<MarketingPageContent> {
  assertBaseUrl();
  const res = await fetch(`${serverBaseUrl}/user/marketing-page`, { cache: "no-store" });
  const data: MarketingResponse = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to fetch marketing page");
  if (!data?.response?.data) throw new Error("Invalid marketing page response");
  return data.response.data;
}

export async function getMarketingPageAdmin(token: string): Promise<MarketingPageContent> {
  assertBaseUrl();
  const res = await fetch(`${serverBaseUrl}/admin/marketing-page`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const data: MarketingResponse = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to fetch marketing page (admin)");
  if (!data?.response?.data) throw new Error("Invalid marketing page response");
  return data.response.data;
}

export async function updateMarketingPageAdmin(
  token: string,
  content: MarketingPageContent
): Promise<MarketingPageContent> {
  assertBaseUrl();
  const normalized: MarketingPageContent = {
    ...content,
    practiceStoryOne: {
      ...content.practiceStoryOne,
      videoUrl: normalizeYouTubeEmbedUrl(content.practiceStoryOne.videoUrl),
    },
    practiceStoryTwo: {
      ...content.practiceStoryTwo,
      videoUrl: normalizeYouTubeEmbedUrl(content.practiceStoryTwo.videoUrl),
    },
    learningCenter: {
      ...content.learningCenter,
      videoUrl: normalizeYouTubeEmbedUrl(content.learningCenter.videoUrl),
    },
  };

  const res = await fetch(`${serverBaseUrl}/admin/marketing-page`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content: normalized }),
  });
  const data: MarketingResponse = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to update marketing page");
  if (!data?.response?.data) throw new Error("Invalid marketing page response");
  return data.response.data;
}

export async function uploadMarketingPageImageAdmin(
  token: string,
  imageDataUrl: string,
  folder?: string
): Promise<string> {
  assertBaseUrl();
  const res = await fetch(`${serverBaseUrl}/admin/marketing-page/upload-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ image: imageDataUrl, folder }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to upload image");
  }
  const url = data?.response?.url;
  if (typeof url !== "string" || !url) {
    throw new Error("Invalid upload response");
  }
  return url;
}
