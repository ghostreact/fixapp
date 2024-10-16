'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState, useMemo } from 'react';
import { RxDashboard } from 'react-icons/rx';
import { FaPlus, FaCalendarAlt, FaClipboardCheck, FaSearch, FaUserCog } from 'react-icons/fa';

const MenuItem = ({ item, isActive, onSelect }) => (
  <li
    className={`menu-item ${isActive ? 'menu-active bg-gray-200 menu-item' : ''}`}
    onClick={() => onSelect(item.name)}
  >
    <Link href={item.path} className="flex items-center space-x-2 cursor-pointer p-2 w-full menu-item">
      {item.iconPath && <span className="h-5 w-5 opacity-75">{item.iconPath}</span>}
      <span>{item.name}</span>
    </Link>
  </li>
);


const MenuItems = ({ items, activePath, onSelect }) => (
  <ul className="menu-items space-y-2">
    {items.map((item) => (
      <MenuItem
        key={item.name}
        item={item} // ส่ง item ทั้ง object ไป
        isActive={activePath === item.path}
        onSelect={onSelect}
      />
    ))}
  </ul>
);

const SidebarComponent = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState('เพิ่มเครื่องใหม่');

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);


  // สร้างรายการเมนูใหม่ โดยใช้ useMemo เพื่อหลีกเลี่ยงการเพิ่มรายการซ้ำ
  const menuItems = useMemo(() => {
    const items = [
      { name: 'DashBoard', iconPath: <RxDashboard />, path: '/Dashboard' },
      { name: 'เพิ่มเครื่องใหม่', iconPath: <FaPlus />, path: '/machine' },
      { name: 'ปฎิทิน', iconPath: <FaCalendarAlt />, path: '/calendar' },
      { name: 'ค้นหาเครื่องซ่อม', iconPath: <FaSearch  />, path: '/report' }
      
    ];

    // ถ้า role ของผู้ใช้เป็น 'ADMIN' หรือ 'PROVIDER' ให้เพิ่มเมนูพิเศษ
    if (session && (session.user.role === 'ADMIN' || session.user.role === 'PROVIDER')) {
      items.push(
        { name: 'จัดการพนักงาน', iconPath: <FaUserCog />, path: '/manage-staff' },
        
      );
    }

    return items;
  }, [session]);

  const handleSelect = (item) => setSelectedItem(item);

  const activePath = router.pathname;

  if (!session || !['ADMIN', 'TECH', 'CASHIER',"PROVIDER"].includes(session?.user?.role)) {
    return null; // หากไม่มี session หรือไม่มี role ที่กำหนด ให้ไม่แสดงอะไร
  }



  return (
    <div className="flex h-screen ">
      <aside className="w-64  shadow-md flex flex-col">
        <div className="p-4 flex items-center space-x-2">
          <Image src="/assets/backlogo.png" alt="avatar" width={40} height={40} />
          <div>
            <h2 className="text-lg font-semibold">{session.user.role} Dashboard</h2>
            <p className="text-xs ">{session.user.role} Plan</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto mt-6 menu rounded-md">
          <MenuItems items={menuItems} activePath={activePath} onSelect={handleSelect} />
        </nav>

        <section className="sidebar-footer justify-end bg-gray-2 pt-2">
          <div className="divider my-0"></div>
          <div className="dropdown z-50 flex h-fit w-full cursor-pointer hover:bg-gray-4">
            <label className="whites mx-2 flex h-fit w-full cursor-pointer p-0 hover:bg-gray-4" tabIndex="0">
              <div className="flex flex-row gap-4 p-4">
                <div className="avatar avatar-md">
                  <Image src="/assets/backlogo.png" alt="avatar" width={50} height={50} />
                </div>

                <div className="flex flex-col">
                  <span>{session.user.username}</span>
                  <span className="text-xs font-normal text-content2">{session.user.role}</span>
                </div>
              </div>
            </label>
            <div className="dropdown-menu dropdown-menu-right-top ml-2">
              <button tabIndex="-1" className="btn btn-error text-sm" onClick={handleSignOut}>Logout</button>
            </div>
          </div>
        </section>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
};

export default SidebarComponent;
