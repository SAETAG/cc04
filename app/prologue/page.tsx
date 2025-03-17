"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, FastForward } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProloguePage() {
  const [stage, setStage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Story text for each stage
  const storyTexts = [
    "",
    "かつて、クローゼット王国は調和と美しさに満ちた世界でした。\nすべての衣装や小物は、まるで魔法のようにその居場所を知り、王国は輝いていたのです。",
    "しかし、ある日、突如として現れた『混沌の呪い』が王国に暗い影を落としました。\n棚は乱れ、衣装は迷宮のごとく入り組み、かつての秩序は音を立てて崩れ去っていったのです。",
    "勇者よ、あなたにのみ託された使命がある。\n散らかり果てた王国に再び秩序をもたらし、失われた美しさを取り戻すのです。\n『片方見つからないソックスライム』、そして『リバウンドラゴン』…彼らを打ち倒し、再び平和と輝きに満ちたクローゼットを取り戻すのです！",
    "冒険の始まり：\n\nここからあなたは、自らの『職業』を選び、断捨離の剣士、空間デザインの魔法使い、または時短の錬金術師として、各エリアに潜む混沌を一掃するための旅に出ます。\n初めは小さなクエストから始まり、ひとつひとつの達成があなたを強くします。\nそしてクローゼット王国が再び輝きを取り戻すまさにその時、あなたは国を統治する偉大な王になるのです。\n\nさぁ選ばれし勇者よ、行ってらっしゃい！",
    "",
  ]

  // Background colors for each stage
  const bgColors = [
    "bg-teal-950", // Initial
    "bg-gradient-to-br from-orange-400 to-red-500", // Stage 1
    "bg-gray-800", // Stage 2
    "bg-teal-900", // Stage 3
    "bg-teal-800", // Stage 4
    "bg-teal-700", // Final
  ]

  // Typewriter effect
  useEffect(() => {
    if (stage > 0 && stage < 5) {
      setIsTyping(true)
      setTypedText("")

      const text = storyTexts[stage]
      let index = 0

      // Start with an empty string
      setTypedText("")

      const typingInterval = setInterval(() => {
        if (index < text.length) {
          setTypedText((current) => current + text.charAt(index))
          index++
        } else {
          clearInterval(typingInterval)
          setIsTyping(false)

          // Auto advance to next stage after text is fully typed and a delay
          const timer = setTimeout(() => {
            if (stage < 5) {
              setStage(stage + 1)
            }
          }, 3000)

          return () => clearTimeout(timer)
        }
      }, 100)

      return () => clearInterval(typingInterval)
    }
  }, [stage])

  // Initialize audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/prologue.mp3")
      audioRef.current.loop = true

      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
      }
    }
  }, [])

  // Handle audio play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch((e) => console.error("Audio play failed:", e))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, isMuted])

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  // Skip animation
  const skipAnimation = () => {
    setStage(5)
    setIsTyping(false)
  }

  // Start the prologue
  const startPrologue = () => {
    setIsPlaying(true)
    setStage(1)
  }

  // Debug function to check the text content
  const debugText = (stage: number) => {
    if (stage > 0 && stage < 5) {
      console.log(`Stage ${stage} text starts with: ${storyTexts[stage].substring(0, 10)}`)
    }
  }

  // Call debug function when stage changes
  useEffect(() => {
    debugText(stage)
  }, [stage])

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-1000 ${bgColors[stage]}`}
    >
      {/* Audio controls */}
      {stage > 0 && (
        <div className="fixed top-4 right-4 flex gap-2 z-20">
          <Button
            variant="outline"
            size="icon"
            className="bg-teal-800 border-teal-600 text-white hover:bg-teal-700"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="bg-teal-800 border-teal-600 text-white hover:bg-teal-700"
            onClick={skipAnimation}
          >
            <FastForward className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Content container */}
      <div className="max-w-md w-full bg-opacity-90 p-6 sm:p-8 rounded-xl shadow-lg border-2 border-teal-700 z-10 relative">
        {/* Stage 0: Initial screen */}
        {stage === 0 && (
          <div className="text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-yellow-300 tracking-tight drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]">
              乱れしクローゼット王国
            </h1>
            <p className="text-white text-sm sm:text-base">物語を始めるには以下のボタンをクリックしてください</p>
            <Button
              className="w-full sm:w-auto bg-teal-800 hover:bg-teal-700 text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] font-medium py-2 px-4 rounded-lg border border-teal-600"
              onClick={startPrologue}
            >
              物語を始める
            </Button>
            <p className="text-xs text-teal-300 mt-4">※以降、効果音が鳴ります（音楽：魔王魂）</p>
          </div>
        )}

        {/* Stage 1-4: Story narration */}
        {stage > 0 && stage < 5 && (
          <div className="text-center space-y-4">
            {stage === 1 && (
              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)] mb-6">
                乱れしクローゼット王国
              </h2>
            )}

            {stage === 3 && (
              <div className="flex justify-center mb-4">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                  <Image src="/cow-fairy.webp" alt="片付けの妖精モーちゃん" fill className="object-contain" />
                </div>
              </div>
            )}

            {stage === 3 && <h3 className="text-xl font-bold text-yellow-200 mb-2">片付けの妖精モーちゃん</h3>}

            <div className="bg-black bg-opacity-50 p-4 rounded-lg">
              <p className="text-white text-sm sm:text-base whitespace-pre-line text-left">{typedText}</p>
            </div>
          </div>
        )}

        {/* Stage 5: Final screen */}
        {stage === 5 && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]">
              さぁ、冒険を始めよう！
            </h2>
            <Link href="/charasetting" className="block">
              <Button className="w-full sm:w-auto bg-teal-800 hover:bg-teal-900 text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] font-medium py-2 px-4 rounded-lg border border-teal-600 transition-colors duration-200">
                冒険の準備を始める
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

