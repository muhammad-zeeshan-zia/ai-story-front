export type LandingPageContent = {
  navbar: {
    logoUrl: string;
    menuItems: string[];
    ctaText: string;
  };
  hero: {
    badgeText: string;
    mainHeading: string;
    subHeading: string;
    button1Text: string;
    button2Text: string;
    smallPoints: string[];
    videoUrl: string;
    backgroundImageUrl: string;
  };
  startWithOneMemory: {
    eyebrowText?: string;
    title: string;
    // Used as the short subtitle line under the section title (matches Landing Page 2 design)
    description: string;
    checklistItems?: string[];
    ctaText?: string;
    videoCaption?: string;
    imageUrl: string;
    videoUrl: string;
  };
  watchMemory: {
    eyebrowText?: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    timelineSteps: string[];
    videoCaption?: string;
  };
  features: {
    eyebrowText?: string;
    title?: string;
    cards: Array<{ title: string; description: string; imageUrl: string; iconUrl?: string }>;
  };
  learning: {
    eyebrowText?: string;
    title: string;
    description: string;
    imageUrl: string;
    videoUrl: string;
    videoCaption?: string;
    listHeading?: string;
    presentationPoints?: string[];
  };
  support: {
    eyebrowText?: string;
    title: string;
    cards: Array<{
      badgeText?: string;
      title: string;
      description?: string;
      imageUrl: string;
      videoLabel?: string;
      videoUrl: string;
    }>;
  };
  pricing: {
    eyebrowText?: string;
    title?: string;
    subtitle?: string;
    footerNote?: string;
    plans: Array<{
      badgeText?: string;
      recommendedBadge?: string;
      isRecommended?: boolean;
      name: string;
      currency?: string;
      price: string;
      period?: string;
      description: string;
      features: string[];
      buttonText?: string;
    }>;
  };
  guarantee: {
    eyebrowText?: string;
    title: string;
    description: string;
    buttonText: string;
    pills?: string[];
  };
  finalCta: {
    eyebrowText?: string;
    title: string;
    subtitle: string;
    backgroundImageUrl: string;
    buttonText: string;
    microcopy?: string;
  };
};

export type LandingPageResponse = {
  message: string;
  response: { data: LandingPageContent; updatedAt?: string | null } | null;
  error: any;
};

const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

function assertBaseUrl() {
  if (!serverBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_SERVER_URL");
  }
}

export async function getLandingPagePublic(): Promise<LandingPageContent> {
  assertBaseUrl();
  const res = await fetch(`${serverBaseUrl}/user/landing-page`, { cache: "no-store" });
  const data: LandingPageResponse = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch landing page");
  }
  if (!data?.response?.data) throw new Error("Invalid landing page response");
  return data.response.data;
}

export async function getLandingPageAdmin(token: string): Promise<LandingPageContent> {
  assertBaseUrl();
  const res = await fetch(`${serverBaseUrl}/admin/landing-page`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const data: LandingPageResponse = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch landing page (admin)");
  }
  if (!data?.response?.data) throw new Error("Invalid landing page response");
  return data.response.data;
}

export async function updateLandingPageAdmin(token: string, content: LandingPageContent): Promise<LandingPageContent> {
  assertBaseUrl();
  const res = await fetch(`${serverBaseUrl}/admin/landing-page`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  const data: LandingPageResponse = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to update landing page");
  }
  if (!data?.response?.data) throw new Error("Invalid landing page response");
  return data.response.data;
}

export async function uploadLandingPageImageAdmin(
  token: string,
  imageDataUrl: string,
  folder?: string
): Promise<string> {
  assertBaseUrl();
  const res = await fetch(`${serverBaseUrl}/admin/landing-page/upload-image`, {
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
  if (typeof url !== "string" || !url) throw new Error("Invalid upload response");
  return url;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

function firstPathSegment(pathname: string): string {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg || "";
}

/**
 * Accepts common YouTube URL formats and returns a playable embed URL.
 * Examples accepted:
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - VIDEO_ID
 */
export function normalizeYouTubeEmbedUrl(input: string): string {
  const raw = String(input ?? "").trim();
  if (!raw) return "";

  // If user pasted just the video ID.
  if (YOUTUBE_ID_RE.test(raw)) return `https://www.youtube.com/embed/${raw}`;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return raw;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const path = url.pathname || "";

  // youtu.be/VIDEO_ID
  if (host === "youtu.be") {
    const id = firstPathSegment(path);
    if (YOUTUBE_ID_RE.test(id)) return `https://www.youtube.com/embed/${id}`;
    return raw;
  }

  const isYoutubeHost = host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com");
  if (!isYoutubeHost) return raw;

  // youtube.com/watch?v=VIDEO_ID
  if (path === "/watch") {
    const id = url.searchParams.get("v") || "";
    if (YOUTUBE_ID_RE.test(id)) return `https://www.youtube.com/embed/${id}`;
    return raw;
  }

  // youtube.com/embed/VIDEO_ID
  if (path.startsWith("/embed/")) {
    const id = path.split("/embed/")[1]?.split("/")[0] || "";
    if (YOUTUBE_ID_RE.test(id)) return `https://www.youtube.com/embed/${id}`;
    return raw;
  }

  // youtube.com/shorts/VIDEO_ID
  if (path.startsWith("/shorts/")) {
    const id = path.split("/shorts/")[1]?.split("/")[0] || "";
    if (YOUTUBE_ID_RE.test(id)) return `https://www.youtube.com/embed/${id}`;
    return raw;
  }

  // Fallback: try the first path segment if it looks like an ID.
  const id = firstPathSegment(path);
  if (YOUTUBE_ID_RE.test(id)) return `https://www.youtube.com/embed/${id}`;

  return raw;
}

export function withCleanPlayerParams(url: string): string {
  const raw = String(url ?? "").trim();
  if (!raw) return "";
  try {
    const u = new URL(raw);

    // Reduce extra YouTube UI where possible.
    // Note: YouTube does NOT allow fully removing ads or all suggestions.
    // - rel=0: limits related videos (usually to same channel)
    // - modestbranding=1: reduces YouTube branding
    // - iv_load_policy=3: hides video annotations
    // - playsinline=1: keeps playback inline on mobile
    u.searchParams.set("rel", u.searchParams.get("rel") ?? "0");
    u.searchParams.set("modestbranding", u.searchParams.get("modestbranding") ?? "1");
    u.searchParams.set("iv_load_policy", u.searchParams.get("iv_load_policy") ?? "3");
    u.searchParams.set("playsinline", u.searchParams.get("playsinline") ?? "1");

    // Keep controls so users can pause/seek.
    u.searchParams.set("controls", u.searchParams.get("controls") ?? "1");

    return u.toString();
  } catch {
    return raw;
  }
}

export function withAutoplay(url: string): string {
  const base = withCleanPlayerParams(url);
  if (!base) return "";
  try {
    const u = new URL(base);
    // Autoplay when the user clicks play.
    u.searchParams.set("autoplay", "1");
    return u.toString();
  } catch {
    return base;
  }
}
