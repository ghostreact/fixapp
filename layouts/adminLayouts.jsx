// import React from 'react'

// const AdminLayouts = (props) => {
//   return (
//     <div>
//       {props.children}
//     okokokokkkok
//     </div>
//   )
// }

// export default AdminLayouts

import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const AdminLayouts = ({ children }) => {
  const { data: session } = useSession()

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white p-4 h-screen">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <nav>
          <ul>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/users">Manage Users</Link></li>
            <li><Link href="/machines">Manage Machines</Link></li>
            {/* เพิ่มเมนูอื่นๆ ตามความเหมาะสม */}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {session?.user.name}</h1>
        </header>
        {children}
      </main>
    </div>
  )
}

export default AdminLayouts