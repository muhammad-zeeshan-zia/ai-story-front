"use client";

import Footer from "@/components/Footer";
import Image from "next/image";

export default function TermsOfService() {
  const sections = [
    {
      number: "1",
      title: "Using Our Site",
      content: (
        <>
          <ul className="space-y-3">
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <div>
                <strong>Who Can Use It:</strong> You need to be at least 18
                years old or have a parent/guardian&apos;s permission if
                you&apos;re younger.
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <div>
                <strong>Paid Accounts:</strong> Please keep your login
                information private and secure.
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <div>
                <strong>Be Kind & Legal:</strong> You&apos;re responsible for
                the stories and content you share. Don&apos;t upload anything
                illegal, harmful, or offensive.
              </div>
            </li>
          </ul>
        </>
      ),
    },
    {
      number: "2",
      title: "Your Stories & Privacy",
      content: (
        <>
          <p className="mb-4">
            <strong>Your stories belong to you.</strong>
          </p>
          <p className="mb-4">
            We will never claim ownership of your personal stories.
          </p>
          <p className="mb-4">
            Please review our Privacy Policy to see how we protect your
            information. Free Practice Stories are not private. We encourage you
            to Delete them soon after testing out our program. Practice stories
            are automatically Deleted after 3 days.
          </p>
        </>
      ),
    },
    {
      number: "3",
      title: "Our Content",
      content: (
        <>
          <p className="mb-4">
            Everything we create—like our website, tools, and materials—belongs
            to us or our partners.
          </p>
          <p>
            You can use our site and materials for personal use only. Please
            don&apos;t copy or resell them without our permission.
          </p>
        </>
      ),
    },
    {
      number: "4",
      title: "Payments & Renewals",
      content: (
        <>
          <p className="mb-4">
            If you purchase a subscription, it gives you access to our tools and
            resources for the length of your plan.
          </p>
          <p>After it ends, you can renew anytime to keep access going.</p>
        </>
      ),
    },
    {
      number: "5",
      title: "Refunds",
      content: (
        <>
          <p className="mb-4">
            If something isn&apos;t working for you, contact us within 30 days
            of purchase at{" "}
            <a
              href="mailto:storygems.support@gmail.com"
              className="text-[#457B9D] font-semibold hover:underline"
            >
              storygems.support@gmail.com
            </a>
            .
          </p>
          <p>
            Refunds may not be available if terms were broken or the service was
            used in ways not intended.
          </p>
        </>
      ),
    },
    {
      number: "6",
      title: "Ending or Changing Access",
      content: (
        <>
          <p className="mb-4">
            We may suspend or remove accounts that break these Terms or misuse
            the site.
          </p>
          <p>
            We might update the site or Terms occasionally; using the site after
            changes means you agree to the new Terms.
          </p>
        </>
      ),
    },
    {
      number: "7",
      title: "No Guarantees",
      content: (
        <p>
          We work hard to keep everything running smoothly, but we can&apos;t
          promise the site will always be perfect or error-free. We&apos;re not
          responsible for losses or damages from using the site.
        </p>
      ),
    },
    {
      number: "8",
      title: "Governing Law",
      content: (
        <p>
          These Terms follow the laws of State of Florida, USA. Any disputes
          will be handled there.
        </p>
      ),
    },
    {
      number: "10",
      title: "Contact Us",
      content: (
        <p>
          If you have questions or concerns, please contact us:{" "}
          <a
            href="mailto:storygems.support@gmail.com"
            className="text-[#457B9D] font-semibold hover:underline"
          >
            storygems.support@gmail.com
          </a>
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] to-[#F5F5F0]">
      {/* Hero Section */}
      <div className="relative w-full py-20 md:py-32 bg-gradient-to-r from-[#457B9D] to-[#375E73]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-white text-center px-5 md:px-15">
          <div className="flex justify-center mb-6">
            <Image
              src="/leaf-1.svg"
              width={60}
              height={60}
              alt="leaf decoration"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-[Cormorant_Garamond] font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-95">
            Capturing Story Gems
          </p>
        </div>
      </div>

      {/* Intro Section */}
      <div className="max-w-5xl mx-auto px-5 md:px-10 py-15">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border-l-4 border-[#457B9D] mb-15">
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Welcome! We&apos;re so glad you&apos;re here. These Terms of Service
            (&quot;Terms&quot;) explain how you can use our site and services
            (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). Please read
            them carefully. By using our site, you&apos;re agreeing to these
            Terms.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            If you ever have questions, just ask… we&apos;re happy to help.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-10 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#457B9D] to-[#375E73] text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {section.number}
                </div>
                <h2 className="text-3xl font-[Cormorant_Garamond] font-bold text-gray-800 pt-2">
                  {section.title}
                </h2>
              </div>
              <div className="text-gray-700 leading-relaxed pl-16">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
