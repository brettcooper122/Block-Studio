// Placeholder client marks in the spirit of logoipsum.com — simple
// geometric glyphs (24×24 viewBox) paired with a wordmark.
export type ClientLogo = {
  name: string
  glyph: string
}

export const clientLogos: ClientLogo[] = [
  {
    name: 'Northwind',
    glyph: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20Zm0 5a5 5 0 1 1 0 10a5 5 0 1 1 0-10Z',
  },
  { name: 'Quantra', glyph: 'M12 2l8.66 5v10L12 22l-8.66-5V7Z' },
  { name: 'Helix', glyph: 'M12 3l9 16H3Z' },
  { name: 'Lumen', glyph: 'M3 3h8v8H3ZM13 3h8v8h-8ZM3 13h8v8H3ZM13 13h8v8h-8Z' },
  { name: 'Orbitec', glyph: 'M12 2l10 10-10 10L2 12Z' },
  { name: 'Vertex', glyph: 'M2 11a10 10 0 0 1 20 0ZM2 13h20a10 10 0 0 1-20 0Z' },
  { name: 'Kinetic', glyph: 'M9 2h6v7h7v6h-7v7H9v-7H2V9h7Z' },
  { name: 'Strata', glyph: 'M3 4h4v16H3ZM10 8h4v12h-4ZM17 12h4v8h-4Z' },
]
