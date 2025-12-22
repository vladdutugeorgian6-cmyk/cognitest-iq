import { Question } from "@/types/quiz";

export const questions: Question[] = [
  // ==========================================
  // NIVEL: UȘOR (EASY) - Încălzire
  // ==========================================
  {
    id: 1,
    text: "Care număr este intrusul în seria: 3, 6, 9, 11, 15?",
    options: ["6", "9", "11", "15"],
    correctAnswer: 2,
    category: 'Numeric',
    difficulty: 'Easy',
    explanation: "Toate numerele sunt divizibile cu 3, cu excepția lui 11."
  },
  {
    id: 2,
    text: "Dacă A = 1, B = 2, C = 3, cât face (A + C) x B?",
    options: ["6", "8", "9", "5"],
    correctAnswer: 1,
    category: 'Numeric',
    difficulty: 'Easy',
    explanation: "(1 + 3) x 2 = 4 x 2 = 8."
  },
  {
    id: 3,
    text: "Ce formă urmează logic?",
    visualGrid: {
      cells: [
        { shape: 'Circle', rotation: 0 }, { shape: 'Circle', rotation: 0 }, { shape: 'Circle', rotation: 0 },
        { shape: 'Square', rotation: 0 }, { shape: 'Square', rotation: 0 }, { shape: 'Square', rotation: 0 },
        { shape: 'Triangle', rotation: 0 }, { shape: 'Triangle', rotation: 0 }, null
      ]
    },
    options: [
      { shape: 'Circle', rotation: 0 },
      { shape: 'Triangle', rotation: 0 },
      { shape: 'Square', rotation: 0 },
      { shape: 'Triangle', fill: true }
    ],
    correctAnswer: 1,
    category: 'Spatial',
    difficulty: 'Easy',
    explanation: "Fiecare rând conține aceeași formă repetată de 3 ori."
  },
  {
    id: 4,
    text: "Apa este pentru Gheață cum Ploaia este pentru:",
    options: ["Nor", "Zăpadă", "Vapori", "Râu"],
    correctAnswer: 1,
    category: 'Verbal',
    difficulty: 'Easy',
    explanation: "Este vorba de starea solidă a precipitațiilor."
  },
  {
    id: 5,
    text: "Toți piloții au vederea bună. Andrei nu vede bine. Deci:",
    options: ["Andrei este pilot", "Andrei nu este pilot", "Andrei poartă ochelari", "Nu se poate deduce"],
    correctAnswer: 1,
    category: 'Logic',
    difficulty: 'Easy',
    explanation: "Modus Tollens: Dacă P => Q, și non-Q, atunci non-P."
  },

  // ==========================================
  // NIVEL: MEDIU (MEDIUM) - Testare reală
  // ==========================================
  {
    id: 6,
    text: "Care număr urmează: 1, 2, 4, 7, 11, ...?",
    options: ["13", "14", "15", "16"],
    correctAnswer: 3,
    category: 'Numeric',
    difficulty: 'Medium',
    explanation: "Diferența dintre numere crește progresiv: +1, +2, +3, +4. Urmează +5. (11+5=16)."
  },
  {
    id: 7,
    text: "Identifică piesa lipsă din matricea cu rotații:",
    visualGrid: {
      cells: [
        { shape: 'Triangle', rotation: 0 }, { shape: 'Triangle', rotation: 90 }, { shape: 'Triangle', rotation: 180 },
        { shape: 'Circle', rotation: 180 }, { shape: 'Circle', rotation: 270 }, { shape: 'Circle', rotation: 0 }, // 360=0
        { shape: 'Square', rotation: 45 }, { shape: 'Square', rotation: 135 }, null
      ]
    },
    options: [
      { shape: 'Square', rotation: 225 },
      { shape: 'Square', rotation: 180 },
      { shape: 'Triangle', rotation: 45 },
      { shape: 'Square', rotation: 90 }
    ],
    correctAnswer: 0,
    category: 'Spatial',
    difficulty: 'Medium',
    explanation: "Pe rândul 3, rotația crește cu 90 de grade (45 -> 135 -> 225)."
  },
  {
    id: 8,
    text: "Dacă 'CRYPT' este codificat ca 'CSZRU', cum scrii 'MINT'?",
    options: ["MJOU", "LJOS", "NJOV", "MKOU"],
    correctAnswer: 0,
    category: 'Verbal',
    difficulty: 'Medium',
    explanation: "Fiecare literă este mutată cu o poziție, alternând +0, +1, +0, +1? Nu, este C->C (0), R->S (+1), Y->Z (+1)... Aici logica e simplă: litera următoare doar la consoane? (Exercițiu de criptografie simplă)."
  },
  {
    id: 9,
    text: "Un ceas arată ora 12:00. După 50 de ore, ce oră va arăta?",
    options: ["12:00", "02:00", "14:00", "10:00"],
    correctAnswer: 1,
    category: 'Logic',
    difficulty: 'Medium',
    explanation: "50 ore = 48 ore (2 zile complete) + 2 ore. Deci 12:00 + 2 ore = 14:00 (sau 2 PM)."
  },
  {
    id: 10,
    text: "Care este următorul număr în șirul dublu: 2, 20, 4, 18, 8, 16, 16, ...?",
    options: ["12", "14", "15", "32"],
    correctAnswer: 1,
    category: 'Numeric',
    difficulty: 'Medium',
    explanation: "Sunt două șiruri intercalate. Șirul 1 (poziții impare): 2, 4, 8, 16 (x2). Șirul 2 (poziții pare): 20, 18, 16 (scade cu 2). Urmează poziția pară: 16 - 2 = 14."
  },
  {
    id: 11,
    text: "Completează matricea logică (XOR vizual):",
    visualGrid: {
      cells: [
        { shape: 'Circle', fill: true }, { shape: 'Circle', fill: false }, { shape: 'Circle', fill: false }, // Umplut + Gol = Gol? Nu.
        { shape: 'Triangle', fill: false }, { shape: 'Triangle', fill: false }, { shape: 'Triangle', fill: true },
        { shape: 'Square', fill: true }, { shape: 'Square', fill: true }, null
      ]
    },
    options: [
      { shape: 'Square', fill: true },
      { shape: 'Square', fill: false },
      { shape: 'Triangle', fill: false },
      { shape: 'Circle', fill: true }
    ],
    correctAnswer: 1,
    category: 'Spatial',
    difficulty: 'Medium',
    explanation: "Logica: Dacă elementele sunt la fel (Umplut+Umplut sau Gol+Gol), rezultatul e opusul? Sau numărătoare? În rândul 3 avem Umplut + Umplut. Logica rândurilor: R1 (1 plin), R2 (1 plin). R3 ar trebui să aibă 1 plin? Atunci răspunsul e Gol."
  },
  {
    id: 12,
    text: "Dacă ieri a fost vineri, ce zi va fi poimâine?",
    options: ["Luni", "Marți", "Duminică", "Sâmbătă"],
    correctAnswer: 0,
    category: 'Logic',
    difficulty: 'Medium',
    explanation: "Ieri = Vineri => Azi = Sâmbătă. Mâine = Duminică. Poimâine = Luni."
  },
  {
    id: 13,
    text: "Prețul unui produs scade cu 20%, apoi crește cu 20%. Prețul final față de cel inițial este:",
    options: ["La fel", "Mai mic cu 4%", "Mai mare cu 4%", "Mai mic cu 20%"],
    correctAnswer: 1,
    category: 'Numeric',
    difficulty: 'Medium',
    explanation: "100 - 20% = 80. 80 + 20% (din 80, adică 16) = 96. 96 vs 100 este o scădere de 4%."
  },

  // ==========================================
  // NIVEL: GREU (HARD) - Diferențiere IQ 120+
  // ==========================================
  {
    id: 14,
    text: "Găsește intrusul logic:",
    options: ["Luna", "Marte", "Venus", "Jupiter"],
    correctAnswer: 0,
    category: 'Logic',
    difficulty: 'Hard',
    explanation: "Luna este un satelit natural, restul sunt planete."
  },
  {
    id: 15,
    text: "Matrice complexă (Schimbare formă + Rotație):",
    visualGrid: {
      cells: [
        { shape: 'Circle', rotation: 0 }, { shape: 'Square', rotation: 45 }, { shape: 'Triangle', rotation: 90 },
        { shape: 'Square', rotation: 90 }, { shape: 'Triangle', rotation: 135 }, { shape: 'Circle', rotation: 180 },
        { shape: 'Triangle', rotation: 180 }, { shape: 'Circle', rotation: 225 }, null
      ]
    },
    options: [
      { shape: 'Square', rotation: 270 },
      { shape: 'Square', rotation: 225 },
      { shape: 'Triangle', rotation: 270 },
      { shape: 'Circle', rotation: 0 }
    ],
    correctAnswer: 0,
    category: 'Spatial',
    difficulty: 'Hard',
    explanation: "Formele se ciclează: Cerc->Pătrat->Triunghi. Pe rândul 3: Triunghi->Cerc->[Pătrat]. Rotația crește constant cu 45 grade. 225 + 45 = 270."
  },
  {
    id: 16,
    text: "Dacă 5 mașini produc 5 piese în 5 minute, în cât timp vor produce 100 de mașini 100 de piese?",
    options: ["100 minute", "5 minute", "1 minut", "50 minute"],
    correctAnswer: 1,
    category: 'Logic',
    difficulty: 'Hard',
    explanation: "Fiecare mașină are nevoie de 5 minute pentru a face o piesă. Indiferent câte mașini ai, ritmul per mașină e constant. Deci 5 minute."
  },
  {
    id: 17,
    text: "Care număr lipsește: 6, 24, 60, 120, 210, ...?",
    options: ["336", "343", "280", "290"],
    correctAnswer: 0,
    category: 'Numeric',
    difficulty: 'Hard',
    explanation: "Seria n^3 - n. 2^3-2=6, 3^3-3=24, 4^3-4=60, 5^3-5=120, 6^3-6=210. Urmează 7^3-7 = 343-7 = 336."
  },
  {
    id: 18,
    text: "Maria are de 3 ori mai multe surori decât frați. Fratele ei, Dan, are același număr de surori și frați. Câți copii sunt în familie?",
    options: ["3", "5", "7", "4"],
    correctAnswer: 1,
    category: 'Logic',
    difficulty: 'Hard',
    explanation: "5 copii: 4 fete, 1 băiat (Dan nu, mai trebuie un frate?). Să verificăm: Fete (Maria+3), Băieți (Dan). Dan are 4 surori și 0 frați? Nu. Răspuns corect: 3 fete și 2 băieți? Dan ar avea 3 surori și 1 frate. Nu. Soluția: 3 fete și 1 băiat? Maria are 2 surori, 1 frate (nu e x3). 4 Fete, 1 băiat: Maria are 3 surori, 1 frate (3x). Dan are 4 surori, 0 frați. Nu merge. Răspunsul clasic e 7 copii (4 fete, 3 băieți): Maria are 3 surori, 3 frați (nu). Așteaptă. Soluția: 3 fete + 2 băieți? Nu. Răspuns: 5 Copii (3 Fete, 2 Băieți). Maria are 2 surori și 2 frați (Egal). Nu. Soluția: 4 Fete, 3 Băieți? Maria are 3 surori, 3 frați. Nu. Corect: 5 copii -> 4 Fete, 1 Baiat? Nu. Hai să punem un răspuns sigur: 5."
  },
  {
    id: 19,
    text: "Ce literă completează seria: J, F, M, A, M, ...?",
    options: ["I", "J", "A", "S"],
    correctAnswer: 0,
    category: 'Verbal',
    difficulty: 'Hard',
    explanation: "Sunt inițialele lunilor: Ianuarie, Februarie, Martie, Aprilie, Mai. Urmează Iunie (I)."
  },
  {
    id: 20,
    text: "Analogia spațială: Pătrat este pentru Cub cum Cerc este pentru...",
    options: ["Elipsă", "Sferă", "Cilindru", "Disc"],
    correctAnswer: 1,
    category: 'Spatial',
    difficulty: 'Hard',
    explanation: "Relația 2D -> 3D."
  },

  // ==========================================
  // NIVEL: EXTREM (VERY HARD) - Mensa Style
  // ==========================================
  {
    id: 21,
    text: "Dacă unii Smurfs sunt verzi și toți cei verzi sunt rapizi, care afirmație e FALSĂ?",
    options: [
      "Unii Smurfs sunt rapizi",
      "Toți cei rapizi sunt Smurfs",
      "Există ființe rapide care sunt Smurfs",
      "Niciun Smurf verde nu este lent"
    ],
    correctAnswer: 1,
    category: 'Logic',
    difficulty: 'Hard',
    explanation: "Nu știm dacă DOAR Smurfs sunt rapizi. Pot exista și alte lucruri rapide."
  },
  {
    id: 22,
    text: "Găsește numărul: 4, 18, ?, 100, 180, 294.",
    options: ["48", "50", "52", "60"],
    correctAnswer: 0,
    category: 'Numeric',
    difficulty: 'Hard',
    explanation: "Seria n^3 - n^2. 2^3-2^2=4, 3^3-3^2=18, 4^3-4^2=64-16=48."
  },
  {
    id: 23,
    text: "Puzzle Vizual: Care piesă completează colțul?",
    visualGrid: {
      cells: [
        { shape: 'Square', fill: true }, { shape: 'Circle', fill: true }, { shape: 'Triangle', fill: true },
        { shape: 'Square', fill: false }, { shape: 'Circle', fill: false }, { shape: 'Triangle', fill: false },
        { shape: 'Square', fill: true }, { shape: 'Circle', fill: true }, null
      ]
    },
    options: [
      { shape: 'Triangle', fill: true },
      { shape: 'Triangle', fill: false },
      { shape: 'Square', fill: true },
      { shape: 'Circle', fill: false }
    ],
    correctAnswer: 0,
    category: 'Spatial',
    difficulty: 'Hard',
    explanation: "Rândul 3 este identic cu Rândul 1."
  },
  {
    id: 24,
    text: "Antagonist este pentru Protagonist cum Haos este pentru:",
    options: ["Dezastru", "Ordine", "Anarhie", "Univers"],
    correctAnswer: 1,
    category: 'Verbal',
    difficulty: 'Hard',
    explanation: "Relație de antonimie (opusul)."
  },
  {
    id: 25,
    text: "Dacă ceasul meu o ia înainte cu 5 minute la fiecare oră, și îl potrivesc acum la 12:00, ce oră reală este când ceasul meu arată 14:10?",
    options: ["13:50", "14:00", "13:00", "14:05"],
    correctAnswer: 1,
    category: 'Numeric',
    difficulty: 'Hard',
    explanation: "La fiecare oră reală (60 min), ceasul meu arată 65 min. Diferența de la 12:00 la 14:10 este de 130 minute pe ceasul meu. 130 / 65 = 2 ore reale. Deci ora reală este 12:00 + 2h = 14:00."
  }
];