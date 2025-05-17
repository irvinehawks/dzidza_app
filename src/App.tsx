"use client"

//import type React from "react"
import { useState, useEffect, type ReactNode } from "react"
import { motion } from "framer-motion"
import { Globe, BookOpen, MessageCircle, Sparkles, Languages, ArrowRightLeft, Volume2, Copy, Check } from "lucide-react"
import huggingfaceService from './services/huggingfaceService'
import type { Language } from './types'

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'ru', name: 'Russian' },
  { code: 'es', name: 'Spanish' },
  // Zimbabwean languages (upcoming)
  { code: 'sn', name: 'Shona', isUpcoming: true },
  { code: 'nd', name: 'Ndebele', isUpcoming: true },
  { code: 'to', name: 'Tonga', isUpcoming: true },
  { code: 've', name: 'Venda', isUpcoming: true },
  { code: 'ts', name: 'Tsonga', isUpcoming: true },
  { code: 'ch', name: 'Chewa', isUpcoming: true },
]


// LanguageBubble Component
function LanguageBubble({ text, x, y, color }: { text: string; x: number; y: number; color: string }) {
  // Calculate a random delay for more natural movement
  const delay = Math.random() * 2

  return (
    <motion.div
      className={`absolute ${color} px-3 py-1 rounded-full text-xs font-medium shadow-sm`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: [0.8, 1, 0.8],
        opacity: [0.7, 1, 0.7],
        y: [0, -10, 0],
      }}
      transition={{
        duration: 5 + Math.random() * 2,
        repeat: Number.POSITIVE_INFINITY,
        delay,
      }}
    >
      {text}
    </motion.div>
  )
}

// FloatingElement Component
function FloatingElement({ icon, x, y, duration = 10 }: { icon: ReactNode; x: number; y: number; duration?: number }) {
  // Random starting position within the viewport
  const startX = Math.random() * 100
  const startY = Math.random() * 100

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
      }}
      animate={{
        x: [`${x}px`, `${-x}px`, `${x}px`],
        y: [`${y}px`, `${-y}px`, `${y}px`],
      }}
      transition={{
        x: {
          duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        },
        y: {
          duration: duration * 1.2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      }}
    >
      {icon}
    </motion.div>
  )
}

// TranslationForm Component
function TranslationForm() {
  const [sourceText, setSourceText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("de")
  const [translatedText, setTranslatedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const result = await huggingfaceService.translate({
        text: sourceText,
        sourceLanguage,
        targetLanguage,
      })
      setTranslatedText(result.translatedText)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto px-4 sm:px-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Translate</h3>

      <form onSubmit={handleTranslate}>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2 mb-4">
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} disabled={lang.isUpcoming}>
                {lang.name} {lang.isUpcoming ? "(Coming Soon)" : ""}
              </option>
            ))}
          </select>

          <motion.button
            type="button"
            onClick={swapLanguages}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-violet-100 text-violet-600 hover:bg-violet-200 transition-colors"
          >
            <ArrowRightLeft size={18} />
          </motion.button>

          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} disabled={lang.isUpcoming}>
                {lang.name} {lang.isUpcoming ? "(Coming Soon)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
            />
          </div>

          <motion.button
            onClick={handleTranslate}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            {isLoading ? "Translating..." : "Translate"}
          </motion.button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600"
            >
              {error}
            </motion.div>
          )}

          {translatedText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg relative"
            >
              <p className="text-gray-800 break-words">{translatedText}</p>

              <div className="absolute right-2 bottom-2 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Volume2 size={16} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyToClipboard}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </form>
    </div>
  )
}

// Main App Component
function App() {
  const [mounted, setMounted] = useState(false)
  {/*const [sourceText, setSourceText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("de")
  const [translatedText, setTranslatedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)*/}

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-violet-50 overflow-x-hidden">
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Floating elements with responsive positioning */}
        <div className="hidden sm:block">
          <FloatingElement icon={<Globe className="text-violet-400" size={24} />} x={50} y={30} />
          <FloatingElement icon={<BookOpen className="text-indigo-400" size={24} />} x={30} y={50} />
          <FloatingElement icon={<MessageCircle className="text-purple-400" size={24} />} x={40} y={40} />
          <FloatingElement icon={<Sparkles className="text-pink-400" size={24} />} x={60} y={20} />
        </div>

        {/* Language bubbles with responsive positioning */}
        <div className="hidden sm:block">
          <LanguageBubble text="English" x={10} y={20} color="bg-blue-100 text-blue-600" />
          <LanguageBubble text="Deutsch" x={80} y={30} color="bg-green-100 text-green-600" />
          <LanguageBubble text="Español" x={20} y={60} color="bg-yellow-100 text-yellow-600" />
          <LanguageBubble text="Русский" x={70} y={70} color="bg-red-100 text-red-600" />
        </div>

        <main className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Language Translation
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Translate text between multiple languages with ease. Powered by advanced AI technology.
            </p>
          </div>

          <TranslationForm />
        </main>
      </div>
    </div>
  )
}

export default App;
