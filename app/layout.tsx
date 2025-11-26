import type { Metadata } from 'next'
import { Montserrat, Open_Sans } from 'next/font/google'
import './globals.css'
import { GroupProvider } from '@/context/GroupContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import Header from '@/components/Header'

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  weight: ['400', '600', '700'],
  variable: '--font-montserrat'
})

const openSans = Open_Sans({ 
  subsets: ['latin'], 
  weight: ['300', '400', '600'],
  variable: '--font-open-sans'
})

export const metadata: Metadata = {
  title: 'Fairmark – Project Fairness Manager',
  description: 'Track contributions and ensure fairness in university group projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${openSans.className} ${montserrat.variable} bg-[#F5F5F5] min-h-screen`}>
        <ErrorBoundary>
          <GroupProvider>
            <Header />
            <main className="max-w-7xl mx-auto p-6">
              {children}
            </main>
          </GroupProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
