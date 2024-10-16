import React from 'react';
import { useSession } from 'next-auth/react';


import SidebarComponent from '@/components/SidebarComponent';
import HolidaysDashboard from './holidayLayouts';
import EmployeeCalendar from '@/components/Calender';

const AdminLayouts = ({ children }) => {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen">
     
         <div className="grid grid-cols-1 ">
          <div>
             <EmployeeCalendar />
          </div>
        
          {/* <RepairList /> */}
          {children}
        </div>
   
       
      
    </div>
  );
};

export default AdminLayouts;