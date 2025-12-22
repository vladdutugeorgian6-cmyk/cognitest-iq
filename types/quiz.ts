export type QuestionCategory = 'Logic' | 'Numeric' | 'Verbal' | 'Spatial';
export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface VisualCell {
  shape: string;
  fill?: boolean;
  rotation?: number;
}

export interface VisualGrid {
  cells: (VisualCell | null)[];
}

export interface VisualOption {
  id?: string;
  shape?: string;
  fill?: boolean;
  rotation?: number;
  text?: string;
}

export interface Question {
  id: number;
  text: string;
  options: (string | VisualOption)[]; 
  correctAnswer: number;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  explanation: string;
  visualGrid?: VisualGrid;
}

export interface UserAnswer {
  question: Question;
  selectedAnswer: number;
  isCorrect: boolean;
}