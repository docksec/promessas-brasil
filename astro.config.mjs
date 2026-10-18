// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Domínio personalizado configurado no GitHub Pages: o site fica na raiz, sem base.
  site: 'https://www.radardaspropostas.online',
  vite: {
    plugins: [tailwindcss()]
  }
});