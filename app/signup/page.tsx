"use client"

import { useState, type FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, Mail, User } from "lucide-react"
import { signUp } from "@/lib/auth"

function FloatingEmojis() {
  const [emojis, setEmojis] = useState<React.ReactNode[]>([])
  const clothingEmojis = ["👒", "👑", "👗", "👙", "👖", "✨", "🧤", "💃", "🦺", "🧦"]

  useEffect(() => {
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

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const trimmedName = name.trim()
      if (trimmedName.length < 3 || trimmedName.length > 20) {
        throw new Error("ユーザー名は3～20文字で入力してください")
      }
      const usernameRegex = /^[A-Za-z0-9_]+$/
      if (!usernameRegex.test(trimmedName)) {
        throw new Error("ユーザー名は英数字とアンダースコアのみ使用可能です")
      }
      if (!email || !password) {
        throw new Error("すべての項目を入力してください")
      }
      if (password.length < 6) {
        throw new Error("パスワードは6文字以上で入力してください")
      }

      const result = await signUp({ name: trimmedName, email, password })
      console.log("登録成功:", result)
      router.push("/prologue")
    } catch (err: any) {
      console.error("登録エラー詳細:", JSON.stringify(err, null, 2))
      setError(typeof err === "string" ? err : err.message || "アカウント登録に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-teal-950 p-4 relative overflow-hidden">
      <FloatingEmojis />

      <div className="max-w-md w-full bg-teal-900 p-6 sm:p-8 rounded-xl shadow-lg border-2 border-teal-700 z-10 animate-magical-appear">
        <div className="text-center space-y-2 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]">
            アカウント登録
          </h1>
          <p className="text-sm sm:text-base text-white">新たな冒険を始めましょう</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="name" className="text-white text-sm sm:text-base">
              名前（プレイネーム）
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-teal-300" />
              <Input
                id="name"
                type="text"
                placeholder="あなたの名前"
                className="pl-10 bg-teal-800 border-teal-600 text-white placeholder:text-teal-300 focus:border-teal-500 focus:ring-teal-500 h-10 sm:h-11 text-sm sm:text-base"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <p className="text-xs text-teal-300 mt-1">
              ユーザー名は3～20文字で入力してください（英数字とアンダースコアのみ使用可能）
            </p>
          </div>

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
                minLength={6}
              />
            </div>
            <p className="text-xs text-teal-300 mt-1">パスワードは6文字以上で入力してください</p>
          </div>

          <Button
            type="submit"
            className="w-full bg-teal-800 hover:bg-teal-700 text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] font-medium py-2 px-4 rounded-lg border border-teal-600 h-10 sm:h-11 text-sm sm:text-base"
            disabled={isLoading}
          >
            {isLoading ? "登録中..." : "登録する"}
          </Button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <Link href="/login" className="text-teal-300 hover:text-yellow-200 text-xs sm:text-sm">
            すでにアカウントお持ちですか？ログイン
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-16 bg-teal-950 opacity-90 z-0"></div>
      <div className="absolute bottom-0 w-full h-8 bg-teal-950 opacity-95 z-0"></div>
    </div>
  )
}
