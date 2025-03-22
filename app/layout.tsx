import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { restoreSession } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Closet Chronicle",
  description: "This is the story of taking back your closet—and your life.",
  generator: "cc01",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add this script to clean up vsc-initialized class before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              // Remove vsc-initialized class from body if it exists
              document.addEventListener('DOMContentLoaded', function() {
                if (document.body && document.body.classList.contains('vsc-initialized')) {
                  document.body.classList.remove('vsc-initialized');
                }
              });
            })();
          `,
          }}
        />

        {/* セッション復元スクリプト */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (async function() {
              try {
                const response = await fetch('/api/restore-session');
                if (!response.ok) {
                  console.log('セッション復元に失敗しました');
                }
              } catch (error) {
                console.error('セッション復元中にエラーが発生しました:', error);
              }
            })();
          `,
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

