"use client";
import AdminLayouts from "@/layouts/adminLayouts";
import CashireLayouts from "@/layouts/cashireLayouts";
import TechLayouts from "@/layouts/techLayouts";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { Fragment, Suspense, useEffect, useState } from "react";

const DashboardPage = (prop) => {
  const { data: session, status } = useSession();
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCurrentTask();
    }
  }, [status]);

  const fetchCurrentTask = async () => {
    try {
      const response = await fetch('/api/task/current');
      if (response.ok) {
        const data = await response.json();
        setCurrentTask(data);
      }
    } catch (error) {
      console.error('Error fetching current task:', error);
    }
  };

  if (status === "unauthenticated") {
    return redirect("/");
  }

 

  if (status === "authenticated") {
    const Layout = {
      ADMIN: AdminLayouts,
      TECH: TechLayouts,
      CASHIER: CashireLayouts
    }[session?.user.role] || Fragment;

    return (
      <Layout>
        
        {/* เนื้อหาอื่นๆ ของ Dashboard */}
        {prop.children}
      </Layout>
    );
  }

  return <Suspense fallback={<div>Loading...</div>} />;
};

export default DashboardPage;