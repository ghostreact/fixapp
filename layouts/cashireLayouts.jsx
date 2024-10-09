// import React from 'react'

// const CashireLayouts = (props) => {
//   return (
//     <div>{props.children}</div>
//   )
// }

// export default CashireLayouts
import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const CashireLayouts = ({ children }) => {
  const { data: session } = useSession()

  return (
    <div className="flex">
      <aside className="w-64 bg-blue-600 text-white p-4 h-screen">
        <h2 className="text-2xl font-bold mb-4">Cashier Dashboard</h2>
        <nav>
          <ul>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/sales">Sales</Link></li>
            <li><Link href="/transactions">Transactions</Link></li>
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

export default CashireLayouts