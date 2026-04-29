"use client";

import React from "react";
import HeroComponent from "../../../components/marketing/Hero";
import PracticeStoryComponent from "@/components/marketing/PracticeStoryComponent";
import GettingStartedSteps from "@/components/marketing/GettingStartedSteps";
import StoryDevelopmentSteps from "@/components/marketing/StoryDevelopmentSteps";
import ReviewAndCompleteSteps from "@/components/marketing/ReviewAndCompleteSteps";
import PracticeStoryTwoComponent from "@/components/marketing/PracticeStoryTwoComponent";
import GettingStartedPracticeTwo from "@/components/marketing/GettingStartedPracticeTwo";
import RefiningYourStorySteps from "@/components/marketing/RefiningYourStorySteps";
import CompleteStep from "@/components/marketing/CompleteStep";
import LearningCenterSetup from "@/components/marketing/LearningCenterSetup";
import { useMarketingPage } from "@/hooks/useMarketingPage";

const Page = () => {
  const { data } = useMarketingPage();

  return (
    <>
      {/* practice story 1 */}
      <HeroComponent content={data?.hero} />
      <PracticeStoryComponent content={data?.practiceStoryOne} />
      <GettingStartedSteps content={data?.gettingStartedOne} />
      <StoryDevelopmentSteps content={data?.storyDevelopment} />
      <ReviewAndCompleteSteps content={data?.reviewAndComplete} />

      {/* practice story 2 */}
      <PracticeStoryTwoComponent content={data?.practiceStoryTwo} />
      <GettingStartedPracticeTwo content={data?.gettingStartedTwo} />
      <RefiningYourStorySteps content={data?.refiningYourStory} />
      <CompleteStep content={data?.complete} />

      {/* Add any additional components or content here */}
      <LearningCenterSetup content={data?.learningCenter} />
    </>
  );
};

export default Page;
