import { useState } from "react";
import { toast } from "sonner";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

export default function GetInTouch() {
  const [disabled, setDisabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisabled(true);
    setErrors({
      name: "",
      email: "",
      message: ""
    });

    try {
      const response = await fetch(`${serverBaseUrl}/user/auth/support-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (response.ok) {
        toast.success(responseData.message)
        setFormData({
          name: "",
          email: "",
          message: ""
        });
      } else if (response.status === 403) {
        const error = typeof responseData.error;
        if (error === "object") {
          setErrors(responseData.error);
        } else {
          setAlertMessage(responseData.message || "An error occurred");
          setTimeout(() => setAlertMessage(false), 3000);
        }
      } else {
        setAlertMessage(
          responseData.message || "Support request failed. Please try again"
        );
        setTimeout(() => setAlertMessage(false), 3000);
      }
    } catch (error) {
      console.error("Error during support request:", error);
    } finally {
      setDisabled(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row" id="contact">
      {/* Left side - Form */}
      <div className="flex-1 bg-[#A8DADC]  px-8 py-12 lg:px-12 lg:py-20 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto ">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-6">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L8.5 8.5L2 12L8.5 15.5L12 22L15.5 15.5L22 12L15.5 8.5L12 2Z"/>
              </svg>
            </div>
            <h2 className="font-serif text-4xl lg:text-6xl font-[500] text-[#1D3557] mb-8 text-center lg:text-left">Get in Touch</h2>
            {alertMessage && (
              <div
                className={`mt-4 mb-8 bg-red-100 border-red-400 text-red-700 border px-4 py-3 rounded relative`}
                role="alert"
              >
                <span className="block sm:inline">{alertMessage}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="border-[#1D3557] border-0 border-b-2 w-full py-3 text-[#1D3557] placeholder:text-[#1D3557] font-[300] text-[18px] lg:text-[24px] focus:outline-none transition duration-300"
                required
              />
              {errors?.name && (
                <p className="joi-error-message mb-4">{errors?.name[0]}</p>
              )}
            </div>

            <div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="border-[#1D3557] border-0 border-b-2 w-full py-3 text-[#1D3557] placeholder:text-[#1D3557] font-[300] text-[18px] lg:text-[24px] focus:outline-none transition duration-300"
                required
              />
              {errors?.email && (
                <p className="joi-error-message mb-4">{errors?.email[0]}</p>
              )}
            </div>
            <div>
              <input
                 id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="border-[#1D3557] border-0 border-b-2 w-full py-3 text-[#1D3557] placeholder:text-[#1D3557] font-[300] text-[18px] lg:text-[24px] focus:outline-none transition duration-300"
                required
              />
              {errors?.message && (
                <p className="joi-error-message mb-4">{errors?.message[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={disabled}
              className="bg-[#457B9D] hover:bg-[#1D3557] text-white px-8 py-3 rounded-full font-medium transition-colors duration-300 mt-8 w-full sm:w-auto"
            >
              Send Now!
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="flex-1 bg-cover bg-center bg-no-repeat bg-none lg:bg-[url('/assets/get_in_touch.jpg')] " />
    </div>
  );
}
