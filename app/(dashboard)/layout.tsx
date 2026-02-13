import Header from "@/components/Header";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col overflow-hidden">
      <Header/>
      <div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
