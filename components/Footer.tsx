import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 text-sm text-slate-500">
        
        {/* Logo & Copyright */}
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="font-bold text-slate-300">CogniTest™</span>
          <span>© {currentYear} Toate drepturile rezervate.</span>
        </div>

        {/* Link-uri Legale (Obligatorii pentru plăți) */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">
            Termeni și Condiții
          </Link>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
            Politica de Confidențialitate
          </Link>
          <Link href="/contact" className="hover:text-cyan-400 transition-colors">
            Contact
          </Link>
        </div>

        {/* Disclaimer (Te protejează legal) */}
        <div className="text-xs text-slate-600 text-center md:text-right max-w-xs">
          Acest test este destinat scopurilor educaționale și de divertisment.
        </div>
      </div>
    </footer>
  );
}