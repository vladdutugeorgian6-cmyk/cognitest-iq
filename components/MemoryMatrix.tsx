"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart, Trophy, X, Award } from "lucide-react"

interface MemoryMatrixProps {
  onBack: () => void
}

const STORAGE_KEY = 'memory-matrix-high-score'

export default function MemoryMatrix({ onBack }: MemoryMatrixProps) {
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [gameState, setGameState] = useState<'waiting' | 'showing' | 'guessing' | 'gameOver' | 'success'>('waiting')
  const [pattern, setPattern] = useState<number[]>([])
  const [selectedCells, setSelectedCells] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [remainingTime, setRemainingTime] = useState(0)
  const [lastErrorCell, setLastErrorCell] = useState<number | null>(null)

  // Load high score from localStorage
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? parseInt(saved, 10) : 0
    }
    return 0
  })

  // Calculate grid size based on level
  const gridSize = useMemo(() => {
    if (level <= 3) return 3
    if (level <= 6) return 4
    return 5
  }, [level])

  // Calculate cells to show based on level and grid size
  const cellsToShow = useMemo(() => {
    if (level <= 3) return 3
    if (level <= 6) {
      // Level 4-6: 4x4 grid, show 4-5 cells
      // Level 4: 4 cells, Level 5: 5 cells, Level 6: 5 cells
      if (level === 4) return 4
      if (level === 5) return 5
      return 5 // Level 6
    }
    // Level 7+: 5x5 grid, show 6+ cells (increment every 2 levels)
    return 6 + Math.floor((level - 7) / 2)
  }, [level])

  // Calculate show duration based on level (decrease by 0.1s per level, min 0.5s)
  const showDuration = useMemo(() => {
    const baseDuration = 1500
    const decreasePerLevel = 100 // 0.1s = 100ms
    const minDuration = 500 // 0.5s minimum
    const calculated = baseDuration - (level - 1) * decreasePerLevel
    return Math.max(calculated, minDuration)
  }, [level])

  // Get grid column class based on grid size
  const gridColsClass = useMemo(() => {
    switch (gridSize) {
      case 3: return 'grid-cols-3'
      case 4: return 'grid-cols-4'
      case 5: return 'grid-cols-5'
      default: return 'grid-cols-3'
    }
  }, [gridSize])

  const generatePattern = useCallback(() => {
    const totalCells = gridSize * gridSize
    const indices: number[] = []
    while (indices.length < cellsToShow) {
      const randomIndex = Math.floor(Math.random() * totalCells)
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex)
      }
    }
    return indices.sort((a, b) => a - b)
  }, [gridSize, cellsToShow])

  const startRound = useCallback(() => {
    const newPattern = generatePattern()
    setPattern(newPattern)
    setSelectedCells([])
    setLastErrorCell(null)
    setRemainingTime(showDuration)
    setGameState('showing')

    // Progress bar animation
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 50
        if (newTime <= 0) {
          clearInterval(interval)
          return 0
        }
        return newTime
      })
    }, 50)

    setTimeout(() => {
      clearInterval(interval)
      setRemainingTime(0)
      setGameState('guessing')
    }, showDuration)
  }, [generatePattern, showDuration])

  useEffect(() => {
    if (gameState === 'waiting') {
      startRound()
    }
  }, [gameState, startRound])

  const handleCellClick = (index: number) => {
    if (gameState !== 'guessing') return
    if (selectedCells.includes(index)) return

    const isCorrect = pattern.includes(index)

    // If wrong cell selected, lose a life immediately
    if (!isCorrect) {
      setLastErrorCell(index)
      const newLives = lives - 1
      setLives(newLives)

      if (newLives <= 0) {
        // Update high score before game over
        const newHighScore = Math.max(highScore, level - 1)
        setHighScore(newHighScore)
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, newHighScore.toString())
        }
        setTimeout(() => {
          setGameState('gameOver')
        }, 800)
      } else {
        // Reset round with remaining lives
        setTimeout(() => {
          setGameState('waiting')
        }, 1500)
      }
      return
    }

    // Correct cell selected
    const newSelected = [...selectedCells, index]
    setSelectedCells(newSelected)

    // Check if pattern is complete
    const isComplete = newSelected.length === pattern.length

    if (isComplete) {
      // Verify all selected cells are in pattern and all pattern cells are selected
      const allCorrect = newSelected.length === pattern.length &&
                        newSelected.every(cell => pattern.includes(cell)) &&
                        pattern.every(cell => newSelected.includes(cell))
      
      if (allCorrect) {
        const newLevel = level + 1
        setScore(level)
        
        // Update high score
        const newHighScore = Math.max(highScore, newLevel - 1)
        setHighScore(newHighScore)
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, newHighScore.toString())
        }

        setGameState('success')
        setTimeout(() => {
          setLevel(newLevel)
          setGameState('waiting')
        }, 1500)
      }
    }
  }

  const resetGame = () => {
    setLevel(1)
    setLives(3)
    setGameState('waiting')
    setScore(0)
    setPattern([])
    setSelectedCells([])
    setLastErrorCell(null)
    setRemainingTime(0)
  }

  const isCellHighlighted = (index: number) => {
    return gameState === 'showing' && pattern.includes(index)
  }

  const isCellSelected = (index: number) => {
    return selectedCells.includes(index)
  }

  const isCellCorrect = (index: number) => {
    return pattern.includes(index)
  }

  const isCellWrong = (index: number) => {
    return index === lastErrorCell
  }

  const totalCells = gridSize * gridSize
  const progressPercentage = showDuration > 0 ? (remainingTime / showDuration) * 100 : 0

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Card className="w-full max-w-2xl bg-slate-800/90 border-purple-500/50">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Visual Memory Matrix
              </CardTitle>
              <CardDescription className="text-purple-300 mt-2">
                Nivel {level} • Grilă {gridSize}x{gridSize} • {cellsToShow} pătrate
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg">
                <Award className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-white">
                  High Score: <span className="font-bold text-yellow-400">{highScore}</span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((life) => (
                  <Heart
                    key={life}
                    className={`h-6 w-6 ${
                      life <= lives
                        ? "fill-red-500 text-red-500"
                        : "fill-gray-700 text-gray-700"
                    }`}
                  />
                ))}
              </div>
              <Button onClick={onBack} variant="outline" size="sm" className="border-slate-600">
                <X className="h-4 w-4 mr-2" />
                Ieși
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {gameState === 'gameOver' ? (
            <div className="text-center space-y-6 py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Trophy className="h-20 w-20 mx-auto text-yellow-400 mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white">Jocul s-a terminat!</h2>
              <p className="text-xl text-purple-300">Ai ajuns la nivelul {level - 1}</p>
              {highScore > 0 && (
                <p className="text-lg text-yellow-400 flex items-center justify-center gap-2">
                  <Award className="h-5 w-5" />
                  High Score: {highScore}
                </p>
              )}
              <div className="flex gap-4 justify-center">
                <Button onClick={resetGame} size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Joacă din nou
                </Button>
                <Button onClick={onBack} variant="outline" size="lg">
                  Înapoi la meniu
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Progress bar for memorization time */}
              {gameState === 'showing' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-300">Timp de memorare</span>
                    <span className="text-purple-400 font-mono">
                      {(remainingTime / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <Progress 
                    value={progressPercentage} 
                    className="h-3 bg-slate-700"
                  />
                </div>
              )}

              <div className="flex justify-center">
                <div
                  className={`grid ${gridColsClass} gap-2 p-4 rounded-lg bg-slate-900/50 border border-purple-500/30 w-fit transition-all duration-300`}
                >
                  {Array.from({ length: totalCells }).map((_, index) => {
                    const highlighted = isCellHighlighted(index)
                    const selected = isCellSelected(index)
                    const correct = isCellCorrect(index)
                    const wrong = isCellWrong(index)

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleCellClick(index)}
                        disabled={gameState !== 'guessing'}
                        className={`
                          w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg border-2 transition-all
                          ${highlighted 
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-300 shadow-lg shadow-purple-500/50' 
                            : selected && correct
                            ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/50'
                            : wrong
                            ? 'bg-red-500 border-red-400 shadow-lg shadow-red-500/50 animate-pulse'
                            : 'bg-slate-700 border-slate-600 hover:border-purple-500/50'
                          }
                          ${gameState === 'guessing' ? 'cursor-pointer' : 'cursor-not-allowed'}
                        `}
                        whileHover={gameState === 'guessing' && !selected ? { scale: 1.05 } : {}}
                        whileTap={gameState === 'guessing' ? { scale: 0.95 } : {}}
                        animate={
                          highlighted
                            ? {
                                scale: [1, 1.1, 1],
                                boxShadow: [
                                  "0 0 0px rgba(168, 85, 247, 0)",
                                  "0 0 20px rgba(168, 85, 247, 0.8)",
                                  "0 0 0px rgba(168, 85, 247, 0)",
                                ],
                              }
                            : selected && correct
                            ? {
                                scale: [1, 1.1, 1],
                              }
                            : {}
                        }
                        transition={{ duration: 0.2 }}
                      >
                        {selected && correct && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="w-full h-full flex items-center justify-center"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-full"
                            />
                          </motion.div>
                        )}
                        {wrong && (
                          <motion.div
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="w-full h-full flex items-center justify-center"
                          >
                            <X className="h-6 w-6 md:h-8 md:w-8 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {gameState === 'showing' && (
                <p className="text-center text-purple-300 text-lg font-medium">
                  Memorează pătratele aprinse...
                </p>
              )}

              {gameState === 'guessing' && (
                <div className="text-center space-y-2">
                  <p className="text-green-300 text-lg font-semibold">
                    Selectează pătratele memorate!
                  </p>
                  <p className="text-slate-400 text-sm">
                    {selectedCells.length} / {pattern.length} selectate
                  </p>
                </div>
              )}

              {gameState === 'success' && (
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center text-green-400 text-xl font-bold"
                >
                  ✓ Corect! Nivel următor...
                </motion.p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
