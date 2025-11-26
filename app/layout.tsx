import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GroupProvider } from '@/context/GroupContext'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fairmark - Fair Group Work Tracker',
  description: 'Track contributions and ensure fairness in university group projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <GroupProvider>
            {children}
          </GroupProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
