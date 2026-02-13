"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { RiLockPasswordLine, RiLogoutCircleLine } from "react-icons/ri";
import { IoCodeSlashOutline } from "react-icons/io5";
import { MdOutlineAutoStories } from "react-icons/md";
import {
  LiaUser,
  LiaUsersSolid,
  LiaCrownSolid,
  LiaHomeSolid,
  LiaUserFriendsSolid,
} from "react-icons/lia";
import InputField from "./ui/InputField";
import { handleSessionExpiry } from "@/utils/handleSessionExpiry";
import { toast } from "sonner";
const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

const SIDEBAR_WIDTH = {
  expanded: "w-56",
  collapsed: "w-16",
};

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

const menu = [
  {
    icon: <LiaHomeSolid />,
    label: "Home",
    href: "/admin/",
  },
  {
    icon: <LiaUser />,
    label: "Users",
    href: "/admin/users",
  },
  {
    icon: <LiaUsersSolid />,
    label: "Groups",
    href: "/admin/groups",
  },
  {
    icon: <LiaUserFriendsSolid />,
    label: "Public Users",
    href: "/admin/public-users",
  },
  {
    icon: <IoCodeSlashOutline />,
    label: "Prompts",
    href: "/admin/prompts",
  },
  {
    icon: <MdOutlineAutoStories />,
    label: "Stories",
    href: "/admin/stories",
  },
  {
    icon: <LiaCrownSolid />,
    label: "Plans",
    href: "/admin/plans",
  },
];

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  useEffect(() => {
    function onResize() {
      setMobile(window.innerWidth < 768);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (mobile && expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile, expanded]);

  const updatePassword = async () => {
    setDisabled(true);
    setAlertMessage("");
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${serverBaseUrl}/admin/auth/update-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: oldPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        handleCloseModal();
      } else if (response.status === 403) {
        const error = typeof data.error;
        if (error === "object") {
          setErrors(data.error);
        }
      } else {
        if (handleSessionExpiry(data.message, router)) return;
        const msg = data.message || "Failed to change password";
        setAlertMessage(msg);
      }
    } catch {
      setAlertMessage("Network error. Please try again");
    } finally {
      setDisabled(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOldPasswordVisible(false);
    setNewPasswordVisible(false);
    setConfirmPasswordVisible(false);
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setAlertMessage("");
  };

  const logout = () => {
    localStorage.clear();
    router.push("/admin/login");
  };

  return (
    <>
      {mobile && expanded && (
        <div
          className="fixed inset-0 z-20 bg-[#00000029] md:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed z-30 top-0 left-0 h-full transition-all duration-300 bg-[#A8DADC] border-r border-gray-200 flex flex-col shadow-lg ${
          expanded ? SIDEBAR_WIDTH.expanded : SIDEBAR_WIDTH.collapsed
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div
              onClick={onToggle}
              className="w-10 h-10 cursor-pointer rounded-xl bg-white flex items-center justify-center shadow-sm border border-white"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#0ea5e9"
                  strokeWidth="2.5"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="5"
                  fill="#fff"
                  stroke="#0ea5e9"
                  strokeWidth="2"
                />
              </svg>
            </div>
            {expanded && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">
                  AI Story
                </span>
                <span className="text-xs text-slate-600">Admin Panel</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-3 py-6">
          <ul className="space-y-2">
            {menu.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                      expanded ? "" : "justify-center"
                    } ${
                      isActive
                        ? "bg-[#1D3557] text-white shadow-sm"
                        : "text-[#1D3557] hover:bg-[#1D3557] hover:text-white"
                    }`}
                  >
                    <span className="flex-shrink-0 transition-colors">
                      {item.icon}
                    </span>
                    {expanded && (
                      <span className="text-sm font-medium truncate">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200/50">
          <button
            className={`flex w-full items-center gap-3 mb-2 px-3 py-3 rounded-lg transition-all duration-200 group text-[#1D3557] hover:bg-[#1D3557] hover:text-white ${
              expanded ? "" : "justify-center"
            }`}
            onClick={() => setIsModalOpen(true)}
          >
            <span className="flex-shrink-0 transition-colors">
              <RiLockPasswordLine />
            </span>
            {expanded && (
              <span className="text-sm font-medium truncate">
                Update Password
              </span>
            )}
          </button>
          <button
            className={`flex w-full items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group text-[#1D3557] hover:bg-[#1D3557] hover:text-white ${
              expanded ? "" : "justify-center"
            }`}
            onClick={() => logout()}
          >
            <span className="flex-shrink-0 transition-colors">
              <RiLogoutCircleLine />
            </span>
            {expanded && (
              <span className="text-sm font-medium truncate">Logout</span>
            )}
          </button>
        </div>
      </aside>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-start justify-center"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mt-12"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[#1D3557] text-3xl sm:text-4xl font-bold mb-4 font-cormorant-garamond">
              Update Password
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updatePassword();
              }}
            >
              {alertMessage && (
                <div
                  className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">{alertMessage}</span>
                </div>
              )}

              <InputField
                label="Old Password"
                type={oldPasswordVisible ? "text" : "password"}
                value={oldPassword}
                onChange={handleOldPasswordChange}
                placeholder="Enter your old password"
                id="oldPassword"
                showPasswordToggle={true}
                onTogglePassword={() =>
                  setOldPasswordVisible(!oldPasswordVisible)
                }
                className={`${errors?.currentPassword && "!mb-0"}`}
              />
              {errors?.currentPassword && (
                <p className="joi-error-message mb-2">
                  {errors?.currentPassword[0]}
                </p>
              )}
              <InputField
                label="New Password"
                type={newPasswordVisible ? "text" : "password"}
                value={newPassword}
                onChange={handleNewPasswordChange}
                placeholder="Enter your new password"
                id="newPassword"
                showPasswordToggle={true}
                onTogglePassword={() =>
                  setNewPasswordVisible(!newPasswordVisible)
                }
                className={`${errors?.newPassword && "!mb-0"}`}
              />
              {errors?.newPassword && (
                <p className="joi-error-message mb-2">
                  {errors?.newPassword[0]}
                </p>
              )}
              <InputField
                label="Confirm Password"
                type={confirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Re-enter your new password"
                id="confirmPassword"
                showPasswordToggle={true}
                onTogglePassword={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
                className={`${errors?.confirmPassword && "!mb-0"}`}
              />
              {errors?.confirmPassword && (
                <p className="joi-error-message mb-2">
                  {errors?.confirmPassword[0]}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:shadow-md active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>Cancel</span>
                </button>

                <button
                  type="submit"
                  disabled={disabled}
                  className="px-6 py-3 bg-gradient-to-r from-[#2b4e7e] to-[#1D3557] text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2 group"
                >
                  <span>Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
