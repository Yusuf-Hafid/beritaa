import type { NavItem } from '@/lib/types';

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Nasional',
    href: '/nasional',
    megaMenu: { title: 'Nasional', description: 'Politik, pemerintahan, dan isu nasional' },
  },
  {
    label: 'Internasional',
    href: '/internasional',
    megaMenu: { title: 'Internasional', description: 'Peristiwa dunia dan geopolitik global' },
  },
  {
    label: 'Ekonomi',
    href: '/ekonomi',
    megaMenu: { title: 'Ekonomi', description: 'Pasar, bisnis, dan keuangan' },
  },
  {
    label: 'Olahraga',
    href: '/olahraga',
    megaMenu: { title: 'Olahraga', description: 'Skor, transfer, dan sorotan' },
  },
  {
    label: 'Teknologi',
    href: '/teknologi',
    megaMenu: { title: 'Teknologi', description: 'Inovasi, gawai, dan tren digital' },
  },
  {
    label: 'Hiburan',
    href: '/hiburan',
    megaMenu: { title: 'Hiburan', description: 'Film, musik, dan selebritas' },
  },
  {
    label: 'Gaya Hidup',
    href: '/gaya-hidup',
    megaMenu: { title: 'Gaya Hidup', description: 'Kesehatan, kuliner, dan travel' },
  },
  {
    label: 'Hukum',
    href: '/hukum',
    megaMenu: { title: 'Hukum', description: 'Putusan, regulasi, dan perkembangan hukum' },
  },
];

export const footerLinkGroups = [
  {
    title: 'Tentang INDONEWS',
    links: [
      { label: 'Tentang Kami', href: '/tentang-kami' },
      { label: 'Redaksi', href: '/redaksi' },
      { label: 'Pedoman Media', href: '/pedoman-media' },
      { label: 'Karier', href: '/karier' },
    ],
  },
  {
    title: 'Kategori',
    links: [
      { label: 'Nasional', href: '/nasional' },
      { label: 'Internasional', href: '/internasional' },
      { label: 'Ekonomi', href: '/ekonomi' },
      { label: 'Olahraga', href: '/olahraga' },
    ],
  },
  {
    title: 'Layanan',
    links: [
      { label: 'Langganan', href: '/langganan' },
      { label: 'Newsletter', href: '/newsletter' },
      { label: 'Iklan', href: '/iklan' },
      { label: 'Arsip', href: '/arsip' },
    ],
  },
];
