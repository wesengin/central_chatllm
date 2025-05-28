import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Central Hospitalar Web - Sistema de Monitoramento',
  description: 'Sistema avançado de monitoramento hospitalar com IA para predição de sepse e prevenção de morte súbita',
  keywords: 'hospital, monitoramento, ECG, sinais vitais, sepse, morte súbita, EWS, MEWS, IA',
  authors: [{ name: 'Central Hospitalar Web Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}