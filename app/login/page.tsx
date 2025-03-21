"use client"

import type React from "react"

import { useState, type FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, Mail } from "lucide-react"
import { login, checkIsFirstLogin } from "@/lib/auth"

// 絵文字の背景コンポーネント
function FloatingEmojis() {
  const [emojis, setEmojis] = useState<React.ReactNode[]>([])
  const clothingEmojis = ["👒", "👑", "👗", "👙", "👖", "✨", "🧤", "💃", "🦺", "🧦"]

  useEffect(() => {
    // クライアントサイドでのみ実行
    const emojiElements = Array.from({ length: 20 }, (_, i) => (
      <div
        key={i}
        className="absolute text-2xl float-animation"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: 0.2 + Math.random() * 0.3,
          transform: `scale(${0.8 + Math.random() * 0.7})`,
          animationDuration: `${6 + Math.random() * 8}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      >
        {clothingEmojis[Math.floor(Math.random() * clothingEmojis.length)]}
      </div>
    ))

    setEmojis(emojiElements)
  }, [])

  return <div className="absolute inset-0 overflow-hidden">{emojis}</div>
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // バリデーション
      if (!email || !password) {
        throw new Error("メールアドレスとパスワードを入力してください")
      }

      // PlayFabでログイン
      const result = await login({ email, password })
      console.log("ログイン成功:", result)

      // 初回ログインかどうかを確認
      const isFirstLogin = await checkIsFirstLogin(result)

      // 初回ログインの場合は/prologueに、それ以外は/homeにリダイレクト
      if (isFirstLogin) {
        router.push("/prologue")
      } else {
        router.push("/home")
      }
    } catch (err: any) {
      console.error("ログインエラー:", err)
      setError(typeof err === "string" ? err : err.message || "ログインに失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-teal-950 p-4 relative overflow-hidden">
      {/* 絵文字の背景コンポーネント */}
      <FloatingEmojis />

      <div className="max-w-md w-full bg-teal-900 p-6 sm:p-8 rounded-xl shadow-lg border-2 border-teal-700 z-10 animate-magical-appear">
        <div className="text-center space-y-2 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]">
            ログイン
          </h1>
          <p className="text-sm sm:text-base text-white">冒険を続けるために、ログインしてください</p>
          <p className="text-xs text-teal-300 mt-1">
            ※ログイン後の画面では、音楽が再生されます（音楽：魔王魂）
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">{error}</div>
        )}

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="email" className="text-white text-sm sm:text-base">
              メールアドレス
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-teal-300" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="pl-10 bg-teal-800 border-teal-600 text-white placeholder:text-teal-300 focus:border-teal-500 focus:ring-teal-500 h-10 sm:h-11 text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="password" className="text-white text-sm sm:text-base">
              パスワード
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-teal-300" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-teal-800 border-teal-600 text-white placeholder:text-teal-300 focus:border-teal-500 focus:ring-teal-500 h-10 sm:h-11 text-sm sm:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-teal-800 hover:bg-teal-700 text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] font-medium py-2 px-4 rounded-lg border border-teal-600 h-10 sm:h-11 text-sm sm:text-base"
            disabled={isLoading}
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </Button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <Link href="/signup" className="text-teal-300 hover:text-yellow-200 text-xs sm:text-sm">
            アカウントをお持ちでない方はこちら
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-16 bg-teal-950 opacity-90 z-0"></div>
      <div className="absolute bottom-0 w-full h-8 bg-teal-950 opacity-95 z-0"></div>
    </div>
  )
}

