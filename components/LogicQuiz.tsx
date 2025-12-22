"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { questions } from "@/data/questions"
import { UserAnswer } from "@/types/quiz"
import { calculateIQ } from "@/utils/iq-calculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Clock, X, AlertCircle } from "lucide-react"
import VisualQuestion from "@/components/VisualQuestion"
import { VisualOption } from "@/types/visual"

const TOTAL_TIME_SECONDS = 30 * 60 // 30 minutes

interface LogicQuizProps {
  onBack: () => void
}

export default function LogicQuiz({ onBack }: LogicQuizProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [remainingTime, setRemainingTime] = useState(TOTAL_TIME_SECONDS)
  const [timeExpired, setTimeExpired] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  // Global timer countdown
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

  // Handle time expiration
  useEffect(() => {
    if (timeExpired && userAnswers.length > 0) {
      const correctCount = userAnswers.filter(a => a.isCorrect).length
      const iqResult = calculateIQ(correctCount)

      const result = {
        answers: userAnswers,
        correctCount,
        totalQuestions: userAnswers.length,
        iqResult,
        timeExpired: true
      }
      
      sessionStorage.setItem('quizResult', JSON.stringify(result))
      router.push('/results')
    }
  }, [timeExpired, userAnswers, router])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (timeExpired) return
    setSelectedAnswer(answerIndex)
  }


  const handleNext = () => {
    if (selectedAnswer === null || timeExpired) return

    // Create user answer object
    const userAnswer: UserAnswer = {
      question: currentQuestion,
      selectedAnswer: selectedAnswer,
      isCorrect: selectedAnswer === currentQuestion.correctAnswer
    }

    const newAnswers = [...userAnswers, userAnswer]
    setUserAnswers(newAnswers)

    if (isLastQuestion) {
      // Add last answer and finish
      const finalAnswers = [...newAnswers]
      const correctCount = finalAnswers.filter(a => a.isCorrect).length
      const iqResult = calculateIQ(correctCount)

      const result = {
        answers: finalAnswers,
        correctCount,
        totalQuestions: questions.length,
        iqResult,
        timeExpired: false
      }
      
      sessionStorage.setItem('quizResult', JSON.stringify(result))
      router.push('/results')
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
    }
  }

  const timePercentage = (remainingTime / TOTAL_TIME_SECONDS) * 100
  const isTimeWarning = remainingTime < 300 // Less than 5 minutes

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Card className="w-full max-w-4xl bg-slate-800/95 border-blue-500/30 shadow-2xl">
        <CardHeader className="border-b border-slate-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Professional IQ Test
              </CardTitle>
              <div className="mt-2 flex items-center gap-4 text-sm text-slate-300">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className="text-slate-500">•</span>
                <span className={isTimeWarning ? "text-red-400 font-semibold flex items-center gap-1" : "flex items-center gap-1"}>
                  <Clock className={`h-4 w-4 ${isTimeWarning ? "animate-pulse" : ""}`} />
                  {formatTime(remainingTime)}
                </span>
              </div>
            </div>
            <Button 
              onClick={onBack} 
              variant="outline" 
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <X className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="h-2 bg-slate-700" />
          </div>

          {/* Time Warning */}
          {isTimeWarning && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
              <AlertCircle className="h-4 w-4" />
              <span>Less than 5 minutes remaining</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-8 pb-8">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
              {currentQuestion.text}
            </h2>
          </div>

          {/* Visual Question or Text-based Options */}
          {currentQuestion.visualGrid ? (
            <div className="mb-8">
              <VisualQuestion
                visualGrid={currentQuestion.visualGrid}
                options={currentQuestion.options as VisualOption[]}
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
                      ? "border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/30"
                      : "border-slate-600 bg-slate-700/50 hover:border-blue-500/50 hover:bg-slate-700"
                    }
                    ${timeExpired ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${selectedAnswer === index
                          ? "border-blue-500 bg-blue-500"
                          : "border-slate-500 bg-slate-600"
                        }
                      `}
                    >
                      {selectedAnswer === index && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-base md:text-lg text-white">
                      {typeof option === 'string' ? option : `${option.shape} ${option.fill ? 'filled' : 'outline'}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Navigation Button */}
          <div className="flex justify-end pt-4 border-t border-slate-700">
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null || timeExpired}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLastQuestion ? "Finish Test" : "Next Question"}
            </Button>
          </div>

          {/* Time Expired Message */}
          {timeExpired && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 font-semibold text-center">
                Time expired! Redirecting to results...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}