export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'quote'; text: string };

function isContentBlock(value: unknown): value is ContentBlock {
  if (!value || typeof value !== 'object') return false;

  const block = value as Record<string, unknown>;

  return (
    typeof block.text === 'string' &&
    (block.type === 'paragraph' ||
      block.type === 'heading' ||
      block.type === 'quote')
  );
}

/**
 * Mengubah teks editor menjadi blok JSONB yang disimpan di kolom content.
 * Baris kosong memisahkan blok, `## ` menjadi subjudul, dan `> ` menjadi kutipan.
 */
export function parseContent(value: string): ContentBlock[] {
  return value
    .replace(/\r\n?/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map<ContentBlock>((block) => {
      if (block.startsWith('## ')) {
        return { type: 'heading', text: block.slice(3).trim() };
      }

      if (block.startsWith('> ')) {
        return { type: 'quote', text: block.slice(2).trim() };
      }

      return {
        type: 'paragraph',
        text: block.replace(/\n/g, ' ').trim(),
      };
    })
    .filter((block) => block.text.length > 0);
}

/**
 * Mengubah blok JSONB dari database kembali menjadi teks yang bisa diedit
 * di textarea dengan format yang sama seperti saat dibuat.
 */
export function serializeContent(value: unknown): string {
  if (!Array.isArray(value)) return '';

  return value
    .filter(isContentBlock)
    .map((block) => {
      if (block.type === 'heading') return `## ${block.text}`;
      if (block.type === 'quote') return `> ${block.text}`;
      return block.text;
    })
    .join('\n\n');
}
