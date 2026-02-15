"use client"

import { motion } from "framer-motion"
import { Brain } from "lucide-react"
import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Click pe el duce acasă */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Brain className="h-7 w-7 text-cyan-400" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              CogniTest
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {/* Link simplu, stilizat manual, fără erori de TypeScript */}
            <Link 
              href="/pricing"
              className="text-slate-400 hover:text-white hover:bg-slate-800/50 text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              Pricing
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}