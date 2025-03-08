import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "长沙市公交状态查询",
  description: "查询长沙市公交运营状态",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // 使用提供的Web端JS API密钥和安全密钥
  const amapKey = "955fef6c5f23d2b3a6f82a98fcb34402"
  const securityJsCode = "a5bff30a6467bf0b7adee7314334f11c"

  return (
    <html lang="zh-CN">
      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              window._AMapSecurityConfig = {
                securityJsCode: '${securityJsCode}',
              }
            `,
          }}
        />
        <script type="text/javascript" src={`https://webapi.amap.com/maps?v=2.0&key=${amapKey}`}></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'