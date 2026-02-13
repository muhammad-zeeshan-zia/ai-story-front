import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SESSION_ERRORS = [
  "Access denied, authentication token missing",
  "Invalid token or expired",
];

export const handleSessionExpiry = (
  message: string,
  router: ReturnType<typeof useRouter>,
  admin = false
): boolean => {
  if (SESSION_ERRORS.includes(message)) {
    toast.error(message, { id: "session-expiry" });
    if (admin) {
      router.push("/admin/login");
    } else {
      router.push("/login");
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return true;
  }
  return false;
};
