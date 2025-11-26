'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useGroups } from '@/context/GroupContext'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { currentUserName, setCurrentUserName } = useGroups()

  const handleLogout = () => {
    if (confirm('Switch user? This will log you out.')) {
      setCurrentUserName(null)
      router.push('/login')
    }
  }

  const showLogout = currentUserName && pathname !== '/login'

  return (
    <header className="bg-[#003A79] text-white py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wide font-[family-name:var(--font-montserrat)]">
          Fairmark – Project Fairness Manager
        </h1>
        {showLogout && (
          <div className="flex items-center gap-4">
            <span className="text-sm">
              Logged in as <span className="font-semibold">{currentUserName}</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm border border-white text-white px-3 py-1 rounded-md hover:bg-white hover:text-[#003A79] transition"
            >
              Switch User
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
