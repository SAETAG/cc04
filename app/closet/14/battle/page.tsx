"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ArrowLeft, Home } from "lucide-react"

export default function Battle14() {
  const router = useRouter()
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [checkedItems, setCheckedItems] = useState({
    madeLabels: false,
    attachedLabels: false,
    sharedWithFamily: false,
  })

  useEffect(() => {
    audioRef.current = new Audio("/stepfight_14.mp3")
    audioRef.current.loop = true
    audioRef.current.play().catch((error) => console.error("Audio playback failed:", error))

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted
    }
  }

  const handleComplete = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    router.push("/closet/14/clear")
  }

  const handleCheckboxChange = (item: keyof typeof checkedItems) => {
    setCheckedItems({
      ...checkedItems,
      [item]: !checkedItems[item],
    })
  }

  // Check if all items are checked or at least one is checked
  const allChecked = Object.values(checkedItems).every(Boolean)
  const anyChecked = Object.values(checkedItems).some(Boolean)

  return (
    <div className="min-h-screen bg-teal-950 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900 p-3 flex justify-between items-center border-b-2 border-yellow-500 shadow-md relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-500"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-500"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-yellow-500"></div>

        <div className="flex items-center gap-2">
          <Link href="/closet/14">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <div className="flex items-center">
            <span className="text-lg sm:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] px-2">
              モノの住所を決める - 戦闘フェーズ
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
          <Link href="/home">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center p-4 overflow-auto">
        <div className="max-w-4xl w-full">
          {/* Checklist */}
          <div className="bg-gradient-to-b from-purple-900 to-teal-900 rounded-lg p-6 border-2 border-yellow-500 shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
              チェックリスト
            </h2>

            <div className="bg-purple-900/50 p-6 rounded-lg border border-teal-400 mb-6">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="madeLabels"
                    checked={checkedItems.madeLabels}
                    onChange={() => handleCheckboxChange("madeLabels")}
                    className="mt-1 h-5 w-5 accent-yellow-400"
                  />
                  <div>
                    <label htmlFor="madeLabels" className="text-xl font-medium text-white cursor-pointer">
                      ラベルを作った
                    </label>
                    <p className="text-teal-300 mt-1">
                      （小さいお子さんがいる場合は、絵や色のシールにしたらわかりやすいよ）
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="attachedLabels"
                    checked={checkedItems.attachedLabels}
                    onChange={() => handleCheckboxChange("attachedLabels")}
                    className="h-5 w-5 accent-yellow-400"
                  />
                  <label htmlFor="attachedLabels" className="text-xl font-medium text-white cursor-pointer">
                    ラベルを貼った
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="sharedWithFamily"
                    checked={checkedItems.sharedWithFamily}
                    onChange={() => handleCheckboxChange("sharedWithFamily")}
                    className="h-5 w-5 accent-yellow-400"
                  />
                  <label htmlFor="sharedWithFamily" className="text-xl font-medium text-white cursor-pointer">
                    家族がいる人は家族にもものの住所を共有した
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-b from-purple-900 to-teal-900 rounded-lg p-6 border-2 border-yellow-500 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-yellow-300 mb-4 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
              ラベリングのコツ
            </h2>

            <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg mb-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 text-teal-300">写真や色分けを活用する</h3>
                <ul className="list-disc pl-5 space-y-2 text-white">
                  <li>ラベルは文字だけでなく、写真を使うと中身が一目でわかりやすくなります。</li>
                  <li>文字が読めない子ども向けには、色違いの収納箱を使って区別する方法も有効です。</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 text-teal-300">ラベルの配置</h3>
                <ul className="list-disc pl-5 space-y-2 text-white">
                  <li>ラベルは見やすい位置に貼りましょう。</li>
                  <li>引き出しの前面や収納ボックスの側面など、取り出す際に見える場所がおすすめです。</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 text-teal-300">ラベルの更新</h3>
                <ul className="list-disc pl-5 space-y-2 text-white">
                  <li>収納内容が変わったら、ラベルも更新しましょう。</li>
                  <li>簡単に付け替えられるマグネットタイプやカードポケットタイプのラベルが便利です。</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Complete button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleComplete}
              disabled={!anyChecked}
              className={`bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-2 px-6 ${!anyChecked ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              ラベル貼り完了！！
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

