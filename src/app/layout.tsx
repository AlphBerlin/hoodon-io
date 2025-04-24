import {headers} from 'next/headers'
import {AuthProvider} from '@/context/auth-context'
import {LoginModal} from '@/components/login-modal'
import '@/styles/globals.css'


export default function RootLayout({children}: { children: React.ReactNode }) {
    const headersList = headers()
    const pathType = headersList.get('x-path-type') || 'default'

    return (
        <html lang="en">
        <head>
            <meta name="path-type" content={pathType}/>
        </head>
        <body>
        <AuthProvider>
            {children}
            <LoginModal/>
        </AuthProvider>
        </body>
        </html>
    )
}
