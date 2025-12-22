import { Question } from "@/data/questions"

/**
 * Fisher-Yates Shuffle Algorithm
 * Efficiently shuffles an array in-place
 */
function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array] // Create a copy to avoid mutating the original
  let currentIndex = shuffled.length
  let randomIndex: number

  // While there remain elements to shuffle
  while (currentIndex > 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element
    ;[shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex]
    ]
  }

  return shuffled
}

/**
 * Randomly selects n elements from an array without replacement
 */
function randomSelect<T>(array: T[], count: number): T[] {
  if (count >= array.length) {
    return fisherYatesShuffle(array)
  }

  const shuffled = fisherYatesShuffle(array)
  return shuffled.slice(0, count)
}

/**
 * Generates a balanced quiz session from all available questions
 * 
 * @param allQuestions - All available questions in the database
 * @param totalCount - Total number of questions to include in the quiz (default: 15)
 * @returns A shuffled array of questions with balanced visual/text distribution
 * 
 * Distribution:
 * - 40% visual questions (questions with visualGrid)
 * - 60% text/logic questions (questions without visualGrid)
 */
export function generateQuizSession(
  allQuestions: Question[],
  totalCount: number = 15
): Question[] {
  // Separate questions into visual and text categories
  const visualQuestions = allQuestions.filter((q) => q.visualGrid !== undefined)
  const textQuestions = allQuestions.filter((q) => q.visualGrid === undefined)

  // Calculate distribution
  const visualCount = Math.round(totalCount * 0.4) // 40% visual
  const textCount = totalCount - visualCount // 60% text (remaining)

  // Validate that we have enough questions
  if (visualQuestions.length < visualCount) {
    console.warn(
      `Warning: Only ${visualQuestions.length} visual questions available, but ${visualCount} requested. Using all available visual questions.`
    )
  }
  if (textQuestions.length < textCount) {
    console.warn(
      `Warning: Only ${textQuestions.length} text questions available, but ${textCount} requested. Using all available text questions.`
    )
  }

  // Select random questions from each category
  const selectedVisual = randomSelect(
    visualQuestions,
    Math.min(visualCount, visualQuestions.length)
  )
  const selectedText = randomSelect(
    textQuestions,
    Math.min(textCount, textQuestions.length)
  )

  // Combine and shuffle the final selection
  const combinedQuestions = [...selectedVisual, ...selectedText]
  const shuffledQuestions = fisherYatesShuffle(combinedQuestions)

  return shuffledQuestions
}






