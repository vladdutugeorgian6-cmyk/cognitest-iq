"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Componenta de input
import { CheckCircle, XCircle, Home, RotateCcw, BrainCircuit, Award, Share2, Mail, Copy, Linkedin, Twitter } from "lucide-react"
import { UserAnswer } from "@/types/quiz"
import { jsPDF } from "jspdf"
import BellCurve from "@/components/BellCurve"
import { playSuccessSound } from "@/utils/sounds"

interface QuizResult {
  answers: UserAnswer[]
  correctCount: number
  totalQuestions: number
  iqResult: number
  timeExpired: boolean
}

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [email, setEmail] = useState("")
  const [isEmailSaved, setIsEmailSaved] = useState(false)

  useEffect(() => {
    const storedResult = sessionStorage.getItem('quizResult')
    
    if (!storedResult) {
      router.push('/')
      return
    }

    setResult(JSON.parse(storedResult))

    const timer = setTimeout(() => {
      playSuccessSound()
    }, 500)

    return () => clearTimeout(timer)
  }, [router])

  // --- 1. LOGICA PDF ---
  const handleDownloadCertificate = () => {
    if (!result) return;

    const userName = prompt("Introdu numele complet pentru diplomă:", "Nume Prenume") || "Participant";
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const navyBlue = "#0a192f";
    const goldAccent = "#c6a700";
    const darkGrey = "#424242";

    doc.setDrawColor(navyBlue);
    doc.setLineWidth(3);
    doc.rect(5, 5, width - 10, height - 10);
    doc.setDrawColor(goldAccent);
    doc.setLineWidth(1);
    doc.rect(8, 8, width - 16, height - 16);

    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.setTextColor(goldAccent);
    doc.text("COGNITEST PROFESSIONAL ASSESSMENT", width / 2, 25, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(42);
    doc.setTextColor(navyBlue);
    doc.text("CERTIFICATE OF ACHIEVEMENT", width / 2, 45, { align: "center" });

    doc.setFont("times", "italic");
    doc.setFontSize(16);
    doc.setTextColor(darkGrey);
    doc.text("This official document certifies that", width / 2, 70, { align: "center" });

    doc.setFont("times", "bolditalic");
    doc.setFontSize(40);
    doc.setTextColor(navyBlue);
    doc.text(userName.toUpperCase(), width / 2, 90, { align: "center" });

    doc.setFont("times", "italic");
    doc.setFontSize(16);
    doc.setTextColor(darkGrey);
    doc.text("has successfully completed the standardized cognitive ability protocol.", width / 2, 105, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(navyBlue);
    doc.text("CONFIRMED IQ SCORE:", width / 2, 130, { align: "center" });

    doc.setFont("times", "bold");
    doc.setFontSize(55);
    doc.setTextColor(goldAccent);
    doc.text(`${result.iqResult}`, width / 2, 150, { align: "center" });

    const today = new Date().toLocaleDateString();
    doc.setFontSize(11);
    doc.setTextColor(darkGrey);
    doc.setFont("times", "normal");
    doc.text(`Issue Date: ${today}`, 25, 180);
    doc.text("Lead Psychometrician, CogniTest AI", width - 25, 180, { align: "right" });

    doc.save(`CogniTest_Premium_Certificate_${userName.replace(/\s+/g, '_')}.pdf`);
  };

  // --- 2. LOGICA SHARE ---
  const handleShare = (platform: string) => {
    if (!result) return
    const text = `I just scored an IQ of ${result.iqResult} on CogniTest! Can you beat my score?`
    const url = window.location.origin // Linkul site-ului tău

    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank')
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${text} ${url}`)
      alert("Link copied to clipboard!")
    }
  }

  // --- 3. LOGICA EMAIL ---
  const handleSaveEmail = () => {
    if (!email.includes("@")) {
      alert("Please enter a valid email.")
      return
    }
    // Aici ai conecta o bază de date reală. Momentan doar simulăm.
    setIsEmailSaved(true)
    // alert("Result saved to " + email) 
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  const getIQLabel = (score: number) => {
    if (score >= 130) return { text: "Very Superior", color: "text-purple-400" }
    if (score >= 120) return { text: "Superior", color: "text-cyan-400" }
    if (score >= 110) return { text: "High Average", color: "text-green-400" }
    if (score >= 90) return { text: "Average", color: "text-yellow-400" }
    return { text: "Low Average", color: "text-orange-400" }
  }

  const label = getIQLabel(result.iqResult)
  const percentage = Math.round((result.correctCount / result.totalQuestions) * 100)

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* CARD PRINCIPAL */}
        <Card className="bg-slate-900/95 border-cyan-500/30 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
            
            <CardContent className="pt-12 pb-12 text-center space-y-6">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-800/50 mb-4">
                    <BrainCircuit className="w-12 h-12 text-cyan-500" />
                </div>
                
                <h1 className="text-3xl font-bold text-slate-300">Assessment Complete</h1>
                
                <div className="space-y-2">
                    <p className="text-slate-400 text-sm uppercase tracking-wider">Estimated IQ Score</p>
                    <div className={`text-6xl md:text-8xl font-black ${label.color} drop-shadow-lg`}>
                        {result.iqResult}
                    </div>
                    <p className={`text-xl font-medium ${label.color}`}>
                        {label.text} Intelligence
                    </p>
                </div>

                <div className="flex justify-center mt-6">
                    <Button 
                        onClick={handleDownloadCertificate}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 shadow-lg shadow-orange-500/20 px-8 py-6 text-lg transition-all hover:scale-105"
                    >
                        <Award className="w-6 h-6 mr-2" />
                        Download Premium Certificate
                    </Button>
                </div>

                {/* GRAFIC */}
                <div className="max-w-2xl mx-auto w-full pt-8">
                   <BellCurve score={result.iqResult} />
                </div>

                {/* SECȚIUNEA NOUĂ: SHARE & SAVE */}
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-8">
                  {/* Share Card */}
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center gap-3">
                    <p className="text-slate-300 font-semibold text-sm flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-cyan-400" /> Challenge Friends
                    </p>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" className="border-slate-600 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-colors" onClick={() => handleShare('linkedin')}>
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="border-slate-600 hover:bg-black hover:text-white hover:border-black transition-colors" onClick={() => handleShare('twitter')}>
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="border-slate-600 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors" onClick={() => handleShare('copy')}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Email Capture Card */}
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col gap-3">
                     {!isEmailSaved ? (
                       <>
                        <p className="text-slate-300 font-semibold text-sm flex items-center gap-2">
                          <Mail className="w-4 h-4 text-purple-400" /> Save Your Result
                        </p>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Enter email..." 
                            className="bg-slate-900 border-slate-600 text-white h-9 text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-500 h-9" onClick={handleSaveEmail}>
                            Save
                          </Button>
                        </div>
                       </>
                     ) : (
                       <div className="h-full flex items-center justify-center text-green-400 font-medium gap-2 animate-in fade-in">
                         <CheckCircle className="w-5 h-5" /> Result Saved!
                       </div>
                     )}
                  </div>
                </div>

                {/* Statistici */}
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <div>
                        <p className="text-2xl font-bold text-white">{result.correctCount}</p>
                        <p className="text-xs text-slate-400 uppercase">Correct</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{result.totalQuestions}</p>
                        <p className="text-xs text-slate-400 uppercase">Total</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{percentage}%</p>
                        <p className="text-xs text-slate-400 uppercase">Accuracy</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* LISTA RĂSPUNSURI */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white pl-2 border-l-4 border-cyan-500">Detailed Analysis</h2>
            {result.answers.map((ans, index) => (
                <Card key={index} className={`border-l-4 ${ans.isCorrect ? 'border-l-green-500 border-slate-700' : 'border-l-red-500 border-slate-700'} bg-slate-900/80`}>
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-4">
                            <CardTitle className="text-lg text-slate-200 leading-snug">
                                <span className="text-slate-500 mr-2">#{index + 1}.</span> {ans.question.text}
                            </CardTitle>
                            {ans.isCorrect ? <CheckCircle className="w-6 h-6 text-green-500"/> : <XCircle className="w-6 h-6 text-red-500"/>}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2">
                        <div className="bg-slate-950/50 p-3 rounded text-sm text-slate-300 border border-slate-800">
                            <span className="font-semibold text-cyan-400 block mb-1">Explanation:</span>
                            {ans.question.explanation || "No explanation provided."}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="flex justify-center gap-4 pt-8 pb-12">
            <Button onClick={() => router.push('/')} variant="outline" className="border-slate-600 hover:bg-slate-800 text-slate-300">
                <Home className="w-4 h-4 mr-2" /> Home
            </Button>
            <Button onClick={() => router.push('/quiz')} className="bg-cyan-600 hover:bg-cyan-500 text-white">
                <RotateCcw className="w-4 h-4 mr-2" /> Retake Test
            </Button>
        </div>
      </div>
    </div>
  )
}