import doacaoData from '../data/doacao.json';

export interface ConfigPix {
  chave: string;
  nome_recebedor: string;
  cidade: string;
  /** Código "copia e cola" emitido pelo banco. Quando presente, é usado sem alteração. */
  copia_e_cola?: string;
  /** Página de pagamento do banco (ex: link de cobrança do Nubank), exibida como alternativa. */
  link_pagamento?: string;
}

export interface ConfigDoacao {
  pix: ConfigPix;
  web3forms_access_key: string;
}

export const doacao = doacaoData as ConfigDoacao;

const PENDENTE = 'PENDENTE';

export function isPreenchido(valor: string): boolean {
  return valor.trim() !== '' && valor.trim() !== PENDENTE;
}

export function isPixConfigurado(pix: ConfigPix): boolean {
  return isPreenchido(pix.chave) && isPreenchido(pix.nome_recebedor) && isPreenchido(pix.cidade);
}

/** Remove acentos e caracteres fora do conjunto aceito pelo BR Code, em maiúsculas. */
function normalizarTexto(texto: string, limite: number): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .toUpperCase()
    .trim()
    .slice(0, limite);
}

/**
 * Normaliza a chave Pix: e-mail e chave aleatória em minúsculas, telefone no formato
 * +55DDDNUMERO, CPF/CNPJ apenas com dígitos.
 */
export function normalizarChave(chave: string): string {
  const c = chave.trim();
  if (c.includes('@')) return c.toLowerCase();
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c)) return c.toLowerCase();
  if (c.startsWith('+')) return '+' + c.replace(/\D/g, '');
  return c.replace(/\D/g, '');
}

/** Campo EMV: ID (2 dígitos) + tamanho (2 dígitos) + valor. */
function campo(id: string, valor: string): string {
  return id + String(valor.length).padStart(2, '0') + valor;
}

/** CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF), exigido no campo 63 do BR Code. */
export function crc16(payload: string): string {
  let crc = 0xffff;
  for (const byte of new TextEncoder().encode(payload)) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Gera o "Pix copia e cola" (BR Code estático, padrão EMV do Banco Central) sem valor
 * definido, para que a pessoa escolha quanto doar.
 */
export function gerarPixCopiaECola(pix: ConfigPix): string {
  const contaPix = campo('00', 'br.gov.bcb.pix') + campo('01', normalizarChave(pix.chave));
  const semCrc =
    campo('00', '01') +
    campo('26', contaPix) +
    campo('52', '0000') +
    campo('53', '986') +
    campo('58', 'BR') +
    campo('59', normalizarTexto(pix.nome_recebedor, 25)) +
    campo('60', normalizarTexto(pix.cidade, 15)) +
    campo('62', campo('05', '***')) +
    '6304';
  return semCrc + crc16(semCrc);
}

/**
 * Retorna o código emitido pelo banco, se configurado, ou gera um a partir da chave.
 * Um código com CRC inválido interrompe o build em vez de publicar um Pix que não funciona.
 */
export function obterPixCopiaECola(pix: ConfigPix): string {
  const codigo = pix.copia_e_cola?.trim();
  if (!codigo || !isPreenchido(codigo)) return gerarPixCopiaECola(pix);
  if (crc16(codigo.slice(0, -4)) !== codigo.slice(-4).toUpperCase()) {
    throw new Error('doacao.json: o CRC do pix.copia_e_cola é inválido — confira o código copiado do banco.');
  }
  return codigo;
}
