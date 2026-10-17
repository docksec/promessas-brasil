interface OpcoesEnvio {
  mensagemSucesso: string;
  /** Permite ajustar os dados antes do envio (ex: montar o assunto do e-mail). */
  prepararDados?: (dados: Record<string, string>) => void;
}

/**
 * Envia o formulário ao Web3Forms sem sair da página. Sem JavaScript, o formulário continua
 * funcionando pelo atributo action. O evento submit só dispara depois da validação nativa
 * do navegador (campos required, type="url" etc.).
 */
export function ativarEnvioWeb3Forms(formId: string, statusId: string, opcoes: OpcoesEnvio): void {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const status = document.getElementById(statusId);
  if (!form || !status) return;

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const botao = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    botao.disabled = true;
    status.className = 'text-sm text-slate-600';
    status.textContent = 'Enviando...';

    // Campos opcionais vazios (ex: e-mail) não são enviados.
    const dados = Object.fromEntries(
      Array.from(new FormData(form)).filter(([, valor]) => String(valor).trim() !== ''),
    ) as Record<string, string>;
    opcoes.prepararDados?.(dados);

    try {
      // O Web3Forms só responde em JSON quando o corpo também é JSON; com FormData ele devolve HTML.
      const resposta = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(dados),
      });
      const resultado = await resposta.json();
      if (!resposta.ok || !resultado.success) throw new Error(resultado.message);
      form.reset();
      status.className = 'text-sm text-green-700';
      status.textContent = opcoes.mensagemSucesso;
    } catch {
      status.className = 'text-sm text-red-700';
      status.textContent = 'Não foi possível enviar agora. Tente novamente em alguns minutos.';
    } finally {
      botao.disabled = false;
    }
  });
}
