import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
// 1. Aici importăm noul Footer
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "CogniTest - Professional IQ Assessment",
  description: "Unlock your true cognitive potential with our scientifically-backed IQ assessment",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro" className="dark">
      {/* Am adăugat clase pentru a împinge footer-ul jos */}
      <body className="bg-slate-950 min-h-screen flex flex-col">
        <Navbar />
        
        {/* flex-grow face ca acest div să ocupe tot spațiul liber */}
        <div className="pt-16 flex-grow">
          {children}
        </div>

        {/* 2. Aici afișăm Footer-ul pe toate paginile */}
        <Footer />
      </body>
    </html>
  )
}