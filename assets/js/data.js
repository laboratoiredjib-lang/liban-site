/* ==========================================================================
   Contenu du site : toutes les rubriques sont rendues par main.js à partir d'ici.
   Pour modifier un texte, une publication ou un doctorant, il suffit d'éditer ce fichier.
   ========================================================================== */

const T = String.raw; // pour écrire le LaTeX sans doubler les antislashs

const ICON = {
  epi: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="20" cy="20" r="4"/><circle cx="8" cy="10" r="2.5"/><circle cx="32" cy="12" r="2.5"/><circle cx="31" cy="31" r="2.5"/><circle cx="10" cy="30" r="2.5"/><path d="M17 17 10 12M23 17l7-3M23 23l6 6M17 23l-5 5"/></svg>`,
  digital: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="8" width="30" height="20" rx="2.5"/><path d="M14 34h12M20 28v6M11 22l5-5 4 3 7-8"/></svg>`,
  data: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><ellipse cx="20" cy="9" rx="12" ry="4.5"/><path d="M8 9v11c0 2.5 5.4 4.5 12 4.5S32 22.500 32 20V9M8 20v11c0 2.5 5.4 4.5 12 4.5S32 33.500 32 31V20"/></svg>`,
  target: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="20" cy="20" r="14"/><circle cx="20" cy="20" r="8"/><circle cx="20" cy="20" r="2"/><path d="M20 3v6M37 20h-6"/></svg>`,
  ai: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="8" cy="10" r="3"/><circle cx="8" cy="30" r="3"/><circle cx="20" cy="20" r="3"/><circle cx="32" cy="12" r="3"/><circle cx="32" cy="28" r="3"/><path d="M11 11l6 7M11 29l6-7M23 19l6-6M23 21l6 6"/></svg>`,
  people: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="20" cy="12" r="5"/><path d="M10 33c0-6 4.5-10 10-10s10 4 10 10"/><circle cx="7" cy="17" r="3"/><circle cx="33" cy="17" r="3"/></svg>`,
  climate: `<svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="28" cy="28" r="10"/><path class="draw" d="M6 40c6-10 12-10 18 0s12 10 18 0 8-6 10-8"/><path d="M28 8v6M28 42v6M8 28h6M42 28h6M14 14l4 4M38 38l4 4M42 14l-4 4M14 42l4-4"/></svg>`,
  epiLarge: `<svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6 48h44M6 48V8"/><path class="draw" d="M8 46C16 44 20 14 28 14s10 24 20 32"/><path d="M8 46c10-1 18-6 40-6" opacity=".5"/></svg>`,
  finance: `<svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 48h44M6 48V8"/><path class="draw" d="M10 38l9-10 7 6 10-16 10 6"/><circle cx="19" cy="28" r="1.5"/><circle cx="26" cy="34" r="1.5"/><circle cx="36" cy="18" r="1.5"/></svg>`
};

const SITE = {
  /* ----- Chiffres clés (tirés du CV) ----- */
  stats: [
    { n: 10, plus: true, label: "années d'expérience en modélisation, données et gestion institutionnelle" },
    { n: 6, plus: false, label: "publications scientifiques, dont une à paraître" },
    { n: 5, plus: true, label: "doctorants co-encadrés avec des universités françaises et éthiopiennes" },
    { n: 8, plus: true, label: "partenariats avec des universités et des institutions" },
    { n: 20, plus: true, label: "ateliers, séminaires et formations animés" }
  ],

  /* ----- Axes de recherche ----- */
  axes: [
    {
      id: "epi",
      title: "Modélisation épidémiologique",
      kicker: "Santé publique",
      text: "Je construis des modèles compartimentaux qui décrivent la manière dont une maladie circule dans une population, puis je les confronte aux données de terrain. À Djibouti, ces travaux ont porté sur le <strong>paludisme</strong> (Plasmodium falciparum et vivax), la <strong>COVID-19</strong> et la <strong>co-infection tuberculose et VIH</strong>. L'objectif reste le même : donner aux décideurs de santé publique des scénarios chiffrés, lisibles et fiables.",
      eqLabel: "Modèle compartimental de type SIHR",
      eq: T`\begin{cases}\dot S=-\beta\,\dfrac{S\,I}{N}\\[6pt]\dot I=\beta\,\dfrac{S\,I}{N}-(\sigma+\gamma)\,I\\[6pt]\dot H=\sigma I-\delta H\\[6pt]\dot R=\gamma I+\delta H\end{cases}`,
      eqFallback: "dS/dt = −βSI/N,  dI/dt = βSI/N − (σ+γ)I,  dH/dt = σI − δH,  dR/dt = γI + δH",
      tags: ["Paludisme", "COVID-19", "Tuberculose et VIH", "Djibouti"],
      pub: "epi", linkLabel: "Voir les publications associées"
    },
    {
      id: "sens",
      title: "Analyse de sensibilité globale",
      kicker: "Incertitude et fiabilité",
      text: "Un modèle n'est utile que si l'on sait <strong>ce qui le fait bouger</strong>. L'analyse de sensibilité globale mesure la part de l'incertitude de chaque paramètre dans l'incertitude de la sortie. C'était le cœur de ma thèse, appliquée au climat, à l'épidémiologie et à la finance, et c'est aujourd'hui un fil conducteur de tous mes travaux de modélisation.",
      eqLabel: "Indice de Sobol du premier ordre",
      eq: T`S_i=\dfrac{\operatorname{Var}\!\big(\mathbb{E}[\,Y\mid X_i\,]\big)}{\operatorname{Var}(Y)},\qquad \sum_{i=1}^{d}S_i\le 1`,
      eqFallback: "S_i = Var(E[Y | X_i]) / Var(Y),   Σ S_i ≤ 1",
      tags: ["Indices de Sobol", "Quantification d'incertitude", "Climat", "Épidémiologie"],
      pub: "sens", linkLabel: "Voir les publications associées"
    },
    {
      id: "ctrl",
      title: "Contrôle optimal et aide à la décision",
      kicker: "Stratégies d'intervention",
      text: "Une fois le modèle validé, la vraie question est : <strong>que faut-il faire, où et à quel coût</strong> ? Je recours au contrôle optimal et à l'analyse coût-efficacité pour comparer des stratégies d'intervention, par exemple contre le paludisme à Djibouti, et pour éclairer des arbitrages budgétaires concrets.",
      eqLabel: "Critère à minimiser et condition de Pontryagin",
      eq: T`\min_{u}\;J(u)=\int_0^T\!\Big(A\,I(t)+\tfrac{B}{2}\,u(t)^2\Big)\,dt,\qquad \dot\lambda=-\dfrac{\partial\mathcal H}{\partial x}`,
      eqFallback: "min J(u) = ∫₀ᵀ ( A·I(t) + B/2·u(t)² ) dt,   λ' = −∂H/∂x",
      tags: ["Pontryagin", "Coût-efficacité", "Optimisation", "Recherche opérationnelle"],
      pub: "ctrl", linkLabel: "Voir les publications associées"
    },
    {
      id: "ia",
      title: "Intelligence artificielle et science des données",
      kicker: "Apprentissage et robustesse",
      text: "Je fonde mon approche de l'intelligence artificielle sur les mathématiques : <strong>fiabilité des réseaux de neurones</strong> face aux erreurs d'annotation et aux données empoisonnées, modèles prédictifs pour la logistique portuaire, tableaux de bord décisionnels. J'ai aussi créé le premier master d'intelligence artificielle et de modélisation des données de Djibouti.",
      eqLabel: "Risque empirique avec étiquettes bruitées",
      eq: T`\widehat{\mathcal R}(\theta)=\dfrac{1}{n}\sum_{i=1}^{n}\ell\big(f_\theta(x_i),\,\tilde y_i\big)`,
      eqFallback: "R(θ) = (1/n) Σ ℓ( f_θ(xᵢ), ỹᵢ ),  avec ỹᵢ étiquettes bruitées",
      tags: ["Réseaux de neurones", "Robustesse", "Modèles prédictifs", "Master IAMD"],
      pub: "", linkLabel: "Voir l'encadrement doctoral", target: "#encadrement"
    },
    {
      id: "env",
      title: "Environnement et climat",
      kicker: "Risques côtiers et climatiques",
      text: "Le climat et le littoral djiboutiens posent des questions de modélisation très concrètes. J'ai travaillé sur la sensibilité des systèmes climatiques et je co-encadre une thèse sur l'<strong>érosion côtière</strong>, qui associe hydrodynamique, transport sédimentaire et données satellitaires pour anticiper l'évolution du trait de côte.",
      eqLabel: "Conservation de la masse, eaux peu profondes",
      eq: T`\partial_t h+\nabla\!\cdot\!\big(h\,\mathbf u\big)=0`,
      eqFallback: "∂h/∂t + ∇·(h u) = 0",
      tags: ["Climat", "Érosion côtière", "Hydrodynamique", "Simulation numérique"],
      pub: "climat", linkLabel: "Voir les publications associées"
    }
  ],

  /* ----- Publications (filtres : epi, sens, ctrl, climat) ----- */
  pubFilters: [
    { key: "all", label: "Toutes" },
    { key: "epi", label: "Épidémiologie" },
    { key: "sens", label: "Sensibilité globale" },
    { key: "ctrl", label: "Contrôle optimal" },
    { key: "climat", label: "Climat" }
  ],
  tagNames: { epi: "Épidémiologie", sens: "Sensibilité globale", ctrl: "Contrôle optimal", climat: "Climat" },
  pubs: [
    {
      year: 2026, forthcoming: true, tags: ["sens", "epi"],
      title: "Time-Dependent Intervention Modeling and Global Sensitivity Analysis of Epidemic Dynamics under Uncertainty in Resource-Limited African Settings",
      authors: "Liban Ismail, Yahyeh Souleiman, Saralees Nadarajah, Abdisalam Hassan",
      journal: "À paraître", doi: ""
    },
    {
      year: 2026, tags: ["ctrl", "epi"],
      title: "Optimal Control Strategies and Cost-Effectiveness Analysis of Malaria for Plasmodium falciparum and Plasmodium vivax in Djibouti",
      authors: "Yahyeh Souleiman, Liban Ismail, Legesse Lemecha Obsu",
      journal: "Scientific African, 31, e03262", doi: "https://doi.org/10.1016/j.sciaf.2026.e03262"
    },
    {
      year: 2024, tags: ["epi"],
      title: "Modeling and Investigating Plasmodium falciparum and Plasmodium vivax Infections: Application to Djibouti Data",
      authors: "Yahyeh Souleiman, Liban Ismail, Raluca Eftimie",
      journal: "Infectious Disease Modelling, 9(4), 1095 à 1116", doi: "https://doi.org/10.1016/j.idm.2024.05.005"
    },
    {
      year: 2024, tags: ["sens", "epi"],
      title: "Global Sensitivity Analysis in the SIHR Epidemiological Model with Application to COVID-19",
      authors: "Liban Ismail, Hacène Djellout, Cédric Chauvière",
      journal: "Journal of Statistics & Management Systems, 27(7), 1277 à 1299", doi: "https://doi.org/10.47974/JSMS-1019"
    },
    {
      year: 2023, tags: ["sens", "climat"],
      title: "Climate System: A Global Sensitivity Approach",
      authors: "Liban Ismail, Hacène Djellout, Cédric Chauvière",
      journal: "Iranian Journal of Science, 47(1), 211 à 227", doi: "https://doi.org/10.1007/s40995-022-01456-4"
    },
    {
      year: 2021, tags: ["epi"],
      title: "Analysis of the Dynamics of the SIHR Model: COVID-19 Case in Djibouti",
      authors: "Yahyeh Souleiman, Abdoulrazack Mohamed, Liban Ismail",
      journal: "Applied Mathematics, 12(10), 867 à 881", doi: "https://doi.org/10.4236/am.2021.1210058"
    }
  ],

  /* ----- Thèse ----- */
  thesis: {
    titleFr: "Analyse de sensibilité appliquée à certains modèles issus du climat, de l'épidémiologie et de la finance",
    titleEn: "Sensitivity Analysis Applied to Some Models from Climate, Epidemiology and Finance",
    meta: [
      ["Diplôme", "Doctorat en mathématiques appliquées"],
      ["Soutenance", "28 juin 2023"],
      ["Établissement", "Université Clermont Auvergne, France"],
      ["Laboratoire", "LMBP, Laboratoire de Mathématiques Blaise Pascal"],
      ["Direction", "Pr Hacène Djellout"],
      ["Jury", "Pr Pierre Druilhet (président), Pr Frédéric Proïa et Pr Raluca Eftimie (rapporteurs)"]
    ],
    link: "https://share.google/lt1kbvm5vQZoReESa",
    eq: T`S_i=\dfrac{\operatorname{Var}\!\big(\mathbb{E}[\,Y\mid X_i\,]\big)}{\operatorname{Var}(Y)}`,
    pillars: [
      { icon: "climate", title: "Climat", text: "Quels paramètres dominent la réponse d'un système climatique ?" },
      { icon: "epiLarge", title: "Épidémiologie", text: "Quelle part d'incertitude vient du taux de transmission, de la guérison, des interventions ?" },
      { icon: "finance", title: "Finance", text: "Comment le risque se propage-t-il dans un modèle quantitatif ?" }
    ]
  },

  /* ----- Doctorants co-encadrés ----- */
  students: [
    { name: "Ali Mohamed", photo: "ali.jpg", uni: "Université La Rochelle, LMIA", since: "Depuis 2024",
      topic: "Méthodes multi-échelles pour le contrôle et l'approximation numérique des équations aux dérivées partielles, avec application à l'équation des ondes.",
      dir: "S. Kadri-Harouna et Kaïs Ammari" },
    { name: "Hakim Amer", photo: "hakim.jpg", uni: "Université de Toulon", since: "Depuis 2025",
      topic: "Modélisation hydrodynamique et sédimentaire de l'érosion côtière, avec application au littoral djiboutien.",
      dir: "Mehmet Ersoy" },
    { name: "Ismail Abdillahi", photo: "ismail.jpg", uni: "Université Clermont Auvergne", since: "Depuis 2026",
      topic: "Fiabilité des réseaux de neurones face aux erreurs d'annotation, aux biais de labellisation et aux attaques par empoisonnement des données.",
      dir: "Andrzej Stos et Thierry Chateau" },
    { name: "Mohamed Ismael Dini", photo: "dini.jpg", uni: "Adama Science and Technology University", since: "Depuis 2026",
      topic: "Modélisation spatio-épidémiologique du paludisme à Djibouti-ville : facteurs sociodémographiques et analyse spatio-temporelle.",
      dir: "Legesse Lemecha" },
    { name: "Abdourahman Djama Guedi", photo: "guedi.jpg", uni: "Adama Science and Technology University", since: "Depuis 2026",
      topic: "Épidémiologie de la brucellose humaine chez les populations à risque à Djibouti : séroprévalence et facteurs de risque.",
      dir: "Legesse Lemecha" }
  ],

  /* ----- Réseau ----- */
  network: {
    row1: [
      { name: "Université Clermont Auvergne", logo: "assets/img/partners/clermont_auvergne.jpeg", url: "https://www.uca.fr/" },
      { name: "Université de Toulon", logo: "assets/img/partners/toulon.png", url: "https://www.univ-tln.fr/" },
      { name: "Université La Rochelle", logo: "assets/img/partners/la_rochelle.png", url: "https://www.univ-larochelle.fr/" },
      { name: "Université Marie et Louis Pasteur", logo: "assets/img/partners/marie_louis_pasteur.png", url: "https://www.umlp.fr/" },
      { name: "Université Savoie Mont Blanc", logo: "assets/img/partners/savoie.svg", url: "https://www.univ-smb.fr/" },
      { name: "Adama Science and Technology University", logo: "assets/img/partners/adama.png", url: "https://www.astu.edu.et/" },
      { name: "University of Mogadishu", logo: "assets/img/partners/mogadishu.png", url: "https://mu.edu.so/" }
    ],
    row2: [
      { name: "ACE-CEALT" },
      { name: "INSTAD", logo: "assets/img/partners/instad.png", url: "https://instad.dj/" },
      { name: "MENFOP" },
      { name: "MENSUR" },
      { name: "ANSIE", logo: "assets/img/partners/ansie.png", url: "https://www.ansie.dj/" },
      { name: "SGTD Doraleh Container Terminal", logo: "assets/img/partners/sgtd.png", url: "https://www.sgtd-terminal.com/" },
      { name: "Salaam African Bank", logo: "assets/img/partners/salaam.png", url: "https://www.banksalaam.com/" },
      { name: "PNUD", logo: "assets/img/partners/undp.png", url: "https://www.undp.org/fr/djibouti" },
      { name: "Agence Universitaire de la Francophonie", url: "https://www.auf.org/" }
    ]
  },

  /* ----- Enseignement ----- */
  iamd: {
    tagline: "Fondateur et coordinateur académique, depuis 2025",
    title: "Master Intelligence Artificielle et Modélisation des Données",
    text: "J'ai conçu et je coordonne le premier master de Djibouti consacré à l'intelligence artificielle et à la modélisation des données. Il associe mathématiques, science des données, aide à la décision et technologies numériques, avec des universités partenaires en France et en Turquie. Il forme les premières promotions de spécialistes du numérique du pays.",
    tracks: [
      ["Parcours 1", "Modélisation mathématique et optimisation"],
      ["Parcours 2", "Science des données et intelligence décisionnelle"]
    ]
  },
  courses: [
    { level: "Master 1 IAMD", title: "Outils mathématiques pour les données",
      text: "Les fondements mathématiques de la manipulation, de l'analyse et de la modélisation des données : espaces vectoriels, algèbre linéaire et méthodes d'optimisation." },
    { level: "Master 1 MPM", title: "Modélisation statistique et analyse de données",
      text: "Statistique avancée, inférence, régression et analyse exploratoire, avec des applications concrètes en sciences de l'ingénieur et en science des données." }
  ],
  lab: {
    name: "LAMO",
    text: "Laboratoire d'Analyse, de Modélisation et d'Optimisation, rattaché au Centre de Recherche en Mathématiques et Numérique de l'Université de Djibouti. Deux équipes : Systèmes dynamiques et contrôle, Stochastique et sciences des données."
  },

  /* ----- Expertise ----- */
  expertise: [
    { icon: "digital", title: "Transformation numérique", text: "Évaluation et renforcement des systèmes d'information, des processus et des outils numériques des institutions publiques et académiques." },
    { icon: "data", title: "Gouvernance et analyse des données", text: "Qualité des données, interopérabilité, analyse désagrégée par genre, tableaux de bord décisionnels avec Power BI, Python, R et SQL." },
    { icon: "target", title: "Gestion axée sur les résultats", text: "Cadres de résultats, indicateurs de performance, dispositifs de suivi et d'évaluation au service de la redevabilité institutionnelle." },
    { icon: "ai", title: "IA et analytique avancée", text: "Apprentissage automatique, modèles prédictifs et optimisation pour des décisions complexes, de la santé à la logistique." },
    { icon: "people", title: "Renforcement des capacités", text: "Formation, transfert de connaissances et encadrement pour installer durablement des compétences dans les institutions." }
  ],
  missions: [
    { when: "Depuis 2025", title: "Co-infection tuberculose et VIH à Djibouti", text: "Coordination scientifique d'un projet de modélisation de la dynamique de transmission et des stratégies optimales de contrôle.", who: "Agence Universitaire de la Francophonie, environ 29 500 USD" },
    { when: "Avril 2024 à mars 2025", title: "Optimisation d'entrepôt et prévision d'occupation", text: "Deux missions de conseil : cadres d'indicateurs pour la gestion des stocks, puis modèles prédictifs de l'occupation du terminal pour anticiper la congestion.", who: "SGTD, Doraleh Container Terminal" },
    { when: "2022 à 2024", title: "Projet MoMathEpiDji", text: "Coordination d'un projet de modélisation mathématique des maladies infectieuses, avec les laboratoires de mathématiques de Clermont Auvergne et de Besançon.", who: "ACE-CEALT, environ 30 000 USD" },
    { when: "Septembre 2023", title: "Analyse de données et modélisation", text: "Expertise statistique pour un projet de développement : traitement de données, méthodes analytiques et appui à la planification.", who: "INSTAD, financement Banque mondiale" },
    { when: "Avril à août 2020", title: "Riposte nationale à la COVID-19", text: "Modèles épidémiologiques et scénarios d'intervention pour éclairer les décisions du ministère de la Santé.", who: "ACE-CEALT, ministère de la Santé" }
  ],

  /* ----- Parcours ----- */
  timeline: [
    { y: "2013", sub: "à 2014", t: "Licence de mathématiques fondamentales", d: "Université de Djibouti." },
    { y: "2014", sub: "à 2015", t: "Master de mathématiques appliquées", d: "Université Joseph Fourier, aujourd'hui Université Grenoble Alpes." },
    { y: "2015", sub: "à 2016", t: "Master de mathématiques appliquées", d: "Université Clermont Auvergne." },
    { y: "2019", sub: "à 2023", t: "Doctorat en mathématiques appliquées", d: "Analyse de sensibilité et modélisation de systèmes complexes, Université Clermont Auvergne. Soutenance le 28 juin 2023.", major: true },
    { y: "2020", sub: "avril à août", t: "Expert en modélisation de la COVID-19", d: "Modèles épidémiologiques pour le ministère de la Santé, avec l'ACE-CEALT." },
    { y: "2022", sub: "à 2024", t: "Coordinateur du projet MoMathEpiDji", d: "Collaboration scientifique entre Djibouti et la France sur la modélisation des maladies infectieuses." },
    { y: "2023", sub: "", t: "Maître de conférences en mathématiques appliquées", d: "Université de Djibouti : recherche, enseignement et encadrement doctoral.", major: true },
    { y: "2024", sub: "", t: "Directeur du LAMO", d: "Direction stratégique du Laboratoire d'Analyse, de Modélisation et d'Optimisation, de ses équipes, de ses doctorants et de ses partenariats internationaux.", major: true },
    { y: "2025", sub: "", t: "Fondation du Master IAMD", d: "Premier master d'intelligence artificielle et de modélisation des données de Djibouti. Début de l'expertise scientifique pour des revues Springer Nature." },
    { y: "2026", sub: "", t: "Nouvelles cotutelles de thèse", d: "Co-encadrement de doctorats avec Clermont Auvergne et Adama Science and Technology University, sur l'intelligence artificielle fiable et l'épidémiologie." }
  ],

  /* ----- Contact ----- */
  contact: [
    ["Courriel", `<a href="mailto:liban_ismail_abdillahi@univ.edu.dj">liban_ismail_abdillahi@univ.edu.dj</a>`],
    ["Laboratoire", `<a href="mailto:lamo@univ.edu.dj">lamo@univ.edu.dj</a>`],
    ["Adresse", "Université de Djibouti, Campus de Balbala, Croisement RN2 RN5, Djibouti"],
    ["Profils", `<a href="https://scholar.google.com/citations?user=jnxjCzAAAAAJ&hl=fr" target="_blank" rel="noopener">Google Scholar</a>`]
  ],

  /* ----- Curriculum vitae ----- */
  cv: {
    file: "assets/docs/CV_Liban_Ismail_Abdillahi.pdf",
    summary: [
      ["Poste actuel", "Maître de conférences en mathématiques appliquées, Université de Djibouti"],
      ["Direction", "Directeur du Laboratoire d'Analyse, de Modélisation et d'Optimisation (LAMO)"],
      ["Formation", "Fondateur et coordinateur académique du Master Intelligence Artificielle et Modélisation des Données"],
      ["Doctorat", "Mathématiques appliquées, Université Clermont Auvergne, 2023"],
      ["Domaines", "Transformation numérique, gouvernance des données, intelligence artificielle, gestion axée sur les résultats"],
      ["Disponibilité", "Missions d'assistance technique internationales"]
    ],
    skills: [
      ["Programmation et calcul", ["Python", "R", "SQL", "MATLAB"]],
      ["Business intelligence", ["Power BI", "Excel avancé", "Tableaux de bord", "Indicateurs de performance"]],
      ["Méthodes", ["Modélisation mathématique", "Analyse de sensibilité", "Contrôle optimal", "Statistique", "Apprentissage automatique", "Simulation numérique"]]
    ],
    languages: [
      { name: "Somali", level: "Langue maternelle", dots: 5 },
      { name: "Français", level: "Courant professionnel", dots: 4 },
      { name: "Anglais", level: "Courant professionnel", dots: 4 },
      { name: "Arabe", level: "Professionnel", dots: 3 }
    ]
  }
};
