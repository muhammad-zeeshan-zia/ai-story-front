"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getLandingPageAdmin,
	getLandingPagePublic,
	LandingPageContent,
	updateLandingPageAdmin,
	uploadLandingPageImageAdmin,
} from "@/api/landingpageApis";

export function useLandingPage() {
	return useQuery({
		queryKey: ["landing-page"],
		queryFn: getLandingPagePublic,
	});
}

export function useAdminLandingPage(token: string | null) {
	return useQuery({
		queryKey: ["admin-landing-page"],
		queryFn: async () => {
			if (!token) throw new Error("Missing token");
			return getLandingPageAdmin(token);
		},
		enabled: Boolean(token),
	});
}

export function useUpdateAdminLandingPage() {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async ({ token, content }: { token: string; content: LandingPageContent }) => {
			return updateLandingPageAdmin(token, content);
		},
		onSuccess: (data) => {
			qc.setQueryData(["admin-landing-page"], data);
			qc.setQueryData(["landing-page"], data);
		},
	});
}

export function useUploadLandingPageImage() {
	return useMutation({
		mutationFn: async ({ token, imageDataUrl, folder }: { token: string; imageDataUrl: string; folder?: string }) => {
			return uploadLandingPageImageAdmin(token, imageDataUrl, folder);
		},
	});
}

