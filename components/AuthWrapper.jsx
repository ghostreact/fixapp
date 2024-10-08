'use client';

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import SidebarComponent from "./SidebarComponent";

const AuthWrapper = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return; // ไม่ทำอะไรขณะกำลังโหลด session

    if (!session && pathname !== "/" && pathname !== "/login") {
      // ถ้าไม่มี session และไม่ได้อยู่ในหน้าแรกหรือหน้าล็อกอิน ให้เด้งไปหน้าแรก
      router.push("/");
    }
  }, [session, status, router, pathname]);

  if (status === "loading") {
    return <div>กำลังโหลด...</div>;
  }

  if (!session && pathname !== "/" && pathname !== "/login") {
    return null; // ไม่แสดงอะไรระหว่างกำลัง redirect
  }

  if (pathname === "/" || pathname === "/login") {
    // อนุญาตให้แสดงหน้าแรกและหน้าล็อกอินโดยไม่ต้องมี session
    return children;
  }

  return (
    <SidebarComponent>
      {children}
    </SidebarComponent>
  );
};

export default AuthWrapper;
