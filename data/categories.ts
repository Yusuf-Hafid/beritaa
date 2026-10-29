import type { Category } from '@/lib/types';

export const categories: Category[] = [
  {
    slug: 'nasional',
    name: 'Nasional',
    color: 'hsl(0 80% 48%)',
    description: 'Kabar terkini dari sepenjuru negeri — politik, pemerintahan, dan isu nasional.',
  },
  {
    slug: 'internasional',
    name: 'Internasional',
    color: 'hsl(202 58% 38%)',
    description: 'Berita dan analisis peristiwa dunia, diplomasi, dan geopolitik global.',
  },
  {
    slug: 'ekonomi',
    name: 'Ekonomi',
    color: 'hsl(142 52% 36%)',
    description: 'Pasar, bisnis, keuangan, dan dinamika ekonomi dalam dan luar negeri.',
  },
  {
    slug: 'olahraga',
    name: 'Olahraga',
    color: 'hsl(25 85% 52%)',
    description: 'Skor, transfer, dan sorotan dunia olahraga nasional dan internasional.',
  },
  {
    slug: 'teknologi',
    name: 'Teknologi',
    color: 'hsl(265 60% 55%)',
    description: 'Inovasi, gawai, internet, dan tren teknologi yang membentuk masa depan.',
  },
  {
    slug: 'hiburan',
    name: 'Hiburan',
    color: 'hsl(330 70% 52%)',
    description: 'Film, musik, selebritas, dan khazanah industri hiburan tanah air.',
  },
  {
    slug: 'gaya-hidup',
    name: 'Gaya Hidup',
    color: 'hsl(15 55% 48%)',
    description: 'Kesehatan, kuliner, travel, dan inspirasi kehidupan sehari-hari.',
  },
  {
    slug: 'hukum',
    name: 'Hukum',
    color: 'hsl(210 40% 42%)',
    description: 'Putusan pengadilan, regulasi, dan perkembangan dunia hukum.',
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
