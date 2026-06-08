import { Palette, Video, ImageIcon, Play, type LucideIcon } from 'lucide-react'

export type CreativeTab = 'logos' | 'videos' | 'designs'

export interface CreativeItem {
  title: string
  desc: string
  tags: string[]
  badge: string
  image?: string
  imageBack?: string   // recto/verso : verso de la carte
  thumbnailBg?: string // couleur de fond du haut de la card
  youtube?: string     // ID de la vidéo YouTube (ex: "S0mrjPUIWYs")
}

export interface TabConfig {
  id: CreativeTab
  label: string
  icon: LucideIcon
  color: string
  columns: number
  centerIcon: LucideIcon
}

export const TAB_CONFIG: TabConfig[] = [
  { id: 'logos',   label: 'Logos & Identités', icon: Palette,   color: '#c9a54e', columns: 4, centerIcon: Palette   },
  { id: 'videos',  label: 'Vidéos',            icon: Video,     color: '#f43f5e', columns: 3, centerIcon: Play       },
  { id: 'designs', label: 'Designs',           icon: ImageIcon, color: '#a78bfa', columns: 3, centerIcon: ImageIcon  },
]

// ── Métadonnées logos — clé = nom du fichier sans extension (minuscules) ──────
// Le fichier PNG est auto-découvert par import.meta.glob, les métadonnées
// enrichissent le titre, la description, les tags et le badge.
export const LOGO_META: Record<string, Partial<CreativeItem>> = {
  'benestar': {
    title: 'Benestar',
    desc: 'Identité visuelle pour une boutique de spa en ligne, réalisée lors de mon stage de 3ème année BUT MMI chez Pass Piscines et Spas.',
    tags: ['Illustrator', 'Branding', 'Identité visuelle'],
    badge: 'Stage MMI',
    thumbnailBg: '#f8efdc',
  },
  'cfa-academos': {
    title: 'CFA Academos',
    desc: "Logo pour le CFA qu'accompagne LSA dans son développement, réalisé durant mon alternance.",
    tags: ['Illustrator', 'Branding'],
    badge: 'Alternance',
    thumbnailBg: '#ffffff',
  },
  'dtech': {
    title: 'DTech',
    desc: 'Identité visuelle complète pour une agence de développement web — logotype + icône, déclinaisons fond dégradé et fond neutre.',
    tags: ['Illustrator', 'Branding', 'Micro-entreprise'],
    badge: 'Freelance',
    thumbnailBg: 'linear-gradient(to top, #0c0c0c, #111425)',
  },
  'grimpp': {
    title: 'Grimpp',
    desc: "Logo pour une application d'apprentissage de la conduite, version complète, contractée et icône.",
    tags: ['Illustrator', 'App Branding'],
    badge: 'Freelance',
    thumbnailBg: '#6666ff',
  },
  'kwickeat': {
    title: 'KwickEat',
    desc: "Identité visuelle pour une plateforme de commande en restauration, concurrent direct d'Obypay.",
    tags: ['Illustrator', 'Branding', 'SaaS'],
    badge: 'Freelance',
    thumbnailBg: '#eed8c8',
  },
  'lsa': {
    title: 'Littoral Sport Academy',
    desc: "Logo de l'association sportive de Toulon pour laquelle je suis alternant en première année de Mastère.",
    tags: ['Illustrator', 'Associatif', 'Sport'],
    badge: 'Alternance',
    thumbnailBg: '#ffffff',
  },
  'yas-agency': {
    title: 'Y.A.S Agency',
    desc: 'Identité visuelle pour une agence immobilière — logotype et icône en déclinaisons couleur.',
    tags: ['Illustrator', 'Immobilier', 'Branding'],
    badge: 'Freelance',
    thumbnailBg: '#032b1f',
  },
}

// ── Métadonnées designs ───────────────────────────────────────────────────────
// Clé pour les paires recto/verso = nom de base SANS suffixe -recto/-verso
export const DESIGN_META: Record<string, Partial<CreativeItem>> = {
  'banderole-pass-piscines': {
    title: 'Banderole Pass Piscines & Spas',
    desc: 'Support print réalisé lors de mon stage de 3ème année BUT MMI chez Pass Piscines et Spas.',
    tags: ['Illustrator', 'Print', 'Stage MMI'],
    badge: 'Print',
  },
  // clé = "cdv-dtech" (sans -recto / -verso) → le composant regroupe la paire
  'cdv-dtech': {
    title: 'Carte de visite DTech',
    desc: 'Recto/verso pour l\'agence de développement DTech.',
    tags: ['Illustrator', 'Print', 'Carte de visite'],
    badge: 'Recto / Verso',
  },
  // La Valrassienne — exporter depuis Illustrator en PNG et nommer cdv-valrassienne-recto.png / cdv-valrassienne-verso.png
  'cdv-valrassienne': {
    title: 'Carte de visite La Valrassienne',
    desc: 'Carte de visite réalisée lors de mon stage de 2ème année BUT MMI chez La Valrassienne.',
    tags: ['Illustrator', 'Print', 'Stage MMI'],
    badge: 'Recto / Verso',
  },
}

// ── Fallbacks (affichés si les dossiers d'assets sont vides) ─────────────────
export const FALLBACK_LOGOS: CreativeItem[] = [
  { title: 'Logo Entreprise 1', desc: 'Dépose tes PNG dans src/assets/logos/', tags: ['Illustrator', 'Branding'], badge: 'Branding' },
  { title: 'Logo Entreprise 2', desc: 'Dépose tes PNG dans src/assets/logos/', tags: ['Illustrator', 'Figma'],   badge: 'Identité' },
]

// ── Vidéos YouTube ───────────────────────────────────────────────────────────
// Met à jour title, desc, tags et badge selon tes vidéos réelles.
export const VIDEOS: CreativeItem[] = [
  {
    title: 'Vidéo 1',
    desc: 'Description à remplir.',
    tags: ['Premiere Pro', 'After Effects', 'Scénario'],
    badge: 'YouTube',
    youtube: 'S0mrjPUIWYs',
  },
  {
    title: 'Vidéo 2',
    desc: 'Description à remplir.',
    tags: ['Premiere Pro', 'After Effects'],
    badge: 'YouTube',
    youtube: 'fiUdxdoirTM',
  },
  {
    title: 'Vidéo 3',
    desc: 'Description à remplir.',
    tags: ['After Effects', 'Montage'],
    badge: 'YouTube',
    youtube: 'LG_A0fGIGF8',
  },
]

export const FALLBACK_VIDEOS = VIDEOS

export const FALLBACK_DESIGNS: CreativeItem[] = [
  { title: 'Design 1', desc: 'Dépose tes PNG dans src/assets/designs/', tags: ['Illustrator', 'Print'], badge: 'Print' },
]
