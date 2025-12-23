interface SquareProps {
  size?: number
  color?: string
  fill?: boolean | string
  rotation?: number
}

export default function Square({ 
  size = 40, 
  color = "currentColor", 
  fill = false, 
  rotation = 0 
}: SquareProps) {
  const center = size / 2
  const strokeWidth = 2
  const actualSize = size - strokeWidth
  
  const fillColor = typeof fill === 'string' ? fill : (fill ? color : 'none')
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <rect
        x={strokeWidth / 2}
        y={strokeWidth / 2}
        width={actualSize}
        height={actualSize}
        fill={fillColor}
        stroke={color}
        strokeWidth={strokeWidth}
        transform={`rotate(${rotation} ${center} ${center})`}
      />
    </svg>
  )
}












