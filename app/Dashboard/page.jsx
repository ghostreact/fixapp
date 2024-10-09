"use client";
import AdminLayouts from "@/layouts/adminLayouts";
import CashireLayouts from "@/layouts/cashireLayouts";
import TechLayouts from "@/layouts/techLayouts";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { Fragment, Suspense, useEffect, useState } from "react";

const DashboardPage = () => {
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

  const renderCurrentTask = () => {
    if (currentTask) {
      return (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Current Task</h3>
          <p>Machine: {currentTask.taskname}</p>
          <p>Status: {currentTask.task_status}</p>
        </div>
      );
    }
    return null;
  };

  if (status === "authenticated") {
    const Layout = {
      ADMIN: AdminLayouts,
      TECH: TechLayouts,
      CASHIER: CashireLayouts
    }[session?.user.role] || Fragment;

    return (
      <Layout>
        {renderCurrentTask()}
        {/* เนื้อหาอื่นๆ ของ Dashboard */}
      </Layout>
    );
  }

  return <Suspense fallback={<div>Loading...</div>} />;
};

export default DashboardPage;