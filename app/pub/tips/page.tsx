"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Home, ArrowLeft, Plus, X, Upload, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Define the tip type
interface Tip {
  id: string
  title: string
  content: string
  image: string | null
  author: string
  date: string
}

// Sample authors for random selection
const authors = [
  "賢者・アルカディア",
  "魔術師・メリウス",
  "学者・エレノア",
  "旅人・ソラ",
  "占星術師・ルナ",
  "錬金術師・フィリウス",
  "書記官・セリア",
  "吟遊詩人・リリック",
  "古代文明研究家・アーロン",
  "収納の達人・クロエ",
]

// Sample initial tips
const initialTips: Tip[] = [
  {
    id: "1",
    title: "収納の黄金法則",
    content:
      "物は「種類」ではなく「場所」で分類すると探しやすくなります。例えば、リビングで使うものはリビングに、寝室で使うものは寝室に置くという考え方です。",
    image: null,
    author: "賢者・アルカディア",
    date: "2023年12月15日",
  },
  {
    id: "2",
    title: "衣類の畳み方の秘術",
    content:
      "衣類は立てて収納すると、何がどこにあるか一目でわかります。引き出しの中で服を横に重ねるのではなく、縦に並べて収納してみましょう。",
    image: null,
    author: "魔術師・メリウス",
    date: "2024年1月3日",
  },
  {
    id: "3",
    title: "小物整理の魔法",
    content:
      "小物は「仕切り」を使うことで劇的に整理できます。引き出しの中に小さな箱や仕切りを入れて、アクセサリーや文房具などを種類ごとに分けて収納しましょう。",
    image: null,
    author: "学者・エレノア",
    date: "2024年2月20日",
  },
]

export default function TipsPage() {
  // Add this style block inside the component, before the return statement
  const sparkleStyles = {
    position: "absolute",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 215, 0, 0.8)",
    filter: "blur(1px)",
    animation: "sparkle 2s infinite ease-in-out",
  }

  // State for tips, flipped cards, and form
  const [tips, setTips] = useState<Tip[]>([])
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [newTip, setNewTip] = useState({
    title: "",
    content: "",
    image: null as string | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Load tips from localStorage on mount
  useEffect(() => {
    const savedTips = localStorage.getItem("pubTips")
    if (savedTips) {
      setTips(JSON.parse(savedTips))
    } else {
      setTips(initialTips)
      localStorage.setItem("pubTips", JSON.stringify(initialTips))
    }
  }, [])

  // Save tips to localStorage when they change
  useEffect(() => {
    if (tips.length > 0) {
      localStorage.setItem("pubTips", JSON.stringify(tips))
    }
  }, [tips])

  // Handle card flip
  const handleCardFlip = (id: string) => {
    if (flippedCardId === id) {
      setFlippedCardId(null)
    } else {
      setFlippedCardId(id)
    }
  }

  // Handle form submission
  const handleSubmit = () => {
    if (!newTip.title || !newTip.content) return

    const randomAuthor = authors[Math.floor(Math.random() * authors.length)]
    const today = new Date()
    const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`

    const newTipItem: Tip = {
      id: Date.now().toString(),
      title: newTip.title,
      content: newTip.content,
      image: newTip.image,
      author: randomAuthor,
      date: formattedDate,
    }

    setTips([newTipItem, ...tips])
    setNewTip({ title: "", content: "", image: null })
    setImagePreview(null)
    setIsFormOpen(false)
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setNewTip({ ...newTip, image: result })
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Generate random sparkle positions
  const generateSparkles = (count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const top = Math.random() * 100
      const left = Math.random() * 100
      const delay = Math.random() * 2
      const size = 5 + Math.random() * 5

      return (
        <div
          key={i}
          style={{
            ...sparkleStyles,
            top: `${top}%`,
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${delay}s`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
        />
      )
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-900/80 to-amber-950/90 text-amber-100">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-amber-800/50">
        <div className="flex items-center gap-2">
          <Link href="/pub/lobby">
            <Button variant="outline" size="icon" className="bg-amber-950/50 border-amber-700 hover:bg-amber-800/50">
              <ArrowLeft className="h-5 w-5 text-amber-200" />
            </Button>
          </Link>
          <Link href="/home">
            <Button variant="outline" size="icon" className="bg-amber-950/50 border-amber-700 hover:bg-amber-800/50">
              <Home className="h-5 w-5 text-amber-200" />
            </Button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-center text-amber-200 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-300" />
          知恵の書
          <Sparkles className="h-6 w-6 text-yellow-300" />
        </h1>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-br from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800 text-white border border-purple-500"
        >
          <Plus className="h-5 w-5 mr-1" /> 知恵を共有
        </Button>
      </header>

      {/* Card Grid */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className={`flip-card h-64 cursor-pointer ${flippedCardId === tip.id ? "flipped" : ""}`}
              onClick={() => handleCardFlip(tip.id)}
            >
              <div className="flip-card-inner h-full">
                {/* Front of Card (Magic Book Style) */}
                <div className="flip-card-front bg-gradient-to-br from-indigo-900 to-purple-900 p-4 flex flex-col items-center justify-center border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=200&width=200')] bg-center bg-no-repeat"></div>
                  {generateSparkles(5)}
                  <div className="z-10 text-center">
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">{tip.title}</h3>
                    <div className="text-amber-200 text-sm">タップして開く</div>
                  </div>
                </div>

                {/* Back of Card (Ancient Scroll Style) */}
                <div className="flip-card-back bg-amber-100 text-amber-950 p-5 border-2 border-amber-800 overflow-hidden">
                  <div className="h-full flex flex-col">
                    <h3 className="text-lg font-bold text-amber-900 mb-2 text-center border-b border-amber-300 pb-2">
                      {tip.title}
                    </h3>

                    <div className="flex-grow overflow-y-auto scroll-unroll">
                      <p className="text-sm mb-3">{tip.content}</p>

                      {tip.image ? (
                        <div className="mt-2 flex justify-center">
                          <Image
                            src={tip.image || "/placeholder.svg"}
                            alt={tip.title}
                            width={200}
                            height={120}
                            className="rounded border border-amber-300 object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mt-2 flex justify-center">
                          <div className="text-6xl flex items-center justify-center h-20">🧑‍🏫</div>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto pt-2 text-right text-xs text-amber-800 border-t border-amber-300">
                      <p>
                        {tip.author} • {tip.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Tip Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-gradient-to-br from-amber-900 to-amber-950 border border-amber-700 text-amber-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-amber-200 text-xl">新しい知恵を共有</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-amber-200">
                タイトル
              </Label>
              <Input
                id="title"
                value={newTip.title}
                onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
                placeholder="知恵のタイトルを入力..."
                className="bg-amber-950/50 border-amber-700 text-amber-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-amber-200">
                内容
              </Label>
              <Textarea
                id="content"
                value={newTip.content}
                onChange={(e) => setNewTip({ ...newTip, content: e.target.value })}
                placeholder="あなたの知恵を共有しましょう..."
                className="bg-amber-950/50 border-amber-700 text-amber-100 min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-amber-200">
                画像（任意）
              </Label>
              <div className="flex items-center gap-2">
                <label className="flex-1">
                  <div className="bg-amber-950/50 border border-amber-700 rounded-md p-2 text-center cursor-pointer hover:bg-amber-800/50 transition-colors">
                    <Upload className="h-5 w-5 mx-auto mb-1 text-amber-300" />
                    <span className="text-sm">画像をアップロード</span>
                  </div>
                  <input type="file" id="image" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                {imagePreview && (
                  <div className="relative h-16 w-16 border border-amber-700 rounded overflow-hidden">
                    <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setImagePreview(null)
                        setNewTip({ ...newTip, image: null })
                      }}
                      className="absolute top-0 right-0 bg-red-600 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFormOpen(false)}
              className="border-amber-700 text-amber-200 hover:bg-amber-800/50"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!newTip.title || !newTip.content}
              className="bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white"
            >
              共有する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

