import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export function formatTanggal(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'EEEE, d MMMM yyyy', { locale: localeId });
}

export function formatTanggalSingkat(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'd MMM yyyy', { locale: localeId });
}

export function formatJam(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'HH:mm', { locale: localeId }) + ' WIB';
}

export function formatWaktuRelatif(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffJam = Math.floor(diffMin / 60);
  const diffHari = Math.floor(diffJam / 24);

  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffJam < 24) return `${diffJam} jam lalu`;
  if (diffHari < 7) return `${diffHari} hari lalu`;
  return formatTanggalSingkat(d);
}
