"use client"

import { useState, useEffect } from "react"
import { questions } from "@/data/questions"
import { Question, UserAnswer } from "@/types/quiz"
import { calculateIQ } from "@/utils/iq-calculator"
import { generateQuizSession } from "@/utils/quiz-engine"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import VisualQuestion from "@/components/VisualQuestion"
import { playClickSound } from "@/utils/sounds"
import { Clock, Brain, Trophy, ShieldCheck, ArrowRight, Zap, RefreshCcw, Loader2, CheckCircle2 } from "lucide-react"

// Setări constante
const TOTAL_TIME_SECONDS = 30 * 60 
const QUIZ_QUESTION_COUNT = 20 
const STORAGE_KEY = "cognitest_session_v1"

export default function HomePage() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [dailyQuestions, setDailyQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [remainingTime, setRemainingTime] = useState(TOTAL_TIME_SECONDS)
  const [timeExpired, setTimeExpired] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // --- STĂRI NOI PENTRU ANIMAȚIA DE FINAL ---
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculationStep, setCalculationStep] = useState(0)

  // 1. ÎNCĂRCAREA SESIUNII
  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY)
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession)
        if (parsed.quizStarted && !parsed.isFinished && !parsed.isCalculating) {
          setDailyQuestions(parsed.dailyQuestions)
          setCurrentQuestionIndex(parsed.currentQuestionIndex)
          setUserAnswers(parsed.userAnswers)
          setRemainingTime(parsed.remainingTime)
          setQuizStarted(true)
        }
      } catch (e) {
        console.error("Eroare la încărcarea sesiunii:", e)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoaded(true)
  }, [])

  // 2. SALVAREA AUTOMATĂ
  useEffect(() => {
    if (!isLoaded || !quizStarted || isCalculating) return

    const sessionData = {
      quizStarted,
      dailyQuestions,
      currentQuestionIndex,
      userAnswers,
      remainingTime,
      isFinished: false,
      lastUpdated: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData))
  }, [quizStarted, dailyQuestions, currentQuestionIndex, userAnswers, remainingTime, isLoaded, isCalculating])

  // 3. TIMER
  useEffect(() => {
    if (!quizStarted || timeExpired || isCalculating) return
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          setTimeExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [quizStarted, timeExpired, isCalculating])

  // 4. Expirare automata
  useEffect(() => {
    if (timeExpired && userAnswers.length > 0 && !isCalculating) {
      finishQuiz(userAnswers, true)
    }
  }, [timeExpired, userAnswers])

  // --- FUNCTIA DE FINAL (MODIFICATĂ PENTRU HOOK) ---
  const finishQuiz = (finalAnswers: UserAnswer[], isTimeExpired: boolean) => {
    // 1. Oprim tot și intrăm în modul "Calculating"
    setIsCalculating(true)
    
    // 2. Calculăm rezultatul în spate
    const correctCount = finalAnswers.filter(a => a.isCorrect).length
    const iqResult = calculateIQ(correctCount, QUIZ_QUESTION_COUNT) 
    localStorage.setItem("iqScore", iqResult.toString())
    localStorage.removeItem(STORAGE_KEY) // Curățăm sesiunea

    // 3. Declansăm secvența de animație (4 secunde total)
    const steps = [
        { msg: "Se analizează tiparele cognitive...", duration: 1000 },
        { msg: "Se calculează viteza de procesare...", duration: 1500 },
        { msg: "Se compară cu datele demografice...", duration: 1500 },
        { msg: "Se generează raportul final...", duration: 1000 }
    ]

    let currentStep = 0;
    
    // Funcție recursivă pentru pași
    const runStep = () => {
        if (currentStep >= steps.length) {
            // GATA - Redirect
            window.location.href = "/pricing?score=" + iqResult;
            return;
        }
        setCalculationStep(currentStep);
        setTimeout(() => {
            currentStep++;
            runStep();
        }, steps[currentStep].duration);
    }

    runStep();
  }

  const startNewQuiz = () => {
    const generatedQuestions = generateQuizSession(questions, QUIZ_QUESTION_COUNT)
    setDailyQuestions(generatedQuestions)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setUserAnswers([])
    setRemainingTime(TOTAL_TIME_SECONDS)
    setTimeExpired(false)
    setQuizStarted(true)
    setIsCalculating(false)
    localStorage.removeItem("iqScore") 
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (timeExpired || isCalculating) return
    playClickSound()
    setSelectedAnswer(answerIndex)
  }

  const handleNext = () => {
    if (selectedAnswer === null || timeExpired || isCalculating) return

    const userAnswer: UserAnswer = {
      question: dailyQuestions[currentQuestionIndex],
      selectedAnswer: selectedAnswer,
      isCorrect: selectedAnswer === dailyQuestions[currentQuestionIndex].correctAnswer
    }
    const newAnswers = [...userAnswers, userAnswer]
    setUserAnswers(newAnswers)

    const isLastQuestion = currentQuestionIndex === dailyQuestions.length - 1

    if (isLastQuestion) {
      finishQuiz(newAnswers, false)
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleReset = () => {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
  }

  if (!isLoaded) return null;

  // --- VIEW 3: ECRANUL DE CALCULARE (HOOK) ---
  if (isCalculating) {
      const messages = [
          "Se analizează tiparele cognitive...",
          "Se calculează viteza de procesare...",
          "Se compară cu datele demografice...",
          "Se generează raportul final..."
      ];
      
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950 z-0"></div>
            
            <div className="relative z-10 w-full max-w-md text-center">
                <div className="mb-8 relative inline-block">
                    <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                    <Loader2 className="h-16 w-16 text-cyan-400 animate-spin relative z-10 mx-auto" />
                </div>
                
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Calibrare Rezultat
                </h2>
                
                <div className="space-y-4 mt-8 text-left bg-slate-900/50 p-6 rounded-xl border border-slate-800 backdrop-blur-sm">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex items-center gap-3 transition-all duration-500 ${idx <= calculationStep ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'}`}>
                            {idx < calculationStep ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                            ) : idx === calculationStep ? (
                                <div className="h-5 w-5 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin flex-shrink-0" />
                            ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-slate-700 flex-shrink-0" />
                            )}
                            <span className={idx === calculationStep ? "text-white font-medium" : "text-slate-400"}>
                                {msg}
                            </span>
                        </div>
                    ))}
                </div>

                <p className="mt-8 text-sm text-slate-500 animate-pulse">
                    Te rugăm nu închide pagina...
                </p>
            </div>
        </div>
      )
  }

  // --- VIEW 1: LANDING PAGE ---
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <header className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
           <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CogniTest™
          </div>
          <div className="hidden md:block text-sm text-slate-400 font-mono">v2.5 Stable</div>
        </header>

        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 md:px-8 mt-4 md:mt-10 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-700 mb-8 animate-fade-in-up">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs md:text-sm text-slate-300 font-medium">Algoritm Calibrat 2024</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Descoperă-ți adevăratul <br className="hidden md:block"/> potențial cognitiv.
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
            Standardul de aur în evaluarea coeficientului de inteligență. 
            20 de întrebări care îți testează logica, viteza și precizia.
          </p>

          <Button 
            onClick={startNewQuiz}
            size="lg"
            className="group relative h-16 px-12 text-xl bg-white text-slate-950 hover:bg-slate-200 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]"
          >
            Începe Testul
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="mt-4 text-xs text-slate-500">
             Durata medie: 15 minute • Nu necesită cont • Rezultat Instant
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-16 max-w-5xl w-full text-left">
            <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-colors">
              <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4 text-cyan-400">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Logică Abstractă</h3>
              <p className="text-slate-400 text-sm">Capacitatea de a identifica tipare complexe și relații între obiecte.</p>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition-colors">
              <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 text-purple-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Viteză Mentală</h3>
              <p className="text-slate-400 text-sm">Eficiența procesării informațiilor sub presiune de timp.</p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Certificat Oficial</h3>
              <p className="text-slate-400 text-sm">Raport detaliat și diplomă digitală la finalizarea evaluării.</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // --- VIEW 2: QUIZ-UL ---
  if (dailyQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
          <p className="text-slate-400 animate-pulse">Se generează întrebările...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = dailyQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / dailyQuestions.length) * 100
  const isLastQuestion = currentQuestionIndex === dailyQuestions.length - 1
  const isTimeWarning = remainingTime < 300 

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Card className="w-full max-w-4xl bg-slate-900/95 backdrop-blur-xl border-cyan-500/30 shadow-2xl">
        <CardHeader className="border-b border-slate-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                 <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    CogniTest Assessment
                 </CardTitle>
                 <button onClick={handleReset} className="text-slate-600 hover:text-red-400 transition-colors" title="Resetează Testul">
                    <RefreshCcw className="h-4 w-4" />
                 </button>
              </div>
              
              <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
                <span className="font-mono bg-slate-800 px-2 py-1 rounded border border-slate-700">
                    Întrebarea {currentQuestionIndex + 1} / {dailyQuestions.length}
                </span>
                
                <span className={isTimeWarning ? "text-red-400 font-bold font-mono flex items-center gap-2 bg-red-900/20 px-2 py-1 rounded" : "font-mono flex items-center gap-2 bg-slate-800 px-2 py-1 rounded border border-slate-700"}>
                  <Clock className={`h-4 w-4 ${isTimeWarning ? "animate-pulse" : ""}`} />
                  {formatTime(remainingTime)}
                </span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-slate-700 mt-4" />
        </CardHeader>

        <CardContent className="pt-6 md:pt-8 pb-8">
          <div className="mb-6 md:mb-8">
             <h2 className="text-lg md:text-2xl font-semibold text-white leading-relaxed">
                {currentQuestion.text}
             </h2>
             <div className="mt-3 flex gap-2">
                <span className="text-[10px] md:text-xs px-2 py-1 rounded border border-slate-700 text-slate-400 uppercase tracking-wider bg-slate-800/50">
                    {currentQuestion.category}
                </span>
             </div>
          </div>

          {currentQuestion.visualGrid || (typeof currentQuestion.options[0] !== 'string') ? (
            <div className="mb-8">
                <VisualQuestion
                visualGrid={currentQuestion.visualGrid}
                options={currentQuestion.options}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={handleAnswerSelect}
                disabled={timeExpired}
                />
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={timeExpired}
                  className={`
                    w-full text-left p-4 rounded-lg border-2 transition-all duration-200 group relative overflow-hidden
                    ${selectedAnswer === index
                      ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]"
                      : "border-slate-700 bg-slate-800/40 hover:border-cyan-500/50 hover:bg-slate-800"
                    }
                  `}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`
                        w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-bold text-sm transition-colors
                        ${selectedAnswer === index ? "border-cyan-500 bg-cyan-500 text-white" : "border-slate-600 bg-slate-900 text-slate-500 group-hover:border-cyan-500/50 group-hover:text-cyan-400"}
                    `}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-sm md:text-lg text-slate-200 group-hover:text-white transition-colors">
                      {typeof option === 'string' ? option : 'Visual Option'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              size="lg"
              className="w-full md:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-6 text-lg shadow-lg shadow-blue-900/20 transition-all active:scale-95"
            >
              {isLastQuestion ? "Finalizează & Vezi Rezultatul" : "Următoarea Întrebare"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}