import type { Metadata } from 'next'
import './globals.css'
import MobileNav from '../components/MobileNav'

export const metadata: Metadata = {
  title: 'Execli - Modern SaaS Platform',
  description: 'A modern SaaS platform built with Next.js and TailwindCSS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text antialiased">
        {children}
        <MobileNav />
      </body>
    </html>
  )
} 