"use client";

import Image from "next/image";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  const sections = [
    {
      number: "1",
      title: "What Information We Collect",
      content: (
        <>
          <p className="mb-4">
            We collect information to give you the best experience possible,
            such as:
          </p>
          <ul className="space-y-3 ml-5">
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <div>
                <strong>Account Information:</strong> Your name, email, and
                login details so you can access your account.
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <div>
                <strong>Story Content:</strong> The memories, stories, photos,
                or audio you choose to share—these always belong to you. All
                Free Practice Stories are automatically deleted after 3 days.
                You&apos;re encouraged to copy and save your stories on your
                computer and delete them on our website. (DOES NOT APPLY TO PAID
                ACCOUNTS)
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <div>
                <strong>Payments:</strong> If you purchase a subscription, we
                collect payment details securely through our payment processor.
                No credit card information is saved on our website—other than
                Name.
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <div>
                <strong>Communication:</strong> If you email us or fill out a
                form, we keep that info to respond and support you.
              </div>
            </li>
          </ul>
        </>
      ),
    },
    {
      number: "2",
      title: "How We Use Your Information",
      content: (
        <>
          <p className="mb-4">We use your information to:</p>
          <ul className="space-y-2 ml-5">
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <span>Create and manage your account</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <span>Help you shape your rough draft stories</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <span>Process payments and renewals</span>
            </li>
          </ul>
          <p className="mt-4">
            <strong>We do not sell your email information.</strong>
          </p>
        </>
      ),
    },
    {
      number: "3",
      title: "Cookies & Analytics",
      content: <p>We use cookies to keep you logged in.</p>,
    },
    {
      number: "4",
      title: "When We Share Information",
      content: (
        <>
          <p className="mb-4">We only share information when needed to:</p>
          <ul className="space-y-2 ml-5">
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <span>Provide services (like hosting or payment processing)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <span>Follow the law or protect safety</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <span>
                Collaborate with your invited story contributors (if you choose
                to share stories)
              </span>
            </li>
          </ul>
          <p className="mt-4">
            <strong>
              We never sell your personal information to advertisers or other
              companies.
            </strong>
          </p>
        </>
      ),
    },
    {
      number: "5",
      title: "Data Storage & Security",
      content: (
        <p>
          We use industry-standard security (like encrypted connections and
          secure storage) to protect your data. While no system can be 100%
          secure, we work hard to keep your information safe.
        </p>
      ),
    },
    {
      number: "6",
      title: "How Long We Keep Your Data",
      content: (
        <>
          <p className="mb-4">
            We keep your data while your account is active. If your subscription
            ends or you close your account, we delete your data.
          </p>
          <div className="bg-[#FFF3CD] border-l-4 border-[#FFC107] p-4 rounded-lg">
            <p className="font-semibold">
              Be sure to copy and save to your computer all stories you created.
            </p>
          </div>
        </>
      ),
    },
    {
      number: "7",
      title: "Your Rights",
      content: (
        <>
          <p className="mb-4">
            Depending on where you live, you may have rights to:
          </p>
          <ul className="space-y-2 ml-5">
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <span>See the data we have about you</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <span>Correct or update your information</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#457B9D] font-bold">•</span>
              <span>Ask us to delete your data</span>
            </li>
          </ul>
          <p className="mt-4">
            Email <strong>storygems.support@gmail.com</strong> to make any
            requests.
          </p>
        </>
      ),
    },
    {
      number: "8",
      title: "Children's Privacy",
      content: (
        <p>
          Our services are not for children under 13 (or the age defined by your
          local laws). If we learn we have data from a child without parental
          consent, we will delete it promptly.
        </p>
      ),
    },
    {
      number: "9",
      title: "Updates to This Policy",
      content: (
        <p>
          We may update this Privacy Policy from time to time. If we make big
          changes, we&apos;ll post them on our site or notify you by email.
        </p>
      ),
    },
    {
      number: "10",
      title: "Contact Us",
      content: (
        <p>
          If you have questions or concerns about privacy, please contact us:{" "}
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
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-95">
            Capturing Story Gems
          </p>
        </div>
      </div>

      {/* Intro Section */}
      <div className="max-w-5xl mx-auto px-5 md:px-10 py-15">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border-l-4 border-[#457B9D] mb-15">
          <p className="text-lg text-gray-700 leading-relaxed">
            We care about your privacy and want you to feel confident using our
            services. This Privacy Policy explains what information we collect,
            how we use it, and your choices. If you have any questions, email us
            anytime at{" "}
            <a
              href="mailto:storygems.support@gmail.com"
              className="text-[#457B9D] font-semibold hover:underline"
            >
              storygems.support@gmail.com
            </a>
            .
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
