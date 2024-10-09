// import SidebarComponent from '@/components/SidebarComponent'
// import React from 'react'

// const TechLayouts = (props) => {
//   return (
//     <div>
       
//            {props.children}
           
      
       
//     </div>
//   )
// }

// export default TechLayouts

import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import SidebarComponent from '@/components/SidebarComponent'

const TechLayouts = ({ children }) => {
  const { data: session } = useSession()

  return (
    <div className="flex">
     
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {session?.user.name}</h1>
        </header>
        <nav className="mb-8">
          <ul className="flex space-x-4">
            <li><Link href="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link></li>
            <li><Link href="/tasks" className="text-blue-600 hover:underline">My Tasks</Link></li>
            <li><Link href="/machines" className="text-blue-600 hover:underline">Machines</Link></li>
          </ul>
        </nav>
        {children}
      </main>
    </div>
  )
}

export default TechLayouts