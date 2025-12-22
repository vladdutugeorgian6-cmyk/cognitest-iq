export const calculateIQ = (correctAnswers: number, totalQuestions: number): number => {
  // Configurație de bază
  const BASE_IQ = 80; // IQ-ul minim (dacă nu răspunzi la nimic)
  const MAX_IQ = 160; // IQ-ul maxim posibil
  
  // Calculăm procentajul de răspunsuri corecte
  const accuracy = correctAnswers / totalQuestions;
  
  // Calculăm punctajul adăugat la baza de 80
  // Dacă accuracy este 1 (100%), primește (160 - 80) = 80 puncte în plus
  const addedPoints = accuracy * (MAX_IQ - BASE_IQ);
  
  // Rotunjim rezultatul
  return Math.round(BASE_IQ + addedPoints);
};