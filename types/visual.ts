import { ShapeType, ShapeConfig } from "@/components/shapes"

export interface VisualCell {
  shape: ShapeType
  rotation?: number
  fill?: boolean | string
  color?: string
}

export interface VisualOption extends ShapeConfig {
  // Extends ShapeConfig for answer options
}

export type QuestionOption = string | VisualOption

export interface VisualGrid {
  cells: (VisualCell | null)[]
  // 3x3 grid = 9 cells, last one (index 8) is typically empty/null (the question mark)
}






