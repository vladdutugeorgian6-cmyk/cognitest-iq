export { default as Square } from './Square'
export { default as Circle } from './Circle'
export { default as Triangle } from './Triangle'
export { default as Cross } from './Cross'
export { default as Dot } from './Dot'

export type ShapeType = 'Square' | 'Circle' | 'Triangle' | 'Cross' | 'Dot'

export interface ShapeConfig {
  shape: ShapeType
  rotation?: number
  fill?: boolean | string
  color?: string
  size?: number
}






