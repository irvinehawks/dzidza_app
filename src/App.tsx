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
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Translate</h3>

      <form onSubmit={handleTranslate}>
        <div className="flex items-center justify-between mb-2">
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
            className="bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
              <p className="text-gray-800">{translatedText}</p>

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
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-blue-50 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingElement icon={<Globe className="text-blue-400" size={40} />} x={20} y={15} duration={8} />
        <FloatingElement icon={<BookOpen className="text-purple-400" size={30} />} x={-15} y={-20} duration={10} />
        <FloatingElement icon={<MessageCircle className="text-green-400" size={35} />} x={-25} y={25} duration={12} />
        <FloatingElement icon={<Sparkles className="text-amber-400" size={25} />} x={30} y={-10} duration={7} />

        {/* Language bubbles */}
        <LanguageBubble text="Shona" x={75} y={20} color="bg-pink-100" />
        <LanguageBubble text="Ndebele" x={85} y={60} color="bg-blue-100" />
        <LanguageBubble text="English" x={10} y={70} color="bg-green-100" />
        <LanguageBubble text="Tonga" x={70} y={85} color="bg-purple-100" />
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 p-2 rounded-full"
                >
                  <Languages size={28} className="text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                  Dzidza
                </h1>
              </div>
              <p className="mt-2 text-sm text-gray-600 ml-12">Language Learning Platform for Zimbabwe</p>
            </motion.div>

            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex gap-6"
            >
              {["Learn", "Translate", "Resources", "Community"].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-600 hover:text-violet-600 font-medium"
                >
                  {item}
                </motion.a>
              ))}
            </motion.nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-violet-100"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col justify-center">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-2xl md:text-3xl font-bold text-gray-800"
                >
                  Discover the Beauty of
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 ml-2">
                    Learning Languages
                  </span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="mt-4 text-gray-600"
                >
                  Translate between languages, learn new words, and connect with Zimbabwe's and the Global rich linguistic heritages.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="mt-6 flex gap-4"
                >
                  <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
                    Start Learning
                  </button>
                  <button className="px-6 py-3 border border-violet-200 text-violet-600 font-medium rounded-lg hover:bg-violet-50 transition-all">
                    Explore Resources
                  </button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-xl shadow-md p-5 border border-violet-100"
              >
                <TranslationForm />
              </motion.div>
            </div>
          </motion.div>

          {/* Features section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Globe className="text-violet-500" size={24} />,
                title: "Language Translation",
                desc: "Translate between Shona, Ndebele, English and more",
              },
              {
                icon: <BookOpen className="text-indigo-500" size={24} />,
                title: "Learning Resources",
                desc: "Access educational materials for all skill levels",
              },
              {
                icon: <MessageCircle className="text-purple-500" size={24} />,
                title: "Community Practice",
                desc: "Connect with others to practice your language skills",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-violet-100"
              >
                <div className="bg-violet-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">About Us</h4>
              <p className="text-sm text-gray-600">
                Dzidza language is a language learning platform dedicated to helping Zimbabweans and others learn and translate between different languages, with a special focus on local languages.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Contact</h4>
              <p className="text-sm text-gray-600">
                Email: irvenehawks@gmail.com<br />
                Phone: +263 737543231<br />
                Address: Suite 21 9th St, Bulawayo, Zimbabwe
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Reference Materials</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-600">Language Learning Guide</a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">Translation API Documentation</a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">Community Guidelines</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Dzidza. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App;
