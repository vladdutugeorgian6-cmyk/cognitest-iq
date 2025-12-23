"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, Home, Loader2 } from "lucide-react"
import Link from "next/link"

function ResultsContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  
  // AICI CITIM SCORUL FINAL DIN LINK!
  // Link-ul va arata gen: .../results?session_id=...&score=88
  const score = searchParams.get("score") || "124"

  const [status, setStatus] = useState("loading")

  useEffect(() => {
    if (sessionId) {
      setTimeout(() => setStatus("success"), 1000)
    } else {
      setStatus("error")
    }
  }, [sessionId])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
        <p className="text-slate-400">Verificăm plata...</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Eroare</h1>
          <p>Nu am putut verifica plata.</p>
           <Link href="/"><Button variant="outline" className="mt-4">Home</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
          Plată Efectuată cu Succes!
        </h1>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm mt-8 overflow-hidden">
          <CardHeader className="bg-slate-900 border-b border-slate-800/50">
            <CardTitle className="text-xl text-cyan-400">Rezultatul Tău Oficial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-8 pb-8">
             <div className="flex flex-col items-center justify-center">
                <span className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-2">Scor IQ</span>
                
                {/* AICI ESTE SCORUL DINAMIC */}
                <div className="text-7xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  {score}
                </div>
                
                <div className="inline-block mt-4 px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-medium">
                  {Number(score) > 120 ? "Inteligență Superioară" : Number(score) > 100 ? "Inteligență Medie" : "Rezultat Analizat"}
                </div>
             </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Link href="/">
            <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300 gap-2 h-12 px-8">
              <Home className="w-4 h-4" /> Acasă
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  )
}