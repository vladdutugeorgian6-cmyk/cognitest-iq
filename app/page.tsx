"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { questions } from "@/data/questions"
import { Question, UserAnswer } from "@/types/quiz"
import { calculateIQ } from "@/utils/iq-calculator"
import { generateQuizSession } from "@/utils/quiz-engine"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Clock, AlertCircle } from "lucide-react"
import VisualQuestion from "@/components/VisualQuestion"
import { playClickSound } from "@/utils/sounds"

// CONFIGURĂRI TEST
const TOTAL_TIME_SECONDS = 30 * 60 // 30 minute
const QUIZ_QUESTION_COUNT = 20 // Numărul de întrebări per sesiune

export default function QuizPage() {
  const router = useRouter()
  
  // --- STATE ---
  const [dailyQuestions, setDailyQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [remainingTime, setRemainingTime] = useState(TOTAL_TIME_SECONDS)
  const [timeExpired, setTimeExpired] = useState(false)

  // --- 1. INITIALIZARE ---
  useEffect(() => {
    const generatedQuestions = generateQuizSession(questions, QUIZ_QUESTION_COUNT)
    setDailyQuestions(generatedQuestions)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setUserAnswers([])
    setRemainingTime(TOTAL_TIME_SECONDS)
    setTimeExpired(false)
  }, [])

  // --- 2. TIMER ---
  useEffect(() => {
    if (timeExpired) return

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
  }, [timeExpired])

  // --- 3. EXPIRARE TIMP ---
  useEffect(() => {
    if (timeExpired && userAnswers.length > 0) {
      finishQuiz(userAnswers, true)
    }
  }, [timeExpired, userAnswers])

  // --- FUNCȚII ---
  
  const finishQuiz = (finalAnswers: UserAnswer[], isTimeExpired: boolean) => {
    const correctCount = finalAnswers.filter(a => a.isCorrect).length
    // Calculăm IQ-ul
    const iqResult = calculateIQ(correctCount, QUIZ_QUESTION_COUNT) 

    const result = {
      answers: finalAnswers,
      correctCount,
      totalQuestions: finalAnswers.length,
      iqResult,
      timeExpired: isTimeExpired
    }
    
    // Salvăm rezultatul "în spate"
    sessionStorage.setItem('quizResult', JSON.stringify(result))
    
    // --- MODIFICAREA IMPORTANTĂ ---
    // Îl trimitem la pagina de prețuri pentru a plăti înainte de a vedea rezultatul
    router.push('/pricing')
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (timeExpired) return
    
    // Sunetul de click
    playClickSound()
    
    setSelectedAnswer(answerIndex)
  }

  const handleNext = () => {
    if (selectedAnswer === null || timeExpired) return

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

  // --- LOADING UI ---
  if (dailyQuestions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Card className="w-full max-w-4xl bg-slate-900/95 backdrop-blur-xl border-cyan-500/30 shadow-2xl">
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-slate-300 text-lg">Preparing your test environment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // --- UI PRINCIPAL ---
  const currentQuestion = dailyQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / dailyQuestions.length) * 100
  const isTimeWarning = remainingTime < 300 // Sub 5 minute
  const isLastQuestion = currentQuestionIndex === dailyQuestions.length - 1

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Card className="w-full max-w-4xl bg-slate-900/95 backdrop-blur-xl border-cyan-500/30 shadow-2xl">
        <CardHeader className="border-b border-slate-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Professional IQ Assessment
              </CardTitle>
              <div className="mt-2 flex items-center gap-4 text-sm text-slate-300">
                <span className="font-mono">Question {currentQuestionIndex + 1} / {dailyQuestions.length}</span>
                <span className="text-slate-500">•</span>
                <span className={isTimeWarning ? "text-red-400 font-bold font-mono flex items-center gap-1" : "font-mono flex items-center gap-1"}>
                  <Clock className={`h-4 w-4 ${isTimeWarning ? "animate-pulse" : ""}`} />
                  {formatTime(remainingTime)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Progress value={progress} className="h-2 bg-slate-700" />
          </div>

          {isTimeWarning && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 animate-pulse">
              <AlertCircle className="h-4 w-4" />
              <span>Time is running low!</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-8 pb-8">
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
              {currentQuestion.text}
            </h2>
            <div className="mt-2 flex gap-2">
                <span className={`text-xs px-2 py-1 rounded border ${
                    currentQuestion.difficulty === 'Hard' ? 'border-red-500/50 text-red-400' : 
                    currentQuestion.difficulty === 'Medium' ? 'border-yellow-500/50 text-yellow-400' : 
                    'border-green-500/50 text-green-400'
                }`}>
                    {currentQuestion.difficulty}
                </span>
                <span className="text-xs px-2 py-1 rounded border border-slate-700 text-slate-400">
                    {currentQuestion.category}
                </span>
            </div>
          </div>

          {/* VIZUAL SAU TEXT */}
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
                    w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                    ${selectedAnswer === index
                      ? "border-cyan-500 bg-cyan-500/20 shadow-lg shadow-cyan-500/30 translate-x-2"
                      : "border-slate-600 bg-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-700"
                    }
                    ${timeExpired ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                        w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-bold text-sm
                        ${selectedAnswer === index
                          ? "border-cyan-500 bg-cyan-500 text-white"
                          : "border-slate-500 bg-slate-800 text-slate-400"
                        }
                      `}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-base md:text-lg text-white">
                      {typeof option === 'string' ? option : 'Visual Option'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-700">
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null || timeExpired}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/50 transition-all hover:scale-105"
            >
              {isLastQuestion ? "Finish Assessment" : "Next Question"}
            </Button>
          </div>

          {timeExpired && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 font-semibold text-center">
                Time expired! Calculating results...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}