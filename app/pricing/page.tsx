"use client";

import { Check, Lock, Star, Clock, AlertTriangle, ChevronRight, ShieldCheck } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

// Definim componenta PricingContent separat pentru a o putea pune într-un Suspense
function PricingContent() {
  const searchParams = useSearchParams();
  const scoreParam = searchParams.get("score");
  const score = scoreParam ? parseInt(scoreParam) : 100; // Default 100 dacă nu avem scor
  
  const [loading, setLoading] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minute

  // Timer pentru presiune psihologică
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // Calculăm percentila (fake math dar credibil)
  // Dacă scor e 100 -> top 50%. Dacă e 130 -> top 2%.
  const percentile = score < 100 ? 50 : Math.min(99, Math.floor(50 + (score - 100) * 1.5));

  const handleSubscription = async (priceId: string) => {
    setLoading(priceId);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
      {/* Banner de Urgență */}
      <div className="fixed top-0 left-0 w-full bg-red-600/90 text-white text-center py-2 z-50 text-sm font-bold flex justify-center items-center gap-2 backdrop-blur-sm">
        <Clock className="w-4 h-4" />
        Rezultatul tău va fi șters în {formatTime(timeLeft)} din motive de securitate.
      </div>

      <div className="max-w-6xl mx-auto mt-8">
        
        {/* Header cu Rezultat BLURAT */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-sm mb-6">
            <Check className="w-4 h-4" /> Calibrare Finalizată cu Succes
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Rezultatul tău indică un IQ <br/> 
            <span className="text-cyan-400">Peste Medie</span>
          </h1>

          {/* Cardul cu Scorul Blurat */}
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-700 rounded-2xl p-8 relative overflow-hidden group">
            {/* Blurring Effect */}
            <div className="absolute inset-0 backdrop-blur-md bg-slate-900/60 z-10 flex flex-col items-center justify-center">
              <div className="bg-white/10 p-4 rounded-full mb-4 ring-1 ring-white/20">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <p className="font-bold text-lg">Scorul este ascuns</p>
              <p className="text-sm text-slate-300">Deblochează raportul pentru a vedea numărul exact.</p>
            </div>
            
            {/* Content din spate (vizibil vag) */}
            <div className="opacity-30 blur-sm select-none">
              <div className="text-8xl font-black text-center text-white mb-2">{score}</div>
              <div className="flex justify-center gap-1 mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />)}
              </div>
              <p className="text-center text-xl">Nivel: Avansat</p>
            </div>
          </div>

          <p className="mt-6 text-slate-400 max-w-2xl mx-auto">
            Analiza noastră preliminară te plasează în <strong className="text-white">Top {100 - percentile}%</strong> din populație. 
            Profilul tău cognitiv arată puncte forte remarcabile în procesarea vizuală și logică abstractă.
          </p>
        </div>

        {/* PRICING GRID */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* BASIC PLAN */}
          <div className="relative p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-600 transition-all flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-300">Basic Report</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-bold text-white">$4.99</span>
              </div>
              <p className="mt-4 text-slate-400 text-sm">Doar scorul și o scurtă descriere.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {["Scor Oficial IQ", "Scurtă Descriere", "Acces Digital Imediat"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-5 h-5 text-slate-500" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscription("price_1ShaJN0etceVo13ExQs5Ds3I")}
              disabled={loading !== null}
              className="w-full py-4 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all"
            >
              {loading === "price_1ShaJN0etceVo13ExQs5Ds3I" ? "Procesare..." : "Deblochează Basic"}
            </button>
          </div>

          {/* PRO PLAN (RECOMMENDED) */}
          <div className="relative p-1 rounded-2xl bg-gradient-to-b from-cyan-500 to-blue-600 shadow-2xl shadow-blue-900/40 transform md:-translate-y-4">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg uppercase tracking-wider flex items-center gap-2">
              <Star className="w-4 h-4 fill-white" /> Recomandat
            </div>
            
            <div className="bg-slate-900 rounded-xl p-8 h-full flex flex-col relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

              <div className="mb-6 relative z-10">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  Full Certified Report
                </h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">$14.99</span>
                  <span className="text-slate-500 line-through text-lg">$29.99</span>
                </div>
                <p className="mt-4 text-slate-300">Analiză completă, Diplomă și Certificare.</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1 relative z-10">
                {[
                  "Scorul Oficial IQ (Certificat)",
                  "Analiză Cognitivă Detaliată (15 pagini)",
                  "Certificat PDF de Înaltă Rezoluție",
                  "Comparație cu Media Globală",
                  "Potrivit pentru CV & LinkedIn"
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 font-medium">
                    <div className="bg-blue-500/20 p-1 rounded-full">
                      <Check className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-slate-200">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscription("price_1ShaKA0etceVo13E6AoQ0oHq")}
                disabled={loading !== null}
                className="w-full py-5 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {loading === "price_1ShaKA0etceVo13E6AoQ0oHq" ? (
                  "Se procesează..." 
                ) : (
                  <>Obține Raportul Complet <ChevronRight className="w-5 h-5" /></>
                )}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4" /> Plată Securizată SSL • Garanție 30 de zile
              </div>
            </div>
          </div>

        </div>

        {/* Social Proof / Trust Badges */}
        <div className="mt-20 pt-10 border-t border-slate-800 text-center">
            <p className="text-slate-500 mb-6 uppercase tracking-widest text-xs">Metode de plată acceptate</p>
            <div className="flex justify-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all">
                {/* Aici poți pune imagini cu Visa/Mastercard dacă ai, sau text simplu */}
                <span className="text-2xl font-bold font-serif text-slate-400">VISA</span>
                <span className="text-2xl font-bold font-serif text-slate-400">Mastercard</span>
                <span className="text-2xl font-bold font-serif text-slate-400">Apple Pay</span>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Se încarcă oferta...</div>}>
      <PricingContent />
    </Suspense>
  );
}