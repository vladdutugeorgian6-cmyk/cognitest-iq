import { Mail, MessageCircle, Clock, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center shadow-2xl relative overflow-hidden">
        {/* Decoratiune vizuala in fundal */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-cyan-900/30 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/20">
              <MessageCircle className="w-8 h-8" />
          </div>

          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Suport Clienți
          </h1>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            Echipa noastră este aici să te ajute cu orice întrebare legată de testul IQ, rezultate sau plăți.
          </p>
          
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center gap-3 group hover:border-cyan-500/30 transition-colors">
            <Mail className="w-6 h-6 text-cyan-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs text-slate-500 uppercase tracking-[0.2em] font-semibold">Email Oficial</span>
            
            <a 
              href="mailto:cognitest.official@gmail.com" 
              className="text-lg md:text-xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors break-all"
            >
              cognitest.official@gmail.com
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-1">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-[10px] text-slate-500 uppercase">Răspuns rapid</span>
              <span className="text-xs font-medium text-slate-300">Sub 24 ore</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span className="text-[10px] text-slate-500 uppercase">Securitate</span>
              <span className="text-xs font-medium text-slate-300">Suport Criptat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}