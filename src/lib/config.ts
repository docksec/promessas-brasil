/** Valor usado nos arquivos de configuração para campos ainda não preenchidos. */
const PENDENTE = 'PENDENTE';

export function isPreenchido(valor: string): boolean {
  return valor.trim() !== '' && valor.trim() !== PENDENTE;
}
