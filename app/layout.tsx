import type { Metadata } from 'next'
import { Montserrat, Open_Sans } from 'next/font/google'
import './globals.css'
import { GroupProvider } from '@/context/GroupContext'
import ErrorBoundary from '@/components/ErrorBoundary'

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
      <body className={`${openSans.className} bg-[#F5F5F5] min-h-screen`}>
        <ErrorBoundary>
          <GroupProvider>
            <header className="bg-[#003A79] text-white py-4 px-6 shadow-md">
              <div className="max-w-7xl mx-auto">
                <h1 className={`${montserrat.className} text-xl font-bold tracking-wide`}>
                  Fairmark – Project Fairness Manager
                </h1>
              </div>
            </header>
            <main className="max-w-7xl mx-auto p-6">
              {children}
            </main>
          </GroupProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
