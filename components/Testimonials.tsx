import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { MdAutoStories } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { useSwipeable } from "react-swipeable";
import { toast } from "sonner";
import { handleSessionExpiry } from "@/utils/handleSessionExpiry";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

type Story = {
  _id: string;
  author: string;
  title: string;
  story: string;
};

export default function Testimonials() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [leafData, setLeafData] = useState<Story[]>([]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const nextTestimonial = () => {
    setCurrent((prev) => (prev + 1) % leafData.length);
  };

  const prevTestimonial = () => {
    setCurrent((prev) => (prev - 1 + leafData.length) % leafData.length);
  };

  // Swipeable functionality to go to next or previous testimonial on swipe
  const handlers = useSwipeable({
    onSwipedLeft: nextTestimonial,
    onSwipedRight: prevTestimonial,
    trackMouse: true, // Optional: enables mouse swipe support
  });

  const loadStories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${serverBaseUrl}/admin/story/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        if (handleSessionExpiry(data.message, router, true)) return;
        toast.error(data.message || "Failed to fetch stories");
        return;
      }

      setLeafData(data?.response?.data?.publicStory);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getStories = async () => {
      await loadStories();
    };
    getStories();
  }, []);

  return (
    <div className="bg-[#F1FAEE] py-20 px-8 relative overflow-hidden">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-[#457B9D]"></div>
        </div>
      ) : leafData.length < 1 ? (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <MdAutoStories size={40} color="#457B9D" />
          <p className="text-[#1D3557] text-lg font-medium">
            No stories available right now
          </p>
          <p className="text-[#457B9D]/70 text-sm">Please check back later</p>
        </div>
      ) : (
        <>
          {/* Background decorative elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#457B9D]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#1D3557]/5 rounded-full blur-3xl"></div>

          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6 group hover:shadow-xl transition-all duration-300">
                <svg
                  className="w-8 h-8 text-[#457B9D] group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L8.5 8.5L2 12L8.5 15.5L12 22L15.5 15.5L22 12L15.5 8.5L12 2Z" />
                </svg>
              </div>
              <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#1D3557] mb-4 leading-tight">
                Stories That
                <span className="block text-[#457B9D] italic">
                  Touched Hearts
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#457B9D] to-[#1D3557] mx-auto rounded-full"></div>
            </div>

            {/* Testimonials Container */}
            <div
              {...handlers}
              className="flex justify-center items-center gap-4 sm:gap-8 relative"
            >
              {/* Previous Button */}
              <button
                onClick={prevTestimonial}
                className="group hidden md:flex justify-center items-center w-14 h-14 bg-white border-2 border-[#457B9D] rounded-full text-[#457B9D] hover:bg-[#457B9D] hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl absolute left-[20px] lg:left-[40px] top-1/2 transform -translate-y-1/2"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </button>

              {/* Testimonial Card */}
              <div className="relative">
                <div
                  className="bg-white p-8 sm:p-10 w-[320px] sm:w-[400px] lg:w-[500px] h-auto rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] border border-gray-100 cursor-pointer"
                  onClick={() => setModalOpen(true)}
                >
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-br from-[#457B9D] to-[#1D3557] p-3 rounded-full shadow-lg">
                      <Quote className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="font-semibold text-[#1D3557] tracking-wider text-md sm:text-lg">
                      Read My Story
                    </p>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-[#457B9D] to-[#1D3557] mx-auto my-4"></div>
                  </div>

                  <div className="text-center">
                    <p className="text-[#1D3557] tracking-wider text-sm sm:text-base">
                      Name:{" "}
                      <span className="font-semibold">
                        {leafData[current]?.author}
                      </span>
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#1D3557] tracking-wider text-sm sm:text-base">
                      Title:{" "}
                      <span className="font-semibold">
                        {leafData[current]?.title}
                      </span>
                    </p>
                  </div>

                  {/* Decorative corner elements */}
                  <div className="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-[#457B9D]/20"></div>
                  <div className="absolute top-4 right-4 w-3 h-3 border-r-2 border-t-2 border-[#457B9D]/20"></div>
                  <div className="absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-[#457B9D]/20"></div>
                  <div className="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-[#457B9D]/20"></div>
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={nextTestimonial}
                className="group hidden md:flex justify-center items-center w-14 h-14 bg-white border-2 border-[#457B9D] rounded-full text-[#457B9D] hover:bg-[#457B9D] hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl absolute right-[20px] lg:right-[40px] top-1/2 transform -translate-y-1/2 "
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-12 space-x-3">
              {leafData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === current
                      ? "bg-[#457B9D] scale-125 shadow-lg"
                      : "bg-[#457B9D]/30 hover:bg-[#457B9D]/60 hover:scale-110"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
          {modalOpen && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-70 z-50 p-4"
              onClick={() => setModalOpen(false)}
            >
              <div
                className="relative bg-white p-8 sm:p-10 w-10/12 h-11/12 rounded-2xl shadow-2xl border border-gray-100 flex flex-col justify-between overflow-hidden overflow-y-scroll"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute font-extrabold top-4 right-4 text-[#1D3557] hover:text-red-500 transition-colors"
                  aria-label="Close modal"
                >
                  <RxCross1 size={22} />
                </button>
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-[#457B9D] to-[#1D3557] p-3 rounded-full shadow-lg">
                    <Quote className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="text-center">
                  <p className="font-semibold text-[#1D3557] tracking-wider text-xl sm:text-2xl">
                    {leafData[current].title}
                  </p>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-[#457B9D] to-[#1D3557] mx-auto my-4"></div>
                </div>

                <div className="mb-8">
                  <p
                    className="text-base sm:text-md leading-snug text-[#1D3557] font-light animate-fade-in"
                    dangerouslySetInnerHTML={{
                      __html: leafData[current].story.replace(/\n/g, "<br/>"),
                    }}
                  ></p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
