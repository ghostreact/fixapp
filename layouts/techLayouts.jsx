import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ContentAccord from "@/components/ContentAccord";

const TechLayouts = ({ children }) => {
  const { data: session } = useSession();
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard-stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, color, icon, path }) => (
    <div className={`bg-${color}-500 p-4 rounded-lg shadow-md m-2 `} style={{
      backgroundColor : "red",
      height : "5rem",
      display : "grid",

      }}>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          {title}
          <span className="text-2xl font-bold ml-2" style={{ color: "green" }}>
            {/* กำหนดสไตล์ให้กับ value */}
            {value}
          </span>
        </h3>

        <div className="text-3xl">{icon}</div>
      </div>
      {path && (
        <Link href={path} className="text-sm hover:underline mt-2 inline-block">
          More info →
        </Link>
      )}
    </div>
  );


  return (
    <div className="flex flex-col min-h-screen ">
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome, {session?.user?.name || "Guest"}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 m-8">
          <StatCard
            title="จำนวนเครื่องรอรับงาน"
            value={stats.machinePadding || 0}
            icon="🛍️"
            path="/get-job"
          />
          <StatCard
            title="จำนวนเครื่องกำลังซ่อม"
            value={stats.taskFixing || 0 }
            icon="📋"
          />
          <StatCard
            title="จำนวนเครื่องซ่อมเสร็จ"
            value={stats.taskSuccess || 0}
            icon="📋"
            path="/description"
          />
          {/* <StatCard title="User Registrations" value={stats.userTotal || 0} color="yellow" icon="👥" /> */}
        </div>
        <div className="divider"></div>
        <div className=" p-6 rounded-lg shadow-md" 
        style={{
          //backgroundColor: "blue",
          
        }}>
          <h2 className="text-2xl font-semibold mb-4">Task List</h2>
        
            
            <ContentAccord />
          
        </div>
      </main>
    </div>
  );
};

export default TechLayouts;
