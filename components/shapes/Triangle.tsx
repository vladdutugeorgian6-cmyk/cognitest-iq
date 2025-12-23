interface TriangleProps {
  size?: number
  color?: string
  fill?: boolean | string
  rotation?: number
}

export default function Triangle({ 
  size = 40, 
  color = "currentColor", 
  fill = false, 
  rotation = 0 
}: TriangleProps) {
  const center = size / 2
  const strokeWidth = 2
  const offset = strokeWidth / 2
  const actualSize = size - strokeWidth * 2
  
  // Equilateral triangle points
  const height = actualSize * Math.sqrt(3) / 2
  const halfSize = actualSize / 2
  
  const x1 = center
  const y1 = center - height / 2 + offset
  const x2 = center - halfSize
  const y2 = center + height / 2 + offset
  const x3 = center + halfSize
  const y3 = center + height / 2 + offset
  
  const fillColor = typeof fill === 'string' ? fill : (fill ? color : 'none')
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <polygon
        points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
        fill={fillColor}
        stroke={color}
        strokeWidth={strokeWidth}
        transform={`rotate(${rotation} ${center} ${center})`}
      />
    </svg>
  )
}












