interface CircleProps {
  size?: number
  color?: string
  fill?: boolean | string
  rotation?: number
}

export default function Circle({ 
  size = 40, 
  color = "currentColor", 
  fill = false, 
  rotation = 0 
}: CircleProps) {
  const center = size / 2
  const radius = (size - 4) / 2
  const strokeWidth = 2
  
  const fillColor = typeof fill === 'string' ? fill : (fill ? color : 'none')
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill={fillColor}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}












