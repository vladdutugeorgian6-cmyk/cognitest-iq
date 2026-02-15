export default function TermsPage() {
  const lastUpdate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Termeni și Condiții</h1>
        <p className="text-sm text-slate-500 mb-10">Ultima actualizare: {lastUpdate}</p>

        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">1. Natura Serviciului (Disclaimer)</h2>
            <p>
              CogniTest este o platformă digitală care oferă evaluări ale coeficientului de inteligență în scopuri <strong>recreaționale, de divertisment și autocunoaștere</strong>. 
            </p>
            <p className="mt-2 font-medium text-white italic">
              Rezultatele obținute nu constituie un diagnostic clinic sau psihologic oficial și nu sunt recunoscute ca atare de instituții medicale sau guvernamentale.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Politica de Plată și Rambursare</h2>
            <p>
              Accesul la scorul complet și la raportul PDF se face contra cost. Plata este procesată securizat prin Stripe.
            </p>
            <div className="mt-4 p-4 border border-red-900/30 bg-red-900/10 rounded-lg">
              <p className="font-bold text-white">Dreptul la retragere:</p>
              <p className="mt-2 text-slate-400">
                Conform OUG 34/2014 privind drepturile consumatorilor, furnizarea de conținut digital care nu este livrat pe un suport material se consideră prestată complet în momentul în care utilizatorul primește acces la rezultat. 
                <strong> Prin efectuarea plății, sunteți de acord cu începerea furnizării imediate a conținutului digital și confirmați că vă pierdeți dreptul de retragere (refund).</strong>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Proprietate Intelectuală</h2>
            <p>
              Întreg conținutul (întrebări, grafică, algoritmi) aparține CogniTest. Este interzisă copierea, reproducerea sau distribuirea conținutului plătit fără acordul nostru scris.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Contact Legal</h2>
            <p>
              Pentru orice nelămurire legată de acești termeni, ne puteți contacta la: 
              <span className="text-cyan-400 font-bold ml-1">cognitest.official@gmail.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}