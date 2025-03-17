"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Home, Zap, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"

export default function Endroll() {
  const router = useRouter()
  const [phase, setPhase] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; speed: number; angle: number; color: string }[]
  >([])
  const [lightnings, setLightnings] = useState<
    { id: number; x: number; y: number; size: number; rotation: number; opacity: number }[]
  >([])
  const [bossOpacity, setBossOpacity] = useState(1)
  const [showMessage, setShowMessage] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [showCredits, setShowCredits] = useState(false)
  const [audioPlayed, setAudioPlayed] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const typewriterRef = useRef<NodeJS.Timeout | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)

  const messages = [
    "勇者よ、いえ、クローゼット王国の王よ。",
    "長い戦いの中で、あなたはとても成長した。",
    "もうあなたにはわかるはずだ。",
    "モノは、あなたを困らせるものであってはいけない。",
    "モノは、あなたを幸せに導くものだ。",
    "そしてそれを統治するのは、あなた自身なのだ。",
    "あなたはもう大丈夫だ。",
    "またどこかで、会おう！",
  ]

  const credits = [
    "・・・時は満ちた。",
    "今や勇者により、クローゼット王国は以前の秩序を輝きを取り戻した。",
    "",
    "あなたは、変わった。",
    "もうどんな王国の危機も、あなたならきっと乗り越えられる。",
    "",
    "FIN",
  ]

  useEffect(() => {
    // Play endroll music
    audioRef.current = new Audio("/endroll.mp3")
    audioRef.current.volume = volume
    audioRef.current.loop = true // BGMをループ再生

    // ユーザーインタラクション後に再生を試みる
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setAudioPlayed(true)
            console.log("Audio playing successfully")
          })
          .catch((error) => {
            console.error("Audio playback failed:", error)
          })
      }
    }

    playAudio()

    // iOS Safariなどでの自動再生制限対策
    document.addEventListener("click", playAudio, { once: true })

    // Start the sequence
    const timer = setTimeout(() => {
      startShaking()
    }, 2000)

    return () => {
      document.removeEventListener("click", playAudio)
      clearTimeout(timer)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current)
        typewriterRef.current = null
      }
    }
  }, [])

  // Effect to handle typewriter animation
  useEffect(() => {
    if (!showMessage) return

    // Clear any existing timeout
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current)
    }

    if (messageIndex >= messages.length) {
      // All messages have been displayed, move to credits after a delay
      const timer = setTimeout(() => {
        setShowMessage(false)
        setTimeout(() => {
          setShowCredits(true)
        }, 1000)
      }, 3000)

      return () => clearTimeout(timer)
    }

    // Get current message
    const currentMessage = messages[messageIndex]

    if (currentCharIndex < currentMessage.length) {
      // Still typing the current message - slower typing (150ms instead of 50ms)
      typewriterRef.current = setTimeout(() => {
        setTypedText((prev) => prev + currentMessage.charAt(currentCharIndex))
        setCurrentCharIndex((prev) => prev + 1)
      }, 150)
    } else {
      // Current message is complete, prepare for next message
      typewriterRef.current = setTimeout(() => {
        setMessageIndex((prev) => prev + 1)
        setTypedText("")
        setCurrentCharIndex(0)
      }, 2500)
    }

    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current)
      }
    }
  }, [showMessage, messageIndex, currentCharIndex, messages])

  const startShaking = () => {
    setShaking(true)
    setPhase(1)

    // Generate initial lightnings
    generateLightnings(5)

    // After shaking, explode
    setTimeout(() => {
      setShaking(false)
      explodeBoss()
    }, 3000)
  }

  const generateLightnings = (count: number) => {
    const newLightnings = []
    for (let i = 0; i < count; i++) {
      newLightnings.push({
        id: Date.now() + i,
        x: Math.random() * 80 + 10, // 10% to 90% of screen width
        y: Math.random() * 60 + 10, // 10% to 70% of screen height
        size: 24 + Math.random() * 24, // 24px to 48px
        rotation: Math.random() * 360, // Random rotation
        opacity: 0.7 + Math.random() * 0.3, // 0.7 to 1.0 opacity
      })
    }
    setLightnings((prev) => [...prev, ...newLightnings])
  }

  const generateParticles = (count: number) => {
    const newParticles = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: 50 + Math.random() * 20 - 10, // Center-ish with some variation
        y: 40 + Math.random() * 20 - 10,
        size: 2 + Math.random() * 5,
        speed: 0.5 + Math.random() * 2,
        angle: Math.random() * Math.PI * 2,
        color: ["#ffffff", "#ffcc00", "#ff9900"][Math.floor(Math.random() * 3)],
      })
    }
    setParticles((prev) => [...prev, ...newParticles])
  }

  const explodeBoss = () => {
    setPhase(2)
    generateParticles(30)
    generateLightnings(10)

    // Fade out boss
    const fadeInterval = setInterval(() => {
      setBossOpacity((prev) => {
        if (prev <= 0.1) {
          clearInterval(fadeInterval)
          setTimeout(() => {
            setPhase(3)
            showMooMessages()
          }, 1000)
          return 0
        }
        return prev - 0.1
      })
    }, 100)
  }

  const showMooMessages = () => {
    setShowMessage(true)
    // The useEffect will handle the typewriter animation
  }

  const handleBackToHome = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    router.push("/home")
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
      } else {
        audioRef.current.volume = 0
      }
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      {phase < 3 && (
        <div
          className={`relative ${shaking ? "animate-shake" : ""}`}
          style={{
            width: "300px",
            height: "300px",
            opacity: bossOpacity,
          }}
        >
          {/* Lightning icons */}
          {lightnings.map((lightning) => (
            <div
              key={lightning.id}
              className="absolute"
              style={{
                left: `${lightning.x}%`,
                top: `${lightning.y}%`,
                transform: `rotate(${lightning.rotation}deg)`,
                opacity: lightning.opacity,
                transition: phase === 2 ? "all 1s ease-out" : "none",
              }}
            >
              <Zap size={lightning.size} className="text-yellow-400 animate-pulse" strokeWidth={3} />
            </div>
          ))}

          {/* Particles/cracks */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute bg-yellow-300"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                transform:
                  phase === 2
                    ? `translate(${Math.cos(particle.angle) * particle.speed * 50}px, ${Math.sin(particle.angle) * particle.speed * 50}px)`
                    : "none",
                opacity: phase === 2 ? 0 : 1,
                transition: phase === 2 ? "all 1s ease-out" : "none",
                backgroundColor: particle.color,
              }}
            />
          ))}
        </div>
      )}

      {phase === 2 && (
        <div className="absolute text-6xl font-bold text-yellow-400 animate-bounce">ドォォォォォン！！！</div>
      )}

      {phase === 3 && showMessage && (
        <div className="max-w-2xl text-center">
          <div className="mb-8">
            <div className="relative w-32 h-32 mx-auto">
              <Image src="/cow-fairy.webp" alt="モーちゃん" fill className="object-contain" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">モーちゃん</h2>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <p className="text-xl leading-relaxed min-h-[200px] flex items-center justify-center">
              <span className="block typewriter-text">{typedText}</span>
            </p>
          </div>
        </div>
      )}

      {showCredits && (
        <div className="max-w-2xl text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-6 text-yellow-400">Closet Chronicle</h1>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            {credits.map((line, idx) => (
              <p
                key={idx}
                className={`text-xl mb-4 ${idx === credits.length - 1 ? "text-[10rem] font-bold text-yellow-400 mt-8 leading-none" : ""}`}
              >
                {line}
              </p>
            ))}
          </div>

          <button
            onClick={handleBackToHome}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg flex items-center justify-center mx-auto"
          >
            <Home className="mr-2" size={20} />
            ホームに戻る
          </button>
        </div>
      )}

      {/* 音量コントロール */}
      <div className="fixed bottom-4 right-4 bg-gray-800 rounded-full p-2 shadow-lg z-50">
        <button
          onClick={toggleMute}
          className="text-white hover:text-yellow-400 transition-colors"
          aria-label={isMuted ? "ミュート解除" : "ミュート"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s infinite;
        }
        .typewriter-text {
          border-right: 2px solid white;
          animation: blink 0.75s step-end infinite;
        }
        @keyframes blink {
          from, to { border-color: transparent }
          50% { border-color: white; }
        }
      `}</style>
    </div>
  )
}

