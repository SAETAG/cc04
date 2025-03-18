"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Home,
  ArrowLeft,
  Plus,
  X,
  Upload,
  Sparkles,
  BookOpen,
  Calendar,
  User,
  Trash2,
  Edit,
  XCircle,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
      "物は「種類」ではなく「場所」で分類すると探しやすくなります。例えば、リビングで使うものはリビングに、寝室で使うものは寝室に置くという考え方です。\n\n「どこで使うか」を基準に整理することで、必要な時に必要なものがすぐに見つかるようになります。また、使用頻度によって収納場所を決めるのも効果的です。毎日使うものは手の届きやすい場所に、季節ものや特別な時だけ使うものは奥や高い場所に収納しましょう。",
    image: null,
    author: "賢者・アルカディア",
    date: "2023年12月15日",
  },
  {
    id: "2",
    title: "衣類の畳み方の秘術",
    content:
      "衣類は立てて収納すると、何がどこにあるか一目でわかります。引き出しの中で服を横に重ねるのではなく、縦に並べて収納してみましょう。\n\n立てて収納する際のコツは、長方形になるように折りたたむことです。Tシャツなら袖を内側に折り、下から三つ折りにすると自立しやすくなります。これにより、引き出しを開けた時に全ての服が見渡せるようになり、服選びがスムーズになります。",
    image: null,
    author: "魔術師・メリウス",
    date: "2024年1月3日",
  },
  {
    id: "3",
    title: "小物整理の魔法",
    content:
      "小物は「仕切り」を使うことで劇的に整理できます。引き出しの中に小さな箱や仕切りを入れて、アクセサリーや文房具などを種類ごとに分けて収納しましょう。\n\n100円ショップで売っている仕切りケースや、使わなくなった箱、お菓子の空き箱なども活用できます。同じ種類のものをまとめることで、必要な時にすぐに見つけることができます。また、透明なケースを使うと中身が一目でわかるので特におすすめです。",
    image: null,
    author: "学者・エレノア",
    date: "2024年2月20日",
  },
]

// BGM URL - using the correct path to the file in public directory
const BGM_URL = "/pub.mp3"

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

  // State for tips, expanded card, and forms
  const [tips, setTips] = useState<Tip[]>([])
  const [expandedTip, setExpandedTip] = useState<Tip | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false)
  const [newTip, setNewTip] = useState({
    title: "",
    content: "",
    image: null as string | null,
  })
  const [updateTip, setUpdateTip] = useState<Tip | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [updateImagePreview, setUpdateImagePreview] = useState<string | null>(null)

  // Audio state
  const [isSoundOn, setIsSoundOn] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load tips and sound preference from localStorage on mount
  useEffect(() => {
    const savedTips = localStorage.getItem("pubTips")
    if (savedTips) {
      setTips(JSON.parse(savedTips))
    } else {
      setTips(initialTips)
      localStorage.setItem("pubTips", JSON.stringify(initialTips))
    }

    // Load sound preference, default to ON if not set
    const soundPreference = localStorage.getItem("pubSoundPreference")
    if (soundPreference !== null) {
      setIsSoundOn(soundPreference === "on")
    } else {
      // If no preference is stored, default to ON and save it
      localStorage.setItem("pubSoundPreference", "on")
    }
  }, [])

  // Initialize audio
  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(BGM_URL)
    audioRef.current.loop = true
    audioRef.current.volume = 0.5

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Handle sound toggle
  useEffect(() => {
    if (!audioRef.current) return

    if (isSoundOn) {
      // Play sound with a promise to handle autoplay restrictions
      const playPromise = audioRef.current.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented:", error)
        })
      }
    } else {
      audioRef.current.pause()
    }

    // Save preference
    localStorage.setItem("pubSoundPreference", isSoundOn ? "on" : "off")
  }, [isSoundOn])

  // Toggle sound
  const toggleSound = () => {
    setIsSoundOn((prev) => !prev)
  }

  // Save tips to localStorage when they change
  useEffect(() => {
    if (tips.length > 0) {
      localStorage.setItem("pubTips", JSON.stringify(tips))
    }
  }, [tips])

  // Handle card click to expand
  const handleCardClick = (tip: Tip) => {
    setExpandedTip(tip)
  }

  // Format content with paragraphs
  const formatContent = (content: string) => {
    return content.split("\n\n").map((paragraph, index) => (
      <p key={index} className={`${expandedTip ? "text-base mb-4" : "text-sm mb-3"}`}>
        {paragraph}
      </p>
    ))
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

  // Handle delete tip
  const handleDeleteTip = (e: React.MouseEvent, id: string) => {
    e.stopPropagation() // Prevent card click when clicking delete button
    setTips(tips.filter((tip) => tip.id !== id))
    setExpandedTip(null) // Close expanded view if deleting the expanded tip
  }

  // Handle update tip - open update form
  const handleUpdateTip = (e: React.MouseEvent, tip: Tip) => {
    e.stopPropagation() // Prevent card click when clicking update button
    setUpdateTip(tip)
    setUpdateImagePreview(tip.image)
    setIsUpdateFormOpen(true)
  }

  // Handle update form submission
  const handleUpdateSubmit = () => {
    if (!updateTip || !updateTip.title || !updateTip.content) return

    const updatedTips = tips.map((tip) => (tip.id === updateTip.id ? updateTip : tip))

    setTips(updatedTips)

    // Update the expanded tip if it's the one being edited
    if (expandedTip && expandedTip.id === updateTip.id) {
      setExpandedTip(updateTip)
    }

    setUpdateTip(null)
    setUpdateImagePreview(null)
    setIsUpdateFormOpen(false)
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

  // Handle update image upload
  const handleUpdateImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && updateTip) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setUpdateTip({ ...updateTip, image: result })
        setUpdateImagePreview(result)
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
          style={
            {
              ...sparkleStyles,
              top: `${top}%`,
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              opacity: Math.random() * 0.7 + 0.3,
            } as React.CSSProperties
          }
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

          {/* Sound Toggle Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSound}
                  className={`bg-amber-950/50 border-amber-700 hover:bg-amber-800/50 ${isSoundOn ? "text-green-300" : "text-amber-200"}`}
                >
                  {isSoundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{isSoundOn ? "BGMをオフにする" : "BGMをオンにする"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
            <div key={tip.id} className="h-64 group">
              <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-4 flex flex-col items-center justify-center border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] overflow-hidden rounded-md h-full transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(234,179,8,0.6)] group-hover:translate-y-[-8px] relative">
                <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=200&width=200')] bg-center bg-no-repeat"></div>
                {generateSparkles(5)}
                <div className="z-10 text-center">
                  <h3 className="text-xl font-bold text-yellow-300 mb-2">{tip.title}</h3>
                  <div className="mt-6">
                    <Button
                      onClick={() => handleCardClick(tip)}
                      className="bg-amber-600 hover:bg-amber-500 text-white border border-amber-400 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      開く
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleUpdateTip(e, tip)}
                    className="bg-amber-800/40 hover:bg-amber-700/60 text-amber-200 h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteTip(e, tip.id)}
                    className="bg-red-900/40 hover:bg-red-800/60 text-red-200 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Card Modal */}
      {expandedTip && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 text-amber-950 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden relative animate-scaleIn">
            <button
              onClick={() => setExpandedTip(null)}
              className="absolute top-3 right-3 text-amber-900 hover:text-amber-700 z-10"
            >
              <XCircle className="h-8 w-8" />
            </button>

            <div className="p-6 flex flex-col h-full max-h-[90vh]">
              <h2 className="text-2xl font-bold text-amber-900 mb-4 text-center border-b-2 border-amber-300 pb-3">
                {expandedTip.title}
              </h2>

              <div className="overflow-y-auto flex-grow pr-2 scroll-unroll">
                <div className="prose prose-amber max-w-none">{formatContent(expandedTip.content)}</div>

                {expandedTip.image ? (
                  <div className="mt-6 flex justify-center">
                    <div className="relative rounded-md border-2 border-amber-300 overflow-hidden w-full max-w-md h-[240px]">
                      <Image
                        src={expandedTip.image || "/placeholder.svg"}
                        alt={expandedTip.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 flex justify-center">
                    <div className="text-8xl flex items-center justify-center h-32">🧑‍🏫</div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-3 border-t-2 border-amber-300 flex justify-between items-center">
                <div className="text-sm text-amber-800">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{expandedTip.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{expandedTip.date}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={(e) => handleUpdateTip(e, expandedTip)}
                    className="bg-amber-200 hover:bg-amber-300 border-amber-400 text-amber-900"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    更新
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => handleDeleteTip(e, expandedTip.id)}
                    className="bg-red-100 hover:bg-red-200 border-red-300 text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    削除
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <p className="text-xs text-amber-400">ヒント: 段落を分けるには、空行を入れてください（Enterを2回押す）</p>
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

      {/* Update Tip Form Dialog */}
      <Dialog open={isUpdateFormOpen} onOpenChange={setIsUpdateFormOpen}>
        <DialogContent className="bg-gradient-to-br from-amber-900 to-amber-950 border border-amber-700 text-amber-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-amber-200 text-xl">知恵を更新</DialogTitle>
          </DialogHeader>

          {updateTip && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="update-title" className="text-amber-200">
                  タイトル
                </Label>
                <Input
                  id="update-title"
                  value={updateTip.title}
                  onChange={(e) => setUpdateTip({ ...updateTip, title: e.target.value })}
                  placeholder="知恵のタイトルを入力..."
                  className="bg-amber-950/50 border-amber-700 text-amber-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-content" className="text-amber-200">
                  内容
                </Label>
                <Textarea
                  id="update-content"
                  value={updateTip.content}
                  onChange={(e) => setUpdateTip({ ...updateTip, content: e.target.value })}
                  placeholder="あなたの知恵を共有しましょう..."
                  className="bg-amber-950/50 border-amber-700 text-amber-100 min-h-[120px]"
                />
                <p className="text-xs text-amber-400">
                  ヒント: 段落を分けるには、空行を入れてください（Enterを2回押す）
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-image" className="text-amber-200">
                  画像（任意）
                </Label>
                <div className="flex items-center gap-2">
                  <label className="flex-1">
                    <div className="bg-amber-950/50 border border-amber-700 rounded-md p-2 text-center cursor-pointer hover:bg-amber-800/50 transition-colors">
                      <Upload className="h-5 w-5 mx-auto mb-1 text-amber-300" />
                      <span className="text-sm">画像をアップロード</span>
                    </div>
                    <input
                      type="file"
                      id="update-image"
                      accept="image/*"
                      onChange={handleUpdateImageUpload}
                      className="hidden"
                    />
                  </label>

                  {updateImagePreview && (
                    <div className="relative h-16 w-16 border border-amber-700 rounded overflow-hidden">
                      <Image
                        src={updateImagePreview || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setUpdateImagePreview(null)
                          setUpdateTip({ ...updateTip, image: null })
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
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateFormOpen(false)}
              className="border-amber-700 text-amber-200 hover:bg-amber-800/50"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleUpdateSubmit}
              disabled={!updateTip || !updateTip.title || !updateTip.content}
              className="bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white"
            >
              更新する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSS for animations and styling */}
      <style jsx global>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        .scroll-unroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(180, 83, 9, 0.3) rgba(120, 53, 15, 0.1);
        }
        
        .scroll-unroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .scroll-unroll::-webkit-scrollbar-track {
          background: rgba(120, 53, 15, 0.1);
          border-radius: 3px;
        }
        
        .scroll-unroll::-webkit-scrollbar-thumb {
          background-color: rgba(180, 83, 9, 0.3);
          border-radius: 3px;
        }
        
        .prose-amber {
          --tw-prose-body: #713f12;
          --tw-prose-headings: #854d0e;
          --tw-prose-lead: #854d0e;
          --tw-prose-links: #854d0e;
          --tw-prose-bold: #713f12;
          --tw-prose-counters: #854d0e;
          --tw-prose-bullets: #854d0e;
          --tw-prose-hr: #eab308;
          --tw-prose-quotes: #713f12;
          --tw-prose-quote-borders: #eab308;
          --tw-prose-captions: #854d0e;
          --tw-prose-code: #713f12;
          --tw-prose-pre-code: #e5e7eb;
          --tw-prose-pre-bg: #1f2937;
          --tw-prose-th-borders: #d97706;
          --tw-prose-td-borders: #fcd34d;
        }
      `}</style>
    </main>
  )
}

