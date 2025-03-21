"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, FastForward, KeyRound, Mail, User } from "lucide-react";
import { markOnboardingComplete } from "@/lib/auth";

// 静的コンテンツ用：クライアントで実行されない場合に表示するベースコンポーネント
const StaticPrologueBase = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-teal-950">
    <div className="max-w-md w-full bg-opacity-90 p-6 sm:p-8 rounded-xl shadow-lg border-2 border-teal-700 z-10 relative">
      <div className="text-center space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-yellow-300 tracking-tight drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]">
          乱れしクローゼット王国
        </h1>
        <p className="text-white text-sm sm:text-base">物語を始めるには以下のボタンをクリックしてください</p>
        <div className="w-full sm:w-auto bg-teal-800 text-yellow-300 font-medium py-2 px-4 rounded-lg border border-teal-600">
          物語を始める
        </div>
        <p className="text-xs text-teal-300 mt-4">※以降、効果音が鳴ります（音楽：魔王魂）</p>
      </div>
    </div>
  </div>
);

// 動的コンテンツ用：クライアントサイドでのみ実行されるプロローグコンポーネント
const DynamicPrologue = () => {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [prevStage, setPrevStage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [stageProgress, setStageProgress] = useState(0); // 0～100 の進捗
  const [autoAdvance, setAutoAdvance] = useState(true);

  // Story text for each stage
  const storyTexts = [
    "",
    "かつて、クローゼット王国は調和と美しさに満ちた世界でした。\nすべての衣装や小物は、まるで魔法のようにその居場所を知り、王国は輝いていたのです。",
    "しかし、ある日、突如として現れた『混沌の呪い』が王国に暗い影を落としました。\n棚は乱れ、衣装は迷宮のごとく入り組み、かつての秩序は音を立てて崩れ去っていったのです。",
    "勇者よ、あなたにのみ託された使命がある。\n散らかり果てた王国に再び秩序をもたらし、失われた美しさを取り戻すのです。\n『片方見つからないソックスライム』、そして『リバウンドラゴン』…彼らを打ち倒し、再び平和と輝きに満ちたクローゼットを取り戻すのです！",
    "冒険の始まり：\n\nここからあなたは、自らの『職業』を選び、断捨離の剣士、空間デザインの魔法使い、または時短の錬金術師として、各エリアに潜む混沌を一掃するための旅に出ます。\n初めは小さなクエストから始まり、ひとつひとつの達成があなたを強くします。\nそしてクローゼット王国が再び輝きを取り戻すその時、あなたは偉大な王となるのです。\n\nさぁ、選ばれし勇者よ、行ってらっしゃい！",
    "",
  ];

  // Particle sets for background effects for each stage
  const stageParticles = {
    1: ["✨", "❤️", "💫", "💕", "🌟"],
    2: ["💀", "🍂", "🌑", "⚡", "🕸️"],
    3: ["🧦", "👕", "👗", "🧣", "🧤"],
    4: ["🗡️", "🔮", "⏱️", "🛡️", "📜"],
    5: ["✨", "🎉", "🎊", "🏆", "👑"],
  };

  // Split text into paragraphs
  const splitTextIntoParagraphs = (text: string) => text.split("\n").filter((p) => p.trim() !== "");

  // Background colors for each stage
  const bgColors = [
    "bg-teal-950", // Initial
    "bg-gradient-to-br from-orange-400 to-red-500", // Stage 1
    "bg-gray-800", // Stage 2
    "bg-teal-900", // Stage 3
    "bg-teal-800", // Stage 4
    "bg-teal-700", // Final
  ];

  // Smooth stage transitions
  useEffect(() => {
    if (stage !== prevStage) {
      setIsTransitioning(true);
      const transitionTimer = setTimeout(() => {
        setPrevStage(stage);
        setIsTransitioning(false);
      }, 1000);
      return () => clearTimeout(transitionTimer);
    }
  }, [stage, prevStage]);

  const clearAllTimers = () => {
    if (stageTimerRef.current) {
      clearTimeout(stageTimerRef.current);
      stageTimerRef.current = null;
    }
  };

  // Handle stage transitions and progress
  useEffect(() => {
    clearAllTimers();
    if (stage === 4) {
      setAutoAdvance(false);
    } else {
      setAutoAdvance(true);
    }
    if (stage > 0 && stage < 6) {
      setStageProgress(0);
      const progressInterval = setInterval(() => {
        setStageProgress((prev) => {
          if (prev < 100) return prev + 1;
          else {
            clearInterval(progressInterval);
            return 100;
          }
        });
      }, 80);
      if (autoAdvance && stage < 4) {
        stageTimerRef.current = setTimeout(() => {
          clearInterval(progressInterval);
          if (stage < 5) setStage(stage + 1);
        }, 8000);
      }
      return () => clearInterval(progressInterval);
    }
    return () => clearAllTimers();
  }, [stage, autoAdvance]);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/prologue.mp3");
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle audio play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch((e) => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) audioRef.current.muted = !isMuted;
  };

  const skipAnimation = () => {
    clearAllTimers();
    setStage(5);
  };

  const startPrologue = () => {
    setIsPlaying(true);
    setStage(1);
  };

  // Stage 4の完了後にプロローグ完了をマークし、次のページに遷移する関数
  const continueToCharacterCreation = async () => {
    try {
      await markOnboardingComplete();
      router.push("/home");
    } catch (error) {
      console.error("Onboardingマーク更新エラー:", error);
    }
  };

  const currentParagraphs = stage > 0 && stage < 5 ? splitTextIntoParagraphs(storyTexts[stage]) : [];

  const renderParticles = (forStage: number) => {
    if (forStage === 0 || !stageParticles[forStage as keyof typeof stageParticles]) return null;
    const particles = stageParticles[forStage as keyof typeof stageParticles];
    return Array.from({ length: 20 }).map((_, i) => {
      const particle = particles[Math.floor(Math.random() * particles.length)];
      const size = Math.random() * 20 + 10;
      const opacity = Math.random() * 0.3 + 0.1;
      const duration = Math.random() * 5 + 3;
      const delay = Math.random() * 2;
      return (
        <div
          key={i}
          className="absolute animate-float-animation"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${size}px`,
            opacity: opacity,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        >
          {particle}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background layers */}
      <div className={`absolute inset-0 ${bgColors[prevStage]} transition-opacity duration-1000 ease-in-out z-0`} style={{ opacity: isTransitioning ? 0 : 1 }} />
      <div className={`absolute inset-0 ${bgColors[stage]} transition-opacity duration-1000 ease-in-out z-0`} style={{ opacity: isTransitioning ? 1 : 0 }} />

      {prevStage > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-1" style={{ opacity: isTransitioning ? 0 : 1, transition: "opacity 1000ms ease-in-out" }}>
          {renderParticles(prevStage)}
        </div>
      )}
      {stage > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-1" style={{ opacity: isTransitioning ? 1 : 0, transition: "opacity 1000ms ease-in-out" }}>
          {renderParticles(stage)}
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10">
        {/* Progress bar for stages 1-4 */}
        {stage > 0 && stage < 5 && (
          <div className="fixed top-4 left-4 w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-300 transition-all duration-300 ease-linear" style={{ width: `${stageProgress}%` }}></div>
          </div>
        )}

        {/* Audio controls */}
        {stage > 0 && (
          <div className="fixed top-4 right-4 flex gap-2 z-20">
            <Button variant="outline" size="icon" className="bg-teal-800 border-teal-600 text-white hover:bg-teal-700" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Button variant="outline" size="icon" className="bg-teal-800 border-teal-600 text-white hover:bg-teal-700" onClick={skipAnimation}>
              <FastForward className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Content container */}
        <div className="max-w-md w-full bg-opacity-90 p-6 sm:p-8 rounded-xl shadow-lg border-2 border-teal-700 z-10 relative bg-black bg-opacity-50">
          {stage === 0 && (
            <div className="text-center space-y-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-yellow-300 tracking-tight drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]">
                クローゼット王国
              </h1>
              <p className="text-white text-sm sm:text-base">ボタンを押して物語を始めよう</p>
              <Button className="w-full sm:w-auto bg-teal-800 hover:bg-teal-700 text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] font-medium py-2 px-4 rounded-lg border border-teal-600" onClick={startPrologue}>
                物語を始める
              </Button>
              <p className="text-s text-teal-300 mt-4">※以降、効果音が鳴ります（音楽：魔王魂）</p>
            </div>
          )}

          {stage > 0 && stage < 5 && (
            <div className="text-center space-y-4">
              {stage === 1 && (
                <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)] mb-6 animate-magical-appear">
                  乱れしクローゼット王国
                </h2>
              )}
              {stage === 3 && (
                <>
                  <div className="flex justify-center mb-4 animate-magical-appear">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                      <Image src="/cow-fairy.webp" alt="片付けの妖精モーちゃん" fill className="object-contain" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-yellow-200 mb-2 animate-magical-appear">
                    片付けの妖精モーちゃん
                  </h3>
                </>
              )}
              <div className="bg-black bg-opacity-50 p-4 rounded-lg">
                <div className="text-white text-sm sm:text-base whitespace-pre-line text-left space-y-2">
                  {currentParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              {stage === 4 && stageProgress === 100 && (
                <div className="mt-6 animate-magical-appear" style={{ animationDelay: "2s" }}>
                  <Button
                    className="w-full sm:w-auto bg-teal-800 hover:bg-teal-700 text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] font-medium py-2 px-4 rounded-lg border border-teal-600"
                    onClick={continueToCharacterCreation}
                  >
                    次へ
                  </Button>
                </div>
              )}
            </div>
          )}

          {stage === 5 && (
            <div className="text-center space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)] animate-magical-appear">
                さぁ、冒険を始めよう！
              </h2>
              <Button
                onClick={async () => {
                  try {
                    await markOnboardingComplete();
                    router.push("/home");
                  } catch (error) {
                    console.error("Onboardingマーク更新エラー:", error);
                  }
                }}
                className="w-full sm:w-auto bg-teal-800 hover:bg-teal-900 text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] font-medium py-2 px-4 rounded-lg border border-teal-600 transition-colors duration-200"
              >
                冒険の準備を始める
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main component: サーバー側では静的ベースを、クライアント側では動的プロローグを表示
export default function ProloguePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <DynamicPrologue /> : <StaticPrologueBase />;
}
