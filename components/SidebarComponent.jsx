'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState, useMemo } from 'react';

const MenuItem = ({ item, isActive, onSelect }) => (
  <li
    className={`menu-item ${isActive ? 'menu-active bg-gray-200 menu-item' : ''}`}
    onClick={() => onSelect(item.name)}
  >
    <Link href={item.path} className="flex items-center space-x-2 cursor-pointer p-2 w-full menu-item">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 opacity-75"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d={item.iconPath} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{item.name}</span>
    </Link>
  </li>
);

const MenuItems = ({ items, activePath, onSelect }) => (
  <ul className="menu-items space-y-2">
    {items.map((item) => (
      <MenuItem
        key={item.name}
        item={item}
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
      { name: 'DashBoard', iconPath: 'M12 6v6m0 0v6m0-6h6m-6 0H6', path: '/Dashboard' },
      { name: 'เพิ่มเครื่องใหม่', iconPath: 'M12 6v6m0 0v6m0-6h6m-6 0H6', path: '/machine' },
      { name: 'สร้างการนัดหมาย', iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', path: '/meeting' },
      { name: 'สร้างวันหยุด', iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', path: '/holiday' },
      
    ];

    // ถ้า role ของผู้ใช้เป็น 'ADMIN' หรือ 'PROVIDER' ให้เพิ่มเมนูพิเศษ
    if (session && (session.user.role === 'ADMIN' || session.user.role === 'PROVIDER')) {
      items.push(
        { name: 'จัดการพนักงาน', iconPath: 'M5 13l4 4L19 7', path: '/manage-staff' },
        { name: 'ตารางวันนี้', iconPath: 'M4 6h16M4 10h16M4 14h16', path: '/today-schedule' }
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
                  <span>Sandra Marx</span>
                  <span className="text-xs font-normal text-content2">sandra</span>
                </div>
              </div>
            </label>
            <div className="dropdown-menu dropdown-menu-right-top ml-2">
              <a className="dropdown-item text-sm">Profile</a>
              <a tabIndex="-1" className="dropdown-item text-sm">Account settings</a>
              <a tabIndex="-1" className="dropdown-item text-sm">Settings</a>
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
