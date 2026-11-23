# Exercícios — APIs, JSON e operações assíncronas

São seis exercícios progressivos e um desafio final. Tente resolver cada proposta antes de abrir a solução.

## Preparação

Abra a demonstração pelo servidor HTTP indicado no README e use o **Console** das ferramentas de desenvolvimento do navegador. Não execute estes exemplos abrindo o HTML por `file://` nem diretamente no Node.js.

**Recarregue a página antes de cada exercício.** Copie o bloco inteiro: as chaves `{ ... }` mantêm as declarações locais separadas, permitindo repetir os exemplos sem conflitos entre variáveis `const`.

A demonstração disponibiliza:

- `buscarJSON(url, opcoes)`: faz um GET, verifica o status HTTP e interpreta o corpo como JSON. Aceita `opcoes.signal` para cancelamento.
- `aguardar(ms, sinal)`: retorna uma Promise de espera e aceita um sinal opcional de cancelamento.
- `./dados/usuario.json`: amostra local válida.
- `./dados/invalido.txt`: arquivo local servido com sucesso HTTP, mas com conteúdo que não é JSON válido.
- `./dados/nao-existe.json`: caminho ausente, que retorna 404 com o servidor HTTP recomendado.

A amostra válida contém:

```json
{
  "id": 1,
  "name": "Ana Exemplo",
  "email": "ana@example.com",
  "ativo": true,
  "interesses": ["JavaScript", "APIs"]
}
```

Os exercícios não dependem da API pública nem alteram dados de serviços externos. Ler um arquivo JSON estático por HTTP é útil para estudar a comunicação, mas não significa que implementamos uma API de backend.

Algumas soluções usam uma função assíncrona executada imediatamente, no formato `(async () => { ... })()`. Ela retorna uma Promise. O Console pode mostrar `Promise {<pending>}` ou outro resultado da execução do bloco; **espere os `console.log()` indicados**, que são as verificações do exercício.

## 1. Básico — distinguir texto JSON de um valor JavaScript

**Objetivo:** interpretar um texto JSON e acessar os valores resultantes.

1. Crie uma string contendo JSON com `id`, `name` e `ativo`.
2. Verifique o tipo dessa string.
3. Use `JSON.parse()` e acesse as propriedades do objeto resultante.
4. Experimente interpretar um array e um booleano para perceber que a raiz do JSON não precisa ser um objeto.

<details>
<summary>Ver solução, resultados e explicação</summary>

```js
{
  const texto = '{"id":1,"name":"Ana Exemplo","ativo":true}';
  console.log(typeof texto); // string

  const usuario = JSON.parse(texto);
  console.log(typeof usuario); // object
  console.log(usuario.id); // 1
  console.log(usuario.name); // Ana Exemplo
  console.log(usuario.ativo); // true
  console.log(typeof usuario.ativo); // boolean

  const numeros = JSON.parse('[10, 20]');
  console.log(Array.isArray(numeros)); // true
  console.log(numeros[0]); // 10

  const ativo = JSON.parse('false');
  console.log(ativo); // false
  console.log(typeof ativo); // boolean
}
```

`texto` é uma string que respeita o formato JSON. Depois de `JSON.parse()`, `usuario` é um objeto JavaScript; ele já pode ser acessado por propriedades.

O JSON usa aspas duplas nas chaves e nos valores textuais. As aspas simples externas do primeiro exemplo apenas delimitam a string no código JavaScript; elas não fazem parte do conteúdo JSON.

Um JSON válido também pode representar um array, uma string, um número, um booleano ou `null`. `JSON.parse()` não retorna obrigatoriamente um objeto com propriedades.

</details>

## 2. Básico — produzir texto JSON com stringify

**Objetivo:** transformar dados JavaScript em texto JSON e depois interpretá-los novamente.

1. Crie um objeto temporário com nome, estado booleano e uma lista de interesses.
2. Use `JSON.stringify()` com indentação de dois espaços.
3. Verifique que o resultado é texto.
4. Interprete esse texto com `JSON.parse()` e confira os valores.
5. Compare a identidade do objeto original com a do reconstruído.

<details>
<summary>Ver solução, resultados e explicação</summary>

```js
{
  const original = {
    name: 'Bia Exemplo',
    ativo: true,
    interesses: ['JavaScript', 'JSON']
  };

  const texto = JSON.stringify(original, null, 2);
  console.log(typeof texto); // string
  console.log(texto.includes('\n')); // true
  console.log(texto);
  // Exibe o JSON com aspas duplas e indentação.

  const reconstruido = JSON.parse(texto);
  console.log(reconstruido.name); // Bia Exemplo
  console.log(reconstruido.ativo); // true
  console.log(reconstruido.interesses.length); // 2
  console.log(reconstruido === original); // false
}
```

`JSON.stringify()` produz texto; ele não envia os dados a um servidor. O terceiro argumento `2` define a indentação. Neste exemplo, o segundo argumento fica como `null` porque não estamos personalizando a seleção de propriedades.

`JSON.parse()` cria um novo objeto a partir do texto. Os valores foram preservados neste conjunto de dados, mas a referência do objeto é diferente; por isso `reconstruido === original` resulta em `false`.

Escolhemos valores compatíveis com JSON. Não use este exemplo para concluir que a conversão preserva qualquer recurso do JavaScript: funções e `undefined`, por exemplo, não são valores do formato JSON.

</details>

## 3. Básico — reconhecer e tratar JSON inválido

**Objetivo:** impedir que um erro de interpretação encerre o restante do experimento.

1. Tente interpretar um texto cujas chaves e strings estejam com aspas simples.
2. Trate o erro com `try/catch`.
3. Verifique o nome do erro e confirme que o código posterior continua executando.

<details>
<summary>Ver solução, resultados e explicação</summary>

```js
{
  const textoInvalido = "{'name': 'Ana Exemplo'}";

  try {
    JSON.parse(textoInvalido);
    console.log('Esta linha não deve aparecer.');
  } catch (erro) {
    console.log(erro.name); // SyntaxError
    console.log(erro instanceof SyntaxError); // true
  }

  console.log('O experimento continuou.'); // O experimento continuou.
}
```

Esse conteúdo se parece com uma escrita possível de objeto no código JavaScript, mas não obedece ao formato JSON. `JSON.parse()` lança um `SyntaxError` e a execução passa para o `catch`.

A mensagem completa pode variar entre navegadores; confira o nome ou o tipo do erro em vez de decorar seu texto exato.

Corrija o conteúdo para `{"name":"Ana Exemplo"}` e repita a conversão para comparar. Comentários e vírgulas finais também não são permitidos em JSON.

</details>

## 4. Intermediário — observar a ordem com Promise e await

**Objetivo:** perceber que a espera assíncrona não impede a execução do código externo à função.

Antes de executar, tente prever a ordem das mensagens A, B e C.

1. Inicie uma função assíncrona imediatamente.
2. Dentro dela, registre A, aguarde `aguardar(10)` e registre C.
3. Fora da função, registre B logo após iniciá-la.

<details>
<summary>Ver solução, resultados e explicação</summary>

```js
{
  (async () => {
    console.log('A: a função começou.');
    await aguardar(10);
    console.log('C: a espera terminou.');
  })();

  console.log('B: o código externo continuou.');
}
```

Ordem esperada:

```text
A: a função começou.
B: o código externo continuou.
C: a espera terminou.
```

A função executa até encontrar `await`. Ao esperar a Promise, ela permite que o código externo continue. Quando a espera termina, a execução da função prossegue e registra C.

Os 10 ms são um prazo mínimo aproximado para o timer, não uma garantia de execução em um instante exato.

`async` e `await` não significam que todo o código passou a executar em paralelo. Se você escrever duas esperas com `await` em sequência, a segunda só começa depois da primeira. Processamento síncrono pesado também não se torna assíncrono apenas por estar dentro de uma função `async`.

</details>

## 5. Intermediário — ler a amostra JSON por HTTP

**Objetivo:** aguardar os dados e só então acessar seus campos.

1. Use `buscarJSON('./dados/usuario.json')` com `await`.
2. Confira nome, email, estado ativo e interesses.
3. Trate uma falha inesperada, como servidor desligado ou caminho incorreto.

<details>
<summary>Ver solução, resultados e explicação</summary>

```js
{
  (async () => {
    try {
      const usuario = await buscarJSON('./dados/usuario.json');

      console.log(usuario.name); // Ana Exemplo
      console.log(usuario.email); // ana@example.com
      console.log(usuario.ativo); // true
      console.log(Array.isArray(usuario.interesses)); // true
      console.log(usuario.interesses[0]); // JavaScript
      console.log(usuario.interesses.length); // 2
    } catch (erro) {
      console.log('Não foi possível ler a amostra:', erro.name);
    }
  })();
}
```

Por dentro, `buscarJSON()` realiza duas etapas assíncronas: aguarda `fetch()` obter a resposta HTTP e depois aguarda `response.json()` consumir o corpo e interpretar o JSON. Entre essas etapas, verifica `response.ok`.

O resultado do helper já é um valor JavaScript interpretado. Portanto, não faça `JSON.parse(usuario)` novamente.

Uma Promise não é o objeto de usuário. É por isso que precisamos aguardar `buscarJSON()` antes de acessar os campos neste exemplo.

Os caminhos começando com `./` são relativos à página aberta. Se o `catch` executar, confira se está usando o servidor HTTP e a pasta correta. Não substitua silenciosamente os dados por outro objeto: o erro precisa ficar visível para ser investigado.

</details>

## 6. Intermediário — separar erro HTTP de JSON inválido

**Objetivo:** identificar em qual etapa a leitura falhou.

Teste os cenários separadamente:

1. Um caminho ausente, `./dados/nao-existe.json`, que retorna HTTP 404 com o servidor recomendado.
2. Um arquivo existente, `./dados/invalido.txt`, que retorna HTTP 200, mas não contém JSON válido.

Use um `try/catch` para cada cenário. Assim o primeiro erro não impede o segundo teste.

<details>
<summary>Ver solução, resultados e explicação</summary>

```js
{
  (async () => {
    try {
      await buscarJSON('./dados/nao-existe.json');
      console.log('Inesperado: o caminho ausente respondeu com sucesso.');
    } catch (erro) {
      console.log(erro.name); // ErroHTTP
      console.log(erro.status); // 404
      console.log(typeof erro.status); // number
    }

    try {
      await buscarJSON('./dados/invalido.txt');
      console.log('Inesperado: o arquivo inválido foi interpretado.');
    } catch (erro) {
      console.log(erro.name); // SyntaxError
      console.log(erro instanceof SyntaxError); // true
    }

    console.log('Os dois cenários foram verificados.');
  })();
}
```

No primeiro caso, a resposta HTTP existe, mas `response.ok` é `false`. O helper lança seu erro `ErroHTTP` com o status numérico. **Um 404, sozinho, não faz `fetch()` rejeitar a Promise automaticamente.**

No segundo caso, o transporte HTTP foi bem-sucedido, mas a interpretação feita por `response.json()` falhou. Receber HTTP 200 não garante que o corpo seja JSON válido.

`ErroHTTP` é o nome usado pelo helper da demonstração, não um tipo de erro criado automaticamente por `fetch()`.

Uma falha de conexão ou um bloqueio de CORS pertence a outro cenário. Não chame qualquer erro de rede de “404” e não conclua que um `TypeError` isolado prova uma falha de CORS.

</details>

## Desafio final — limitar a espera e distinguir o motivo do aborto

**Objetivo:** criar `buscarComTimeout(url, limiteMs)` sem depender de um suposto “tempo de rede garantido”.

Regras:

1. Crie um novo `AbortController` por chamada.
2. Agende um timer que registre o vencimento do limite e aborte a operação.
3. Passe o sinal para `buscarJSON()`.
4. Ao reconhecer um aborto causado por esse limite, lance um erro com nome `TimeoutError`.
5. Preserve erros HTTP, de JSON e outros erros que não sejam esse timeout.
6. Limpe o timer em `finally`, tanto no sucesso quanto na falha.

Use números inteiros positivos em milissegundos. Faça três verificações complementares: leitura local com um limite confortável, sinal já abortado e espera controlada interrompida por timer.

<details>
<summary>Ver solução, testes e explicação</summary>

```js
{
  (async () => {
    async function buscarComTimeout(url, limiteMs) {
      const controlador = new AbortController();
      let limiteAtingido = false;

      const timer = setTimeout(() => {
        limiteAtingido = true;
        controlador.abort();
      }, limiteMs);

      try {
        return await buscarJSON(url, { signal: controlador.signal });
      } catch (erro) {
        if (limiteAtingido && erro.name === 'AbortError') {
          throw new DOMException('O tempo limite da busca foi atingido.', 'TimeoutError');
        }

        throw erro;
      } finally {
        clearTimeout(timer);
      }
    }

    // 1. Leitura local: deve concluir com o servidor funcionando normalmente.
    try {
      const usuario = await buscarComTimeout('./dados/usuario.json', 10000);
      console.log(usuario.name); // Ana Exemplo
    } catch (erro) {
      console.log('Falha na leitura local:', erro.name);
    }

    // 2. Cancelamento já solicitado: não depende da velocidade da resposta.
    const cancelamento = new AbortController();
    cancelamento.abort();

    try {
      await buscarJSON('./dados/usuario.json', { signal: cancelamento.signal });
    } catch (erro) {
      console.log(erro.name); // AbortError
      console.log(cancelamento.signal.aborted); // true
    }

    // 3. Mecanismo de timeout, usando uma espera local controlada.
    const controladorEspera = new AbortController();
    let prazoVencido = false;
    const timerEspera = setTimeout(() => {
      prazoVencido = true;
      controladorEspera.abort();
    }, 10);

    try {
      await aguardar(100, controladorEspera.signal);
    } catch (erro) {
      console.log(erro.name); // AbortError
      console.log(prazoVencido); // true
      console.log(prazoVencido ? 'timeout' : 'cancelamento'); // timeout
    } finally {
      clearTimeout(timerEspera);
    }
  })();
}
```

**Por que criar um controlador novo?** Um sinal abortado permanece abortado. Reutilizá-lo impediria que a próxima solicitação começasse normalmente.

**Por que `return await` neste caso?** Precisamos aguardar `buscarJSON()` dentro do `try`, para que o `catch` trate a rejeição e o `finally` limpe o timer depois que a operação terminar. Devolver a Promise sem aguardar faria o `finally` executar cedo demais.

**Por que registrar `limiteAtingido`?** `controller.abort()` normalmente provoca um `AbortError`. Esse nome, sozinho, não informa se a causa foi um clique em Cancelar ou um timer. O marcador identifica a origem; o wrapper transforma apenas o aborto provocado por seu próprio limite em `TimeoutError`.

O primeiro teste verifica a leitura real do arquivo por HTTP, com um limite de dez segundos. Ele depende de o servidor estar funcionando, mas não exige um tempo de resposta exato.

O segundo verifica cancelamento com um sinal que já estava abortado. Ele não é um teste de timeout da rede.

O terceiro demonstra o mecanismo do prazo com `aguardar()`: o timer solicita aborto antes de a espera controlada terminar. A API de aborto informa `AbortError`, enquanto o marcador confirma que a causa foi o prazo. Esse experimento não mede o servidor nem testa uma demora real do GET.

Não use `buscarComTimeout(url, 1)` como teste com resultado garantido: dependendo da resposta, do cache e do agendamento do navegador, a operação pode terminar ou ser abortada. Os timers também não garantem execução em um instante exato.

A função do desafio trata exclusivamente seu timeout interno. Os exemplos de cancelamento são separados; não adicionamos um sinal externo nem novos listeners aos botões da demonstração.

</details>
