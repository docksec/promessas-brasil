import presidentesData from '../data/presidentes.json';
import propostasData from '../data/propostas.json';
import eixosData from '../data/eixos.json';
import indicadoresData from '../data/indicadores.json';

export type StatusProposta =
  | 'cumprido'
  | 'parcialmente_cumprido'
  | 'em_andamento'
  | 'nao_cumprido'
  | 'nao_iniciado';

export type StatusMandato = 'em_andamento' | 'finalizado';

export interface Presidente {
  id: string;
  nome: string;
  mandato_inicio: string;
  mandato_fim: string;
  status_mandato: StatusMandato;
  partido_coligacao: string;
  foto: string;
}

export interface Evidencia {
  descricao: string;
  fonte_url: string;
  data: string;
}

export interface Proposta {
  id: string;
  presidente_id: string;
  eixo: string;
  categoria: string;
  titulo: string;
  descricao_original: string;
  fonte_proposta: string;
  /** Localização legível da proposta no documento original (ex: "p. 32 - Conclusão"). */
  referencia_documento?: string;
  /** Caminho do documento original, para montar um link direto à página (ex: "/propostas-tse/bolsonaro.pdf"). */
  documento_url?: string;
  /** Número da página do documento_url referente a essa proposta, usado no link "#page=". */
  documento_pagina?: number;
  status: StatusProposta;
  percentual_cumprimento: number;
  data_ultima_atualizacao: string;
  evidencias: Evidencia[];
}

export interface Eixo {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
}

export type TipoValorIndicador = 'inicio_fim' | 'total_mandato' | 'media_anual';

export interface Indicador {
  id: string;
  presidente_id: string;
  nome: string;
  unidade: string;
  tipo_valor?: TipoValorIndicador;
  valor_inicio_mandato?: string;
  valor_fim_mandato?: string;
  valor_total_mandato?: string;
  valor_media_anual?: string;
  fonte: string;
  categoria: string;
}

export const presidentes = presidentesData as Presidente[];
export const propostas = propostasData as Proposta[];
export const eixos = eixosData as Eixo[];
export const indicadores = indicadoresData as Indicador[];

export function getPresidente(id: string): Presidente | undefined {
  return presidentes.find((p) => p.id === id);
}

export function isMandatoEmAndamento(presidente: Presidente): boolean {
  return presidente.status_mandato === 'em_andamento';
}

export function getPropostasByPresidente(presidenteId: string): Proposta[] {
  return propostas.filter((p) => p.presidente_id === presidenteId);
}

export function getIndicadoresByPresidente(presidenteId: string): Indicador[] {
  return indicadores.filter((i) => i.presidente_id === presidenteId);
}

export function getEixo(id: string): Eixo | undefined {
  return eixos.find((e) => e.id === id);
}

export function getProposta(id: string): Proposta | undefined {
  return propostas.find((p) => p.id === id);
}

// Converte "1.533.436" ou "11,7" (formato BR: ponto como milhar, vírgula como decimal) para number.
function parseValorBR(valor: string): number {
  return Number(valor.replace(/\./g, '').replace(',', '.'));
}

export function isValorNumerico(valor: string): boolean {
  return valor !== 'PLACEHOLDER' && valor.trim() !== '' && !isNaN(parseValorBR(valor));
}

export function calcularVariacao(inicio: string, fim: string): number | null {
  if (!isValorNumerico(inicio) || !isValorNumerico(fim)) return null;
  const vi = parseValorBR(inicio);
  const vf = parseValorBR(fim);
  if (vi === 0) return null;
  return ((vf - vi) / Math.abs(vi)) * 100;
}

export const STATUS_LABELS: Record<StatusProposta, string> = {
  cumprido: 'Cumprido',
  parcialmente_cumprido: 'Parcialmente cumprido',
  em_andamento: 'Em andamento',
  nao_cumprido: 'Não cumprido',
  nao_iniciado: 'Não iniciado',
};

export const STATUS_COLORS: Record<StatusProposta, { bg: string; text: string; dot: string }> = {
  cumprido: { bg: 'bg-cumprido-bg', text: 'text-cumprido-texto', dot: 'bg-cumprido-ponto' },
  parcialmente_cumprido: { bg: 'bg-parcial-bg', text: 'text-parcial-texto', dot: 'bg-parcial-ponto' },
  em_andamento: { bg: 'bg-andamento-bg', text: 'text-andamento-texto', dot: 'bg-andamento-ponto' },
  nao_cumprido: { bg: 'bg-naocumprido-bg', text: 'text-naocumprido-texto', dot: 'bg-naocumprido-ponto' },
  nao_iniciado: { bg: 'bg-naoiniciado-bg', text: 'text-naoiniciado-texto', dot: 'bg-naoiniciado-ponto' },
};
