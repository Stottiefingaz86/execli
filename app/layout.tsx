import type { Metadata } from 'next'
import './globals.css'

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
      </body>
    </html>
  )
} 