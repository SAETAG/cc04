"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Volume2, VolumeX, ArrowLeft, Home, Trash2 } from "lucide-react"

export default function Stage6BattlePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [fateItems, setFateItems] = useState(Array(5).fill(false))
  const [isSaving, setIsSaving] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const router = useRouter()

  // Initialize audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Create audio element
        const audio = new Audio()

        // Set up event listeners
        audio.addEventListener("canplaythrough", () => {
          setAudioLoaded(true)
          if (!isMuted) {
            audio.play().catch((e) => {
              console.log("Audio play was prevented: ", e)
              // This is often due to browser autoplay policies
            })
          }
        })

        audio.addEventListener("error", (e) => {
          console.log("Audio loading error: ", e)
          setAudioLoaded(false)
        })

        // Set properties
        audio.src = "/stepfight_6.mp3"
        audio.loop = true
        audio.volume = 0.7 // Set to 70% volume
        audio.muted = isMuted

        // Store reference
        audioRef.current = audio

        // Clean up
        return () => {
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.src = ""
            audioRef.current = null
          }
        }
      } catch (error) {
        console.error("Audio initialization error:", error)
      }
    }
  }, [])

  // Toggle mute
  const toggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)

    if (audioRef.current) {
      audioRef.current.muted = newMutedState

      // If unmuting and audio is loaded but not playing, try to play
      if (!newMutedState && audioLoaded && audioRef.current.paused) {
        audioRef.current.play().catch((e) => {
          console.log("Audio play was prevented on unmute: ", e)
        })
      }
    }
  }

  // Toggle item fate
  const toggleFate = (index: number) => {
    const newFateItems = [...fateItems]
    newFateItems[index] = !newFateItems[index]
    setFateItems(newFateItems)
  }

  // Check if at least 2 items are selected
  const atLeastTwoSelected = fateItems.filter(Boolean).length >= 2

  // Save record to database and navigate to clear page
  const saveRecord = async () => {
    setIsSaving(true)

    try {
      // Simulate saving to database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would save the data to your database here
      console.log("Saving record:", {
        fateItems,
      })

      // Navigate to clear page
      router.push("/closet/6/clear")
    } catch (error) {
      console.error("Error saving record:", error)
      alert("保存中にエラーが発生しました。もう一度お試しください。")
    } finally {
      setIsSaving(false)
    }
  }

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
          <Link href="/closet/6">
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
              未練の洞窟 - 戦闘フェーズ
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
        <div className="max-w-2xl w-full bg-gradient-to-b from-purple-900 to-teal-900 rounded-lg p-6 border-2 border-yellow-500 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">「運命の箱」を再度見直す</h2>

          <p className="text-white mb-6 text-center">
            「運命の箱」に入れたアイテムを再度見直し、本当に持ち続ける価値があるか考えましょう。
            <br />
            捨てられるものは「虚無の箱」へ移しましょう。
            <br />
            少なくとも2つ以上のアイテムを「虚無の箱」へ移すことを目指しましょう。
          </p>

          {/* Fate items checklist */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">「運命の箱」の中身</h3>
            <p className="text-white mb-4">
              以下のアイテムを「虚無の箱」へ移すかどうか決断してください。チェックを入れたアイテムは「虚無の箱」へ移します。
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="fate1"
                  checked={fateItems[0]}
                  onCheckedChange={() => toggleFate(0)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-2 border-red-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="fate1" className="text-yellow-300 font-bold cursor-pointer">
                    思い出の服（卒業式で着た服）
                  </label>
                  <p className="text-white text-sm">
                    👉 思い出は写真に残っています。服自体を持っていなくても、思い出は心の中に残ります。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="fate2"
                  checked={fateItems[1]}
                  onCheckedChange={() => toggleFate(1)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-2 border-red-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="fate2" className="text-yellow-300 font-bold cursor-pointer">
                    高価だった服（一度も着ていない）
                  </label>
                  <p className="text-white text-sm">
                    👉 「もったいない」という気持ちは理解できますが、着ない服は「埋蔵金」ではなく「埋蔵コスト」です。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="fate3"
                  checked={fateItems[2]}
                  onCheckedChange={() => toggleFate(2)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-2 border-red-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="fate3" className="text-yellow-300 font-bold cursor-pointer">
                    痩せたら着たい服（サイズが小さい）
                  </label>
                  <p className="text-white text-sm">
                    👉 「痩せたら着る」という未来のために取っておくのではなく、今の自分に合った服を大切にしましょう。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="fate4"
                  checked={fateItems[3]}
                  onCheckedChange={() => toggleFate(3)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-2 border-red-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="fate4" className="text-yellow-300 font-bold cursor-pointer">
                    いつか直そうと思っている服（ボタンが取れた、ほつれがある）
                  </label>
                  <p className="text-white text-sm">
                    👉 「いつか直す」と思いながら何ヶ月も経っていませんか？修理する予定がないなら、手放す勇気を。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="fate5"
                  checked={fateItems[4]}
                  onCheckedChange={() => toggleFate(4)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:text-white border-2 border-red-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="fate5" className="text-yellow-300 font-bold cursor-pointer">
                    もらいものの服（着る機会がない）
                  </label>
                  <p className="text-white text-sm">
                    👉 大切な人からもらった服でも、着ないなら持っていても意味がありません。感謝の気持ちは心に留めて。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span className="text-white">選択したアイテム:</span>
              <span className={`font-bold ${atLeastTwoSelected ? "text-green-400" : "text-yellow-300"}`}>
                {fateItems.filter(Boolean).length} / 2 (最低目標)
              </span>
            </div>
            <div className="w-full bg-teal-950 rounded-full h-2.5 mt-2">
              <div
                className="bg-gradient-to-r from-red-500 to-yellow-500 h-2.5 rounded-full"
                style={{ width: `${(fateItems.filter(Boolean).length / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={saveRecord}
              disabled={isSaving || !atLeastTwoSelected}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                "保存中..."
              ) : (
                <>
                  <Trash2 className="h-5 w-5" />
                  決断完了！
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

