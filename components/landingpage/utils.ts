export function youTubeThumbnailFromEmbedUrl(embedUrl: string): string {
  const match = embedUrl.match(/\/embed\/([^?&#/]+)/);
  const videoId = match?.[1];
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
}
