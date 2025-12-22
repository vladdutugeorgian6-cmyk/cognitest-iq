"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, Label } from 'recharts';

interface BellCurveProps {
  score: number;
}

export default function BellCurve({ score }: BellCurveProps) {
  // Generăm datele matematice pentru curba lui Gauss (Media 100, Deviația Standard 15)
  const data = [];
  for (let i = 55; i <= 145; i += 5) {
    // Formula distribuției normale
    const y = Math.exp(-0.5 * Math.pow((i - 100) / 15, 2));
    data.push({ iq: i, value: y });
  }

  // Calculăm percentila (cât la % din populație ai depășit)
  const z = (score - 100) / 15;
  // Aproximare simplă a funcției de eroare
  const percentile = Math.round((0.5 * (1 + Math.sign(z) * Math.sqrt(1 - Math.exp(-4 * z * z / Math.PI)))) * 100);

  return (
    <div className="w-full h-[320px] mt-8 bg-slate-900/50 p-6 rounded-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-1000 shadow-xl">
      <div className="text-center mb-6">
        <h3 className="text-slate-200 font-semibold text-lg">IQ Distribution Curve</h3>
        <p className="text-cyan-400 text-sm mt-1">
          You scored higher than <span className="font-bold text-lg text-amber-400">{percentile}%</span> of the population.
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="iq" 
            stroke="#64748b" 
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
            interval={1} 
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '8px' }}
            itemStyle={{ color: '#22d3ee' }}
            formatter={() => ['Population Density']}
            labelFormatter={(label) => `IQ Score: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#06b6d4" 
            fillOpacity={1} 
            fill="url(#colorValue)" 
            strokeWidth={3}
            animationDuration={2000}
          />
          
          {/* Linia care arată scorul tău - Portocalie/Aurie */}
          <ReferenceLine x={score} stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={2}>
            <Label 
              value="YOU" 
              position="top" 
              fill="#f59e0b" 
              fontWeight="bold"
              offset={10}
            />
          </ReferenceLine>
          
          {/* Linia pentru media populației - Gri discret */}
          <ReferenceLine x={100} stroke="#475569" strokeDasharray="3 3" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}