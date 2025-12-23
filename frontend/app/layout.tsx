import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { RfpProvider } from '@/contexts/RfpContext'
import { AppProvider } from '@/contexts/AppContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'RFP Platform - AI-Powered RFP Management',
    description: 'Manage and respond to RFPs with AI-powered automation',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AppProvider>
                    <RfpProvider>
                        {children}
                    </RfpProvider>
                </AppProvider>
            </body>
        </html>
    )
}
