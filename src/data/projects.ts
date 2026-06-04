export interface ProjectCredentials {
  login: string
  password: string
  note?: string
}

export interface ProjectDetail {
  highlights: string[]
  credentials?: ProjectCredentials
  stackTable?: { layer: string; tech: string }[]
}

export interface Project {
  id: number
  title: string
  subtitle: string
  desc: string
  tags: string[]
  github: string
  live: string
  featured: boolean
  color: string
  year: string
  screenshotFile?: string
  detail?: ProjectDetail
}

export const PROJECTS: Project[] = [
  {
    id: 0,
    title: 'Logiciel Matériel',
    subtitle: 'Gestion de stock sportif — Full-stack',
    desc: 'Application web complète de gestion d\'inventaire développée pour une association sportive, permettant de suivre le matériel réparti sur plusieurs sites géographiques.',
    tags: ['React 19', 'Node.js', 'Express', 'SQLite', 'Docker', 'JWT', 'Vite', 'Tailwind'],
    github: 'https://github.com/Jeloumy/logiciel-materiel',
    live: 'https://frontend-mu-pearl-96.vercel.app',
    featured: true,
    color: '#38bdf8',
    year: '2025',
    screenshotFile: 'logiciel-materiel',
    detail: {
      highlights: [
        'Tableau de bord KPI temps réel — valeur totale du stock, alertes de seuils critiques, articles en stock bas',
        'Gestion des articles — catalogue complet avec références, catégories, fournisseurs et prix unitaires',
        'Inventaire multi-sites — suivi des quantités par site avec seuils minimum configurables',
        'Bons de commande Kanban : En cours → Validé → Reçu / Annulé, mise à jour automatique du stock à la réception',
        'Export PDF & CSV — inventaires par site et catalogue complet',
        '3 rôles : Admin, Staff, Lecteur — auth JWT, cookies httpOnly, bcrypt cost 12',
        'Sécurité : Helmet, CORS strict, validation Zod, rate limiting, journal d\'audit complet',
        'Import CSV en masse depuis Google Sheets',
        'CI/CD GitHub Actions — deux pipelines : démo (Vercel + Render) et production (NAS Synology via runner auto-hébergé)',
      ],
      credentials: {
        login: 'admin@logiciel.local',
        password: 'Admin1234!',
        note: 'Environnement de démonstration — données entièrement fictives',
      },
      stackTable: [
        { layer: 'Frontend', tech: 'React 19, Vite, Tailwind CSS, React Router, Recharts, jsPDF' },
        { layer: 'Backend', tech: 'Node.js, Express 5, SQLite (better-sqlite3)' },
        { layer: 'Auth', tech: 'JWT, cookies httpOnly, bcrypt (cost 12), rate limiting' },
        { layer: 'Sécurité', tech: 'Helmet, CORS strict, validation Zod, journal d\'audit' },
        { layer: 'Tests', tech: 'Jest, Supertest' },
        { layer: 'Qualité', tech: 'ESLint, Prettier, Husky (pre-commit hooks)' },
        { layer: 'Conteneurisation', tech: 'Docker, Docker Compose, Nginx' },
        { layer: 'Déploiement', tech: 'Vercel (front) · Render (back) · NAS Synology (prod)' },
        { layer: 'CI/CD', tech: 'GitHub Actions — runner auto-hébergé pour la production' },
      ],
    },
  },
  {
    id: 1,
    title: 'Markdown Studio',
    subtitle: 'Éditeur Markdown — React · IndexedDB',
    desc: 'Application web de gestion et d\'édition de fichiers Markdown avec rendu en temps réel, galerie d\'images intégrable, blocs de contenu réutilisables, import/export .md, thème clair/sombre et interface multilingue (FR/EN/AR). Données stockées localement en IndexedDB, zéro backend.',
    tags: ['React', 'IndexedDB', 'TypeScript', 'Markdown'],
    github: 'https://github.com/jeloumy/projet-react-markdown',
    live: 'https://jeloumy.github.io/projet-react-markdown/',
    featured: true,
    color: '#c9a54e',
    year: '2025',
    screenshotFile: 'markdown-studio',
    detail: {
      highlights: [
        'Éditeur Markdown avec rendu en temps réel côté client',
        'Galerie d\'images intégrable directement dans les documents',
        'Blocs de contenu personnalisables et réutilisables',
        'Import / export de fichiers .md natifs',
        'Thème clair/sombre et interface multilingue FR / EN / AR',
        'Zéro backend — toutes les données persistées en IndexedDB localement',
      ],
    },
  },
  {
    id: 2,
    title: 'Album Travel',
    subtitle: 'Jeu de géographie — Next.js',
    desc: 'Application web de quiz géographique déployée sur Vercel. Authentification sécurisée et interface de jeu complète avec deux modes de jeu.',
    tags: ['Next.js', 'TypeScript', 'Vercel'],
    github: '',
    live: 'https://album-travel.vercel.app/login',
    featured: true,
    color: '#a78bfa',
    year: '2025',
    screenshotFile: 'album-travel',
    detail: {
      highlights: [
        'Quiz géographique interactif — deux modes : Sprint des Nations et Défi de Précision',
        'Système d\'authentification sécurisé — travail approfondi sur l\'inscription/connexion',
        'Architecture Next.js App Router avec TypeScript',
        'Déploiement continu sur Vercel',
      ],
      credentials: {
        login: 'usertest123@gmail.com',
        password: 'UserTest1234!*',
        note: 'Compte de démonstration',
      },
    },
  },
  {
    id: 3,
    title: 'Littoral Sport Academy',
    subtitle: 'Site vitrine — Alternance',
    desc: 'Site officiel de l\'association sportive LSA à Toulon, réalisé pendant ma première année de Mastère. Création de A à Z, déploiement, sécurisation et référencement.',
    tags: ['WordPress', 'OVH', 'SEO', 'DNS', 'FileZilla'],
    github: '',
    live: 'https://littoralsportacademy.com/',
    featured: false,
    color: '#34d399',
    year: '2025 — 2026',
    screenshotFile: 'lsa',
    detail: {
      highlights: [
        'Site WordPress créé de A à Z — maquette, intégration, contenu, déploiement',
        'Sécurisation complète : SSL Let\'s Encrypt, .htaccess hardening, protection wp-admin, mises à jour auto',
        'Référencement SEO : balises meta, sitemap XML, robots.txt, optimisation des performances',
        'Gestion de la délivrabilité email — configuration DNS OVH : SPF, DKIM, DMARC',
        'Plugin WordPress personnalisé développé pour la page de connexion',
        'Déploiement via FileZilla (FTP/SFTP), hébergement mutualisé OVH',
        'Même infrastructure OVH que CFA Academos et Benestar Spa',
      ],
      stackTable: [
        { layer: 'CMS', tech: 'WordPress (dernière version)' },
        { layer: 'Hébergement', tech: 'OVH — Hébergement mutualisé' },
        { layer: 'DNS & Mail', tech: 'OVH — SPF, DKIM, DMARC configurés' },
        { layer: 'SEO', tech: 'Yoast SEO, balises meta, sitemap XML' },
        { layer: 'Sécurité', tech: 'SSL, .htaccess, protection wp-admin' },
        { layer: 'Déploiement', tech: 'FileZilla FTP/SFTP' },
        { layer: 'Custom', tech: 'Plugin WordPress développé (page de connexion)' },
      ],
    },
  },
  {
    id: 4,
    title: 'CFA Academos',
    subtitle: 'Site vitrine — Alternance',
    desc: 'Site vitrine pour le CFA Academos, réalisé en parallèle de mon alternance chez LSA. Création de A à Z, déploiement, sécurisation et référencement.',
    tags: ['WordPress', 'OVH', 'SEO', 'DNS', 'FileZilla'],
    github: '',
    live: 'https://cfa-academos.fr/',
    featured: false,
    color: '#f43f5e',
    year: '2025 — 2026',
    screenshotFile: 'cfa-academos',
    detail: {
      highlights: [
        'Site WordPress créé de A à Z — maquette, intégration, contenu, déploiement',
        'Sécurisation complète : SSL, .htaccess hardening, protection wp-admin',
        'Référencement SEO on-page et technique — balises meta, sitemap XML, robots.txt',
        'Gestion de la délivrabilité email — configuration DNS OVH : SPF, DKIM, DMARC',
        'Déploiement via FileZilla (FTP/SFTP), hébergement mutualisé OVH',
        'Même infrastructure OVH que LSA Academy et Benestar Spa',
      ],
      stackTable: [
        { layer: 'CMS', tech: 'WordPress (dernière version)' },
        { layer: 'Hébergement', tech: 'OVH — Hébergement mutualisé' },
        { layer: 'DNS & Mail', tech: 'OVH — SPF, DKIM, DMARC configurés' },
        { layer: 'SEO', tech: 'Yoast SEO, balises meta, sitemap XML' },
        { layer: 'Sécurité', tech: 'SSL, .htaccess, protection wp-admin' },
        { layer: 'Déploiement', tech: 'FileZilla FTP/SFTP' },
      ],
    },
  },
  {
    id: 5,
    title: 'Benestar Spa',
    subtitle: 'Site vitrine — Stage MMI',
    desc: 'Site WordPress réalisé lors de mon stage de 3ème année BUT MMI chez Pass Piscines et Spas. Création de A à Z et déploiement en production.',
    tags: ['WordPress', 'OVH', 'SEO', 'DNS', 'FileZilla'],
    github: '',
    live: 'https://benestar-spa.fr/',
    featured: false,
    color: '#7c3aed',
    year: '2023',
    screenshotFile: 'benestar',
    detail: {
      highlights: [
        'Site WordPress réalisé de A à Z lors du stage BUT MMI chez Pass Piscines et Spas',
        'Création complète : maquette, intégration, contenu, mise en ligne',
        'Sécurisation complète : SSL, .htaccess, protection wp-admin',
        'Référencement SEO : balises meta, vitesse de chargement, structure sémantique',
        'Déploiement via FileZilla (FTP/SFTP), hébergement mutualisé OVH',
      ],
      stackTable: [
        { layer: 'CMS', tech: 'WordPress (dernière version)' },
        { layer: 'Hébergement', tech: 'OVH — Hébergement mutualisé' },
        { layer: 'SEO', tech: 'Yoast SEO, balises meta, sitemap XML' },
        { layer: 'Sécurité', tech: 'SSL, .htaccess, protection wp-admin' },
        { layer: 'Déploiement', tech: 'FileZilla FTP/SFTP' },
      ],
    },
  },
]
