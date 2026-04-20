"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMarketingPageAdmin,
  getMarketingPagePublic,
  MarketingPageContent,
  updateMarketingPageAdmin,
  uploadMarketingPageImageAdmin,
} from "@/api/marketingPageApis";

export function useMarketingPage() {
  return useQuery({
    queryKey: ["marketing-page"],
    queryFn: getMarketingPagePublic,
  });
}

export function useAdminMarketingPage(token: string | null) {
  return useQuery({
    queryKey: ["admin-marketing-page"],
    queryFn: async () => {
      if (!token) throw new Error("Missing token");
      return getMarketingPageAdmin(token);
    },
    enabled: Boolean(token),
  });
}

export function useUpdateAdminMarketingPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ token, content }: { token: string; content: MarketingPageContent }) =>
      updateMarketingPageAdmin(token, content),
    onSuccess: (data) => {
      qc.setQueryData(["admin-marketing-page"], data);
      qc.setQueryData(["marketing-page"], data);
    },
  });
}

export function useUploadMarketingPageImage() {
  return useMutation({
    mutationFn: async ({
      token,
      imageDataUrl,
      folder,
    }: {
      token: string;
      imageDataUrl: string;
      folder?: string;
    }) => uploadMarketingPageImageAdmin(token, imageDataUrl, folder),
  });
}
