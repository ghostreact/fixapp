"use client";
import AdminLayouts from "@/layouts/adminLayouts";
import CashireLayouts from "@/layouts/cashireLayouts";
import TechLayouts from "@/layouts/techLayouts";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { Fragment, Suspense } from "react";

const DashboardPage = () => {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return redirect("/");
  }

  if (status === "authenticated") {
    switch (session?.user.role) {
      case "ADMIN":
        return (
          <Fragment>
            <AdminLayouts>
              {/* เนื้อหาเพิ่มเติมสำหรับ Admin */}
            </AdminLayouts>
          </Fragment>
        );
      case "TECH":
        return (
          <Fragment>
            <TechLayouts>
              {/* เนื้อหาเพิ่มเติมสำหรับ Tech */}
            </TechLayouts>
          </Fragment>
        );
      case "CASHIER":
        return (
          <Fragment>
            <CashireLayouts>
              {/* เนื้อหาเพิ่มเติมสำหรับ Cashier */}
            </CashireLayouts>
          </Fragment>
        );
      default:
        return <div>Unauthorized</div>;
    }
  }

  return <Suspense fallback={<div>Loading...</div>} />;
};

export default DashboardPage;
