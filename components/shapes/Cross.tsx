interface CrossProps {
  size?: number
  color?: string
  fill?: boolean | string
  rotation?: number
}

export default function Cross({ 
  size = 40, 
  color = "currentColor", 
  fill = false, 
  rotation = 0 
}: CrossProps) {
  const center = size / 2
  const strokeWidth = 2
  const armLength = size * 0.35
  const armWidth = size * 0.15
  
  const fillColor = typeof fill === 'string' ? fill : (fill ? color : 'none')
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <g transform={`rotate(${rotation} ${center} ${center})`}>
        {/* Horizontal arm */}
        <rect
          x={center - armLength / 2}
          y={center - armWidth / 2}
          width={armLength}
          height={armWidth}
          fill={fillColor || color}
          stroke={color}
          strokeWidth={strokeWidth}
        />
        {/* Vertical arm */}
        <rect
          x={center - armWidth / 2}
          y={center - armLength / 2}
          width={armWidth}
          height={armLength}
          fill={fillColor || color}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>
    </svg>
  )
}






