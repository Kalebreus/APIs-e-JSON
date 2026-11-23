// Funções reutilizáveis da aula. Execute a página por um servidor HTTP local.

// GET: espera a resposta HTTP e depois lê/interpreta o corpo como JSON.
async function buscarJSON(url, opcoes = {}) {
  const resposta = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: opcoes.signal
  });

  // fetch não rejeita automaticamente em respostas HTTP 404 ou 500.
  if (!resposta.ok) {
    const erro = new Error('A consulta retornou HTTP ' + resposta.status + '.');
    erro.name = 'ErroHTTP';
    erro.status = resposta.status;
    throw erro;
  }

  // Esta etapa também é assíncrona e pode falhar se o corpo não for JSON válido.
  const dados = await resposta.json();
  return dados;
}

// Simulação didática de espera. Não é uma chamada de API nem um atraso do servidor.
// O sinal opcional permite interromper a espera da mesma forma que uma consulta.
function aguardar(ms, sinal) {
  return new Promise(function (resolve, reject) {
    if (sinal && sinal.aborted) {
      reject(new DOMException('Espera cancelada.', 'AbortError'));
      return;
    }

    function cancelar() {
      clearTimeout(temporizador);
      reject(new DOMException('Espera cancelada.', 'AbortError'));
    }

    const temporizador = setTimeout(function () {
      if (sinal) {
        sinal.removeEventListener('abort', cancelar);
      }
      resolve();
    }, ms);

    if (sinal) {
      sinal.addEventListener('abort', cancelar, { once: true });
    }
  });
}
