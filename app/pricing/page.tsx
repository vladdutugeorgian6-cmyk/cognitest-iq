"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Check, X, Zap, Award, Brain, BarChart3, Lock } from "lucide-react"

export default function PricingPage() {
  const router = useRouter()

  const handlePurchase = (plan: string) => {
    // Aici vom pune Stripe mai târziu.
    // Momentan SIMULĂM plata.
    
    if(confirm(`Ești sigur că vrei pachetul ${plan}? (Simulare Plată)`)) {
        // Salvăm în browser faptul că "a plătit" (ca să știm la rezultate)
        sessionStorage.setItem('hasPaid', 'true')
        sessionStorage.setItem('planType', plan)
        
        router.push('/results')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-4 md:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
      
      {/* HEADER */}
      <div className="max-w-3xl mx-auto text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="inline-flex items-center justify-center p-2 px-4 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium border border-cyan-500/20 mb-4">
            <Lock className="w-3 h-3 mr-2" /> Results Locked
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          Unlock Your Cognitive Profile
        </h1>
        <p className="text-slate-400 text-lg md:text-xl">
          Your assessment is complete and analyzed. Choose a package to reveal your results.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* === PLANUL STANDARD ($4.99) === */}
        <Card className="bg-slate-900/40 border-slate-800 relative hover:border-slate-700 transition-all hover:bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-200">Basic Report</CardTitle>
            <CardDescription>Essential IQ score calculation</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold text-white">$4.99</span>
              <span className="text-slate-500 ml-2">one-time</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-cyan-500/10 text-cyan-500"><Check className="w-4 h-4" /></div>
                <span className="text-slate-300">Official IQ Score</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-cyan-500/10 text-cyan-500"><Check className="w-4 h-4" /></div>
                <span className="text-slate-300">Basic Performance Summary</span>
              </li>
              <li className="flex items-center gap-3 opacity-40">
                <div className="p-1 rounded-full bg-slate-800 text-slate-600"><X className="w-4 h-4" /></div>
                <span className="text-slate-500 line-through">Official Printable Certificate</span>
              </li>
              <li className="flex items-center gap-3 opacity-40">
                <div className="p-1 rounded-full bg-slate-800 text-slate-600"><X className="w-4 h-4" /></div>
                <span className="text-slate-500 line-through">Deep Cognitive Analysis</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handlePurchase('Standard')} variant="outline" className="w-full border-slate-600 hover:bg-slate-800 h-12 text-lg">
              Unlock Basic Score
            </Button>
          </CardFooter>
        </Card>

        {/* === PLANUL PROFESSIONAL ($14.99) === */}
        <Card className="bg-slate-900 border-cyan-500/50 relative shadow-2xl shadow-cyan-900/20 transform md:-translate-y-4">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 animate-pulse">
            <Zap className="w-4 h-4 fill-white" /> BEST VALUE
          </div>

          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              Full Certified Report <Award className="text-amber-400 w-6 h-6" />
            </CardTitle>
            <CardDescription className="text-cyan-200">Everything included + Certificate</CardDescription>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-bold text-white">$14.99</span>
              <span className="text-lg text-slate-500 line-through mb-1">$29.99</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-green-500/20 text-green-400"><Check className="w-4 h-4" /></div>
                <span className="text-white font-medium">Official IQ Score</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-green-500/20 text-green-400"><Check className="w-4 h-4" /></div>
                <span className="text-white font-medium">Printable PDF Certificate (High Res)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-green-500/20 text-green-400"><Check className="w-4 h-4" /></div>
                <span className="text-white font-medium">Population Comparison (Bell Curve)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-green-500/20 text-green-400"><Check className="w-4 h-4" /></div>
                <span className="text-white font-medium">Detailed Logic Analysis</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handlePurchase('Professional')} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white h-14 text-lg font-bold shadow-lg shadow-cyan-500/25 transition-all hover:scale-105">
              Get Full Access & Certificate
            </Button>
          </CardFooter>
        </Card>
      </div>

      <p className="text-center text-slate-600 text-sm mt-12">
        Secure SSL payment. 30-day money-back guarantee.
      </p>
    </div>
  )
}