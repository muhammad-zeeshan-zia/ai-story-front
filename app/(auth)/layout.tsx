import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthSidebar from "@/components/AuthSidebar";
import { ReactNode } from "react";
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <GoogleOAuthProvider clientId={googleClientId!}>
        <div className="hidden md:block w-full md:w-[50%]">
          <AuthSidebar />
        </div>

        <div className="flex-1 overflow-auto bg-white">
          {children}
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default Layout;
