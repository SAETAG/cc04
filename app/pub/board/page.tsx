"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, ArrowLeft, Send, ThumbsUp, User, Calendar } from "lucide-react"

// Achievement options for the dropdown
const achievementOptions = [
  "まだ何もクリアしてないけど、これから頑張るぞ！",
  "ステージ１「闇の扉」」をクリアして「冒険者の誓約書」と「経験値50ポイント」を手に入れた！",
  "ステージ２「選別の祭壇」をクリアして「カースブレイカー」と「経験値50ポイント」を手に入れた！",
  "ステージ３「虚無の広間」をクリアして「秩序の書」と「経験値50ポイント」を手に入れた！",
  "おなかへった！",
  "ステージ４「選ばれし者」」をクリアして「断捨の剣・極」と「経験値50ポイント」を手に入れた！",
  "ステージ５「断捨離の審判」をクリアして「旅立ちの風呂敷」と「経験値50ポイント」を手に入れた！",
  "ステージ６「未練の洞窟」」をクリアして「空間測定のルーン」と「経験値50ポイント」を手に入れた！",
  "ステージ７「限界の迷宮」」をクリアして「整理の預言書」と「経験値50ポイント」を手に入れた！",
  "眠い…",
  "ステージ８「秩序の神殿」」をクリアして「無限の収納箱」と「経験値50ポイント」を手に入れた！",
  "ステージ９「時の洞窟」をクリアして「配置の羅針盤」と「経験値50ポイント」を手に入れた！",
  "ステージ10「最適化の聖域」をクリアして「記憶の封印札」と「経験値50ポイント」を手に入れた！",
  "ステージ11「記録の書庫」をクリアして「魔法のハンガー」と「経験値50ポイント」を手に入れた！",
  "野菜をいっぱい食べた！",
  "ステージ12「封印の間」をクリアして「輝きの鏡・真実」と「経験値50ポイント」を手に入れた！",
  "ステージ13「最終確認の間」をクリアして「クローゼットの秘宝」と「経験値50ポイント」を手に入れた！",
  "ステージ14「収納王国」をクリアして「整理収納マスターの鍵・聖域の鍵」と「経験値50ポイント」を手に入れた！",
  "クローゼット王国の王になった！",
]

// Post type definition
interface Post {
  id: string
  content: string
  date: string
  username: string
  geniusCount: number
}

// Generate random username for demo purposes
const generateUsername = () => {
  const prefixes = ["勇者", "冒険者", "整理魔法使い", "収納騎士", "断捨離の達人"]
  const suffixes = ["アルフレッド", "エリカ", "マックス", "オリビア", "レオン", "ソフィア", "ノア"]
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
  return `${prefix}・${suffix}`
}

export default function BoardPage() {
  const router = useRouter()
  const [selectedAchievement, setSelectedAchievement] = useState("")
  const [posts, setPosts] = useState<Post[]>([])

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem("achievementPosts")
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    }
  }, [])

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem("achievementPosts", JSON.stringify(posts))
  }, [posts])

  const handleSubmit = () => {
    if (!selectedAchievement) return

    const newPost: Post = {
      id: Date.now().toString(),
      content: selectedAchievement,
      date: new Date().toLocaleDateString("ja-JP"),
      username: generateUsername(),
      geniusCount: 0,
    }

    setPosts((prevPosts) => [newPost, ...prevPosts])
    setSelectedAchievement("")
  }

  const handleGeniusClick = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? { ...post, geniusCount: post.geniusCount + 1 } : post)),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900/90 to-amber-800/90">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-amber-950/80 border-b border-amber-600/50 shadow-md">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-amber-200 hover:text-amber-100 hover:bg-amber-800/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Link href="/home">
            <Button variant="ghost" size="icon" className="text-amber-200 hover:text-amber-100 hover:bg-amber-800/50">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <h1 className="text-xl font-bold text-amber-200 text-center flex-1">勇者の戦果報告ボード</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      <main className="container mx-auto p-4 max-w-3xl">
        {/* Post Form */}
        <Card className="mb-8 bg-amber-100/10 border-amber-600/30 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold text-amber-200">あなたの戦果を報告する</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedAchievement} onValueChange={setSelectedAchievement}>
                <SelectTrigger className="bg-amber-800/50 border-amber-600/50 text-amber-100 focus:ring-amber-500">
                  <SelectValue placeholder="戦果を選択してください" />
                </SelectTrigger>
                <SelectContent className="bg-amber-900 border-amber-600 text-amber-100 max-h-[300px]">
                  {achievementOptions.map((option, index) => (
                    <SelectItem key={index} value={option} className="focus:bg-amber-800 focus:text-amber-100">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleSubmit}
                disabled={!selectedAchievement}
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                報告する
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card className="bg-amber-100/10 border-amber-600/30 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center text-amber-200">
                まだ報告がありません。あなたが最初の報告者になりましょう！
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card
                key={post.id}
                className="bg-amber-100/10 border-amber-600/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-700 rounded-full p-2">
                      <User className="h-5 w-5 text-amber-200" />
                    </div>
                    <div>
                      <p className="font-semibold text-amber-200">{post.username}</p>
                      <div className="flex items-center text-xs text-amber-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.date}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <p className="text-amber-100 whitespace-pre-wrap">{post.content}</p>
                </CardContent>
                <CardFooter className="pt-0 pb-3 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGeniusClick(post.id)}
                    className="text-amber-400 hover:text-amber-300 hover:bg-amber-800/30"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    天才 {post.geniusCount > 0 && post.geniusCount}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

