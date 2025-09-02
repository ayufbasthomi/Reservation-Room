import { ReactNode } from "react";

interface ProtectedProps {
  children: ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <p className="text-center mt-10">⚠️ Please login to continue</p>;
  }
  return <>{children}</>;
}
