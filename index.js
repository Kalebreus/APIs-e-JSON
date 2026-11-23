// A página usa defer: api.js é executado antes deste arquivo.
const textoJSON = document.getElementById('texto-json');
const estadoJSON = document.getElementById('estado-json');
const resultadoJSON = document.getElementById('resultado-json');

// 1. Texto JSON e valor JavaScript são representações diferentes.
document.getElementById('interpretar-json').addEventListener('click', function () {
  try {
    const valor = JSON.parse(textoJSON.value);
    let tipo = typeof valor;
    if (valor === null) {
      tipo = 'null';
    } else if (Array.isArray(valor)) {
      tipo = 'array';
    }
    estadoJSON.textContent = 'Texto interpretado. Tipo do valor: ' + tipo + '.';
    resultadoJSON.textContent = JSON.stringify(valor, null, 2);
  } catch (erro) {
    estadoJSON.textContent = 'JSON inválido. Confira aspas duplas, vírgulas e estrutura.';
    resultadoJSON.textContent = '';
  }
});

document.getElementById('gerar-json').addEventListener('click', function () {
  const objeto = { nome: 'Ana', ativo: true, pontos: 15 };
  const texto = JSON.stringify(objeto, null, 2);
  textoJSON.value = texto;
  resultadoJSON.textContent = texto;
  estadoJSON.textContent = 'JSON.stringify gerou uma string a partir do objeto.';
});

const origem = document.getElementById('origem');
const campoId = document.getElementById('usuario-id');
const campoLimite = document.getElementById('limite-ms');
const estadoConsulta = document.getElementById('estado-consulta');
const resultadoConsulta = document.getElementById('resultado-consulta');
const painelResposta = document.getElementById('painel-resposta');
const botaoCancelar = document.getElementById('cancelar');
let consultaAtual = null;

function definirCarregamento(carregando) {
  document.getElementById('consultar').disabled = carregando;
  document.getElementById('erro-http').disabled = carregando;
  document.getElementById('erro-json').disabled = carregando;
  origem.disabled = carregando;
  campoLimite.disabled = carregando;
  campoId.disabled = carregando || origem.value !== 'publica';
  botaoCancelar.disabled = !carregando;
  painelResposta.setAttribute('aria-busy', String(carregando));
}

function mostrarEstado(estado, mensagem) {
  estadoConsulta.dataset.estado = estado;
  estadoConsulta.textContent = mensagem;
}

// 2. Um controlador por consulta e apenas uma consulta ativa por vez.
async function executarConsulta(url, atrasoMs = 0) {
  if (consultaAtual !== null) {
    return;
  }

  const limiteMs = Number(campoLimite.value);
  if (!Number.isFinite(limiteMs) || limiteMs < 100 || limiteMs > 30000) {
    mostrarEstado('error', 'Informe um limite entre 100 e 30000 ms.');
    return;
  }

  const consulta = { controlador: new AbortController(), motivo: null };
  consultaAtual = consulta;
  resultadoConsulta.textContent = '';
  document.getElementById('url-consultada').textContent = url;
  mostrarEstado('loading', 'Carregando. A interface continua disponível.');
  definirCarregamento(true);

  const temporizador = setTimeout(function () {
    consulta.motivo = 'timeout';
    consulta.controlador.abort();
  }, limiteMs);

  try {
    if (atrasoMs > 0) {
      // Simulação ANTES do fetch, para observar espera, cancelamento e timeout.
      await aguardar(atrasoMs, consulta.controlador.signal);
    }

    const dados = await buscarJSON(url, { signal: consulta.controlador.signal });
    resultadoConsulta.textContent = JSON.stringify(dados, null, 2);
    mostrarEstado('success', 'Resposta recebida e JSON interpretado com sucesso.');
  } catch (erro) {
    resultadoConsulta.textContent = '';

    if (consulta.motivo === 'timeout') {
      mostrarEstado('timeout', 'Tempo limite de ' + limiteMs + ' ms atingido. Operação interrompida.');
    } else if (consulta.controlador.signal.aborted) {
      mostrarEstado('cancelled', 'Consulta cancelada pelo usuário.');
    } else if (erro.name === 'ErroHTTP') {
      mostrarEstado('error', 'Erro HTTP ' + erro.status + '. A resposta não foi tratada como sucesso.');
    } else if (erro instanceof SyntaxError) {
      mostrarEstado('error', 'A resposta foi recebida, mas seu corpo não contém JSON válido.');
    } else {
      mostrarEstado('error', 'Falha na consulta. Verifique endereço, conexão e o painel Network do navegador.');
    }
  } finally {
    // Evita deixar um timeout pendente após sucesso, erro ou cancelamento.
    clearTimeout(temporizador);
    consultaAtual = null;
    definirCarregamento(false);
  }
}

origem.addEventListener('change', function () {
  definirCarregamento(false);
});

document.getElementById('form-consulta').addEventListener('submit', function (evento) {
  evento.preventDefault();

  if (origem.value === 'publica') {
    const id = Number(campoId.value);
    if (!Number.isInteger(id) || id < 1) {
      mostrarEstado('error', 'Informe um ID inteiro maior ou igual a 1.');
      return;
    }
    executarConsulta('https://jsonplaceholder.typicode.com/users/' + id);
  } else if (origem.value === 'lento') {
    executarConsulta('./dados/usuario.json', 2000);
  } else {
    executarConsulta('./dados/usuario.json');
  }
});

// Estes testes usam arquivos locais, não provocam falhas no serviço público.
document.getElementById('erro-http').addEventListener('click', function () {
  executarConsulta('./dados/nao-existe.json');
});

document.getElementById('erro-json').addEventListener('click', function () {
  executarConsulta('./dados/invalido.txt');
});

botaoCancelar.addEventListener('click', function () {
  if (consultaAtual && !consultaAtual.controlador.signal.aborted) {
    consultaAtual.motivo = 'cancelamento';
    consultaAtual.controlador.abort();
  }
});

// 3. Enquanto uma operação aguarda, este listener continua respondendo.
let interacoes = 0;
document.getElementById('contar').addEventListener('click', function () {
  interacoes = interacoes + 1;
  document.getElementById('contador').textContent = 'Interações: ' + interacoes;
});

document.getElementById('mostrar-ordem').addEventListener('click', async function (evento) {
  const botao = evento.currentTarget;
  const saida = document.getElementById('ordem-assincrona');
  botao.disabled = true;

  try {
    const linhas = ['1. Início: criar uma Promise de espera.'];
    const promessa = aguardar(1000);
    linhas.push('2. O código continua antes de esperar o resultado.');
    saida.textContent = linhas.join('\n');
    await promessa;
    linhas.push('3. A espera terminou; a função continua após await.');
    saida.textContent = linhas.join('\n');
  } finally {
    botao.disabled = false;
  }
});

document.getElementById('aviso-http').hidden = location.protocol !== 'file:';
definirCarregamento(false);
