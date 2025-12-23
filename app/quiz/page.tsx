"use client"

import { useState, useEffect } from "react"
// NU mai folosim router, folosim metoda directa window.location
import { questions } from "@/data/questions"
import { Question, UserAnswer } from "@/types/quiz"
import { calculateIQ } from "@/utils/iq-calculator"
import { generateQuizSession } from "@/utils/quiz-engine"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import VisualQuestion from "@/components/VisualQuestion"
import { playClickSound } from "@/utils/sounds"

const TOTAL_TIME_SECONDS = 30 * 60 
const QUIZ_QUESTION_COUNT = 20 

export default function QuizPage() {
  const [dailyQuestions, setDailyQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [remainingTime, setRemainingTime] = useState(TOTAL_TIME_SECONDS)
  const [timeExpired, setTimeExpired] = useState(false)

  // INITIALIZARE
  useEffect(() => {
    const generatedQuestions = generateQuizSession(questions, QUIZ_QUESTION_COUNT)
    setDailyQuestions(generatedQuestions)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setUserAnswers([])
    setRemainingTime(TOTAL_TIME_SECONDS)
    setTimeExpired(false)
    localStorage.removeItem("iqScore") 
  }, [])

  // TIMER
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

  // EXPIRARE TIMP
  useEffect(() => {
    if (timeExpired && userAnswers.length > 0) {
      finishQuiz(userAnswers, true)
    }
  }, [timeExpired, userAnswers])

  // --- FUNCTIA NUCLEARA DE FINAL ---
  const finishQuiz = (finalAnswers: UserAnswer[], isTimeExpired: boolean) => {
    const correctCount = finalAnswers.filter(a => a.isCorrect).length
    const iqResult = calculateIQ(correctCount, QUIZ_QUESTION_COUNT) 

    // Salvam scorul
    localStorage.setItem("iqScore", iqResult.toString())

    // REDIRECTARE FORTATA
    // Folosim window.location.href care nu da greș niciodată
    window.location.href = "/pricing?score=" + iqResult;
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (timeExpired) return
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

  if (dailyQuestions.length === 0) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Se încarcă testul...</div>
  }

  const currentQuestion = dailyQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / dailyQuestions.length) * 100
  const isTimeWarning = remainingTime < 300 
  const isLastQuestion = currentQuestionIndex === dailyQuestions.length - 1

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Card className="w-full max-w-4xl bg-slate-900/95 backdrop-blur-xl border-cyan-500/30 shadow-2xl">
        <CardHeader className="border-b border-slate-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              {/* TITLUL ROSU DE VERIFICARE */}
              <CardTitle className="text-2xl font-bold text-red-500">
                TEST FINAL VERIFICARE
              </CardTitle>
              
              <div className="mt-2 flex items-center gap-4 text-sm text-slate-300">
                <span className="font-mono">Question {currentQuestionIndex + 1} / {dailyQuestions.length}</span>
                <span className="text-slate-500">•</span>
                <span className="font-mono flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatTime(remainingTime)}
                </span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-slate-700 mt-4" />
        </CardHeader>

        <CardContent className="pt-8 pb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-8">
            {currentQuestion.text}
          </h2>

          {currentQuestion.visualGrid || (typeof currentQuestion.options[0] !== 'string') ? (
            <VisualQuestion
              visualGrid={currentQuestion.visualGrid}
              options={currentQuestion.options}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={handleAnswerSelect}
              disabled={timeExpired}
            />
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
                      ? "border-cyan-500 bg-cyan-500/20 shadow-lg"
                      : "border-slate-600 bg-slate-700/50 hover:bg-slate-700"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${selectedAnswer === index ? "border-cyan-500 bg-cyan-500 text-white" : "border-slate-500 bg-slate-800 text-slate-400"}`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-white">
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
              disabled={selectedAnswer === null}
              size="lg"
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-8"
            >
              {isLastQuestion ? "Finish & Check Score" : "Next Question"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}