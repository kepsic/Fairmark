'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUserName')
    if (currentUser) {
      router.replace('/groups')
    } else {
      router.replace('/login')
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading..." />
  }

  return null
}
