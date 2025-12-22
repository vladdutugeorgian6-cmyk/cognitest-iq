interface DotProps {
  size?: number
  color?: string
  fill?: boolean | string
  rotation?: number
}

export default function Dot({ 
  size = 40, 
  color = "currentColor", 
  fill = true, 
  rotation = 0 
}: DotProps) {
  const center = size / 2
  const radius = size * 0.15
  const strokeWidth = 1
  
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
        fill={fillColor || color}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}






