/** Prefixa um caminho absoluto (ex: "/images/lula.jpg") com o BASE_URL do site. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
