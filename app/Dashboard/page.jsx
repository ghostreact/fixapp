"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";

const DashboardPage = () => {
    const router = useRouter();

    const handleSignOut = useCallback(() => {
        signOut({ callbackUrl: "/" });
      }, []);
  return (
    <div>
       <div>DashboardPage</div> 
       <button className="btn btn-error" onClick={handleSignOut}>
            Logout
          </button>
    </div>
    
  )
}

export default DashboardPage