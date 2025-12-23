"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Check, Zap, Lock, EyeOff } from "lucide-react"

function PricingContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<string | null>(null)

  // Citim scorul ca sa il trimitem la plata, DAR NU IL MAI AFISAM
  const scoreFromQuiz = searchParams.get("score") || "124"

  const handleCheckout = async (priceId: string, planName: string) => {
    try {
      setLoading(planName)
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            priceId, 
            score: scoreFromQuiz 
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error("Eroare server:", data)
        alert("Eroare la inițierea plății.")
        setLoading(null)
      }
      
    } catch (err) {
      console.error("Eroare rețea:", err)
      alert("Ceva nu a mers bine.")
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-4 md:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
      <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
        <div className="inline-flex items-center justify-center p-2 px-4 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium border border-amber-500/20 mb-4 animate-pulse">
            <Lock className="w-3 h-3 mr-2" /> Results are Ready & Locked
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          Unlock Your Cognitive Profile
        </h1>
        
        {/* AICI AM MODIFICAT - NU MAI ARATA SCORUL */}
        <p className="text-slate-400 text-lg md:text-xl flex items-center justify-center gap-2">
          Your assessment is complete. Score status: 
          <span className="text-slate-100 font-bold bg-slate-800 px-3 py-1 rounded flex items-center gap-2 border border-slate-700">
             <EyeOff className="w-4 h-4 text-slate-400" /> HIDDEN
          </span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* BASIC PLAN */}
        <Card className="bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-all">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-200">Basic Report</CardTitle>
            <CardDescription>Essential IQ score</CardDescription>
            <div className="mt-4"><span className="text-4xl font-bold text-white">$4.99</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500"/> Official IQ Score</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500"/> Performance Summary</li>
            </ul>
          </CardContent>
          <CardFooter>
            {/* ID-UL TAU BASIC ESTE DEJA AICI */}
            <Button 
                onClick={() => handleCheckout('price_1ShBh21Jbk6ND23zN4dhNLsT', 'basic')} 
                disabled={loading !== null} 
                variant="outline" 
                className="w-full h-12"
            >
              {loading === 'basic' ? 'Processing...' : 'Unlock Basic Score'}
            </Button>
          </CardFooter>
        </Card>

        {/* PRO PLAN */}
        <Card className="bg-slate-900 border-cyan-500/50 shadow-2xl relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold flex gap-2">
             <Zap className="w-4 h-4"/> BEST VALUE
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Full Certified Report</CardTitle>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-bold text-white">$14.99</span>
              <span className="text-slate-500 line-through mb-1">$29.99</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-white">
              <li className="flex gap-2"><Check className="w-4 h-4 text-green-400"/> Official IQ Score</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-green-400"/> PDF Certificate</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-green-400"/> Detailed Analysis</li>
            </ul>
          </CardContent>
          <CardFooter>
            {/* ID-UL TAU FULL ESTE DEJA AICI */}
            <Button 
                onClick={() => handleCheckout('price_1ShBid1Jbk6ND23z0Lel38a1', 'full')} 
                disabled={loading !== null} 
                className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-bold"
            >
                {loading === 'full' ? 'Processing...' : 'Get Full Access'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
      <PricingContent />
    </Suspense>
  )
}