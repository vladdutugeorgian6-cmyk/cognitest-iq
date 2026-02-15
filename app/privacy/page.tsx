export default function PrivacyPage() {
  const lastUpdate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Politica de Confidențialitate</h1>
        <p className="text-sm text-slate-500 mb-10">Ultima actualizare: {lastUpdate}</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Ce date colectăm?</h2>
            <p>Colectăm minimul de date necesar pentru funcționarea serviciului:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li><strong>Răspunsurile la test:</strong> Pentru a calcula scorul IQ.</li>
              <li><strong>Adresa de email:</strong> Doar în momentul plății, pentru a livra raportul și factura.</li>
              <li><strong>Date tehnice:</strong> Browser, tip dispozitiv (pentru optimizarea experienței vizuale).</li>
            </ul>
          </section>

          <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-4">2. Procesarea Plăților</h2>
            <p>
              <strong>Siguranța dumneavoastră este prioritară.</strong> CogniTest nu stochează și nu are acces la datele cardului bancar. Toate tranzacțiile sunt procesate prin <strong>Stripe</strong>, utilizând tehnologia 3D Secure și criptare PCI-DSS Level 1.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Drepturile Dumneavoastră</h2>
            <p>
              În conformitate cu GDPR, aveți dreptul de a solicita accesul la datele dumneavoastră, rectificarea sau ștergerea acestora („dreptul de a fi uitat”). Pentru orice solicitare, scrieți-ne la 
              <span className="text-cyan-400 font-bold ml-1">cognitest.official@gmail.com</span>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Cookies</h2>
            <p>
              Folosim module cookie esențiale pentru a menține progresul testului în curs (Autosave). Nu folosim cookie-uri de urmărire agresivă în scopuri de publicitate terță.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}