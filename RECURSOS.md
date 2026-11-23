# Recursos para estudar APIs e JSON

**Aula: APIs e JSON — como o JavaScript conversa com o mundo.**

**Links conferidos em 23/11/2026.** Os níveis abaixo são sugestões para organizar o estudo; conhecer funções, objetos e arrays ajuda a acompanhar os exemplos.

## Documentação e serviços para praticar

| Fonte e link consultado | Idioma | Nível sugerido | Por que é útil |
| --- | --- | --- | --- |
| [MDN — API](https://developer.mozilla.org/pt-BR/docs/Glossary/API) | Português | Iniciante | Define API como uma interface de interação entre softwares. Ajuda a entender que uma API pode oferecer acesso a recursos do navegador ou de um serviço externo. |
| [MDN — Trabalhando com JSON](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Scripting/JSON) | Português | Iniciante | Explica a estrutura do JSON e a conversão entre texto JSON e valores JavaScript com `JSON.parse` e `JSON.stringify`. Alguns exemplos usam `XMLHttpRequest`; nesta prática, a requisição pode ser feita com `fetch`. |
| [MDN — Usando Fetch](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Using_Fetch) | Português, com alguns trechos em inglês | Iniciante a intermediário | Apresenta requisições, respostas e leitura dos dados. Confira especialmente `response.ok`: uma resposta HTTP 404 não faz o `fetch` rejeitar automaticamente a Promise. |
| [MDN — Funções assíncronas](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/async_function) | Português, com alguns trechos em inglês | Iniciante a intermediário | Explica que uma função `async` retorna uma Promise e como `await` permite aguardar resultados dentro dela. Serve para entender a espera pela resposta e pela leitura do JSON. |
| [JSONPlaceholder — guia oficial](https://jsonplaceholder.typicode.com/guide/) e [GET /users/1](https://jsonplaceholder.typicode.com/users/1) | Inglês | Iniciante | API de dados fictícios para aprender e testar requisições. O site informa que dispensa cadastro e chave de API. O endpoint consultado retornou um objeto com `id`, `name`, `email` e outros campos. |
| [public-apis/public-apis](https://github.com/public-apis/public-apis) | Inglês | Iniciante com apoio da documentação de cada serviço | Diretório de APIs indicado na aula. As tabelas apresentam descrição e informações como autenticação, HTTPS e CORS para descobrir serviços que possam servir ao seu projeto. |

O repositório `public-apis/public-apis` é um catálogo, e cada serviço listado tem sua própria API. Antes de escolher outro serviço para praticar, consulte a documentação oficial dele e confirme autenticação, limites de uso, disponibilidade e suporte a CORS no navegador. Os valores dessas características variam entre as APIs e podem mudar.

No JSONPlaceholder, operações de escrita apresentadas pelo guia são simuladas; o serviço é adequado para exercícios com dados fictícios. Para começar esta aula, use apenas a consulta `GET /users/1`.

## Canais oficiais em português

Os links abaixo levam aos canais gerais; a recomendação não significa que todos os vídeos de um canal cubram APIs e JSON.

| Canal | Idioma | Nível sugerido | Como aproveitar |
| --- | --- | --- | --- |
| [Hashtag Dev](https://www.youtube.com/channel/UCOp4xQHR-g_xJKSI9F3bGcw) | Português | Iniciante a intermediário | Canal da aula de Fetch indicada abaixo, voltado a desenvolvimento web e exemplos práticos. |
| [Hashtag Programação](https://youtube.com/hashtagprogramacao) | Português | Iniciante a intermediário; varia conforme a série | Canal vinculado pelo [site oficial](https://www.hashtagtreinamentos.com/programacao-assincrona-com-javascript), com a aula de programação assíncrona indicada abaixo. |
| [Matheus Battisti — Hora de Codar](https://www.youtube.com/channel/UCDoFiMhpOnLFq1uG4RL4xag) | Português | Iniciante a intermediário; varia conforme a série | Canal complementar para estudar JavaScript e projetos. Está vinculado pelo [site oficial](https://horadecodar.com.br/o-que-e-async-await-em-javascript-conheca-as-funcoes-assincronas/). |

## Videoaulas específicas

| Aula e canal | Idioma | Nível sugerido | Relação com esta aula |
| --- | --- | --- | --- |
| [Aprenda Fetch API em 12 Minutos (com Exemplos Práticos)](https://www.youtube.com/watch?v=CisMh-qrd5c) — Hashtag Dev | Português | Iniciante com noções de funções | A descrição e o conteúdo indexado incluem requisições, Promises, `.then`, `.catch`, `response.ok` e `.json()`. Ajuda a acompanhar o caminho entre a requisição e os dados recebidos. |
| [Programação Assíncrona Async Await com JavaScript](https://www.youtube.com/watch?v=dEqo8xwGaD0) — Hashtag Programação | Português | Iniciante com noções de funções | Apresenta a espera por operações assíncronas e uma consulta de informações por API. Use para reforçar por que os dados precisam ser aguardados antes de serem utilizados. |

A abertura direta das páginas de vídeo falhou na ferramenta; títulos, canais e URLs foram conferidos por metadados do YouTube na busca, sem teste de reprodução.

## Roteiro de estudo

1. Leia a definição de API e desenhe o fluxo cliente → requisição → servidor → resposta.
2. Escreva um objeto JavaScript simples, transforme-o com `JSON.stringify` e recupere o valor com `JSON.parse`. Compare o texto JSON com o objeto usado pelo código.
3. Abra o endpoint `GET /users/1` do JSONPlaceholder e identifique os campos que deseja exibir, como nome e e-mail.
4. Faça a consulta com `fetch`, confira `response.ok` e aguarde `response.json()`. Observe a requisição e a resposta na aba de rede do navegador.
5. Organize a consulta em uma função `async`, usando `await` e `try/catch`. Teste uma resposta de sucesso e um recurso inexistente para conferir o tratamento do status HTTP.
6. Exiba os dados na página com `textContent` e mostre uma mensagem de carregamento e outra de erro. Explique a diferença entre receber a resposta HTTP e obter os valores após a leitura do JSON.
7. Explore uma categoria do diretório public-apis. Escolha uma API e leia sua documentação antes de adaptar o exercício para ela.

Para praticar, use o editor e o navegador. ChatGPT e Copilot podem apoiar explicações ou revisão do código; Excalidraw pode ser usado opcionalmente para desenhar o fluxo. Essas ferramentas não são pré-requisitos para executar a consulta.
