"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

const GoogleLoginButton = () => {
  const router = useRouter();

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const response = await fetch(`${serverBaseUrl}/user/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const result = await response.json();
      if (response.ok) {
        const { token, data } = result.response;
        router.push("/landing-page");
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ email: data.email }));
      } else {
        console.error(result.message);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
};

export default GoogleLoginButton;
