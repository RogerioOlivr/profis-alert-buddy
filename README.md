# Sistema de Cadastro de Profissionais e Monitoramento de Contratos

## 1. Visão Geral

Esta aplicação foi desenvolvida com o objetivo de gerenciar o cadastro de profissionais de uma empresa e monitorar automaticamente o vencimento de seus contratos.

O sistema permite registrar profissionais, visualizar seus dados em uma listagem com filtros e acompanhar datas importantes relacionadas ao contrato de trabalho.

Além da aplicação web, foi implementada uma automação responsável por verificar periodicamente os contratos cadastrados e enviar notificações por e-mail quando um contrato estiver próximo do vencimento.

A solução foi construída utilizando ferramentas modernas de desenvolvimento assistido por IA, integração com backend gerenciado e automação de processos.

---

# 2. Arquitetura da Solução

A arquitetura da solução foi projetada de forma simples e modular, separando responsabilidades entre interface de usuário, armazenamento de dados, exposição de API e automação.

A aplicação possui os seguintes componentes principais:

Frontend Web
Aplicação responsável pela interface com o usuário. Permite cadastrar profissionais, visualizar registros e aplicar filtros.

Banco de Dados
Responsável por armazenar as informações dos profissionais e seus contratos.

API de Integração
Endpoint que expõe os dados dos profissionais para consumo por ferramentas externas de automação.

Automação
Workflow que consulta a API periodicamente, verifica contratos próximos do vencimento e dispara alertas por e-mail para o responsável.

Essa arquitetura permite desacoplar a lógica de monitoramento da aplicação principal, mantendo o sistema simples e escalável.

---

# 3. Tecnologias Utilizadas

A solução foi construída utilizando as seguintes tecnologias:

Frontend
React
TypeScript
Tailwind CSS
Shadcn UI
Vite

Backend e Banco de Dados
Supabase (PostgreSQL)

API
Supabase Edge Functions

Automação
n8n

Essas tecnologias foram escolhidas por oferecerem rapidez no desenvolvimento, facilidade de integração e boa escalabilidade.

---

# 4. Funcionalidades da Aplicação

A aplicação possui as seguintes funcionalidades principais:

Cadastro de profissionais
Permite registrar profissionais com informações relevantes para controle de contrato.

Listagem de profissionais
Exibe os profissionais cadastrados em formato de tabela para fácil visualização.

Filtros de busca
Permite localizar profissionais específicos e identificar contratos próximos do vencimento.

Integração via API
Disponibiliza um endpoint para consulta dos profissionais cadastrados, permitindo integração com ferramentas externas.

Automação de alertas
Sistema automatizado que monitora contratos próximos do vencimento e envia notificações por e-mail.

---

# 5. Estrutura de Dados

Cada profissional possui os seguintes campos cadastrados:

Nome completo
Email do profissional
Cargo
Data de início do contrato
Data de vencimento do contrato
Email do responsável pelo acompanhamento do contrato

Essas informações permitem identificar o profissional, controlar a duração do contrato e notificar automaticamente o responsável.

---

# 6. Validações Implementadas

Durante o desenvolvimento foram implementadas validações para garantir a consistência dos dados.

Validação de datas
A data de vencimento do contrato não pode ser anterior à data de início. Caso isso ocorra, o sistema impede o cadastro e exibe uma mensagem de erro.

Campos obrigatórios
Campos essenciais como nome, cargo e datas do contrato devem ser preenchidos para que o cadastro seja realizado.

Validação de formato de e-mail
Os campos de e-mail são verificados para garantir que possuam formato válido.

Essas validações ajudam a manter a integridade das informações e evitar inconsistências no banco de dados.

---

# 7. API de Integração

A aplicação disponibiliza um endpoint que permite consultar os profissionais cadastrados e suas respectivas informações contratuais.

Esse endpoint pode ser utilizado por ferramentas externas de automação para processar dados e executar ações baseadas em regras de negócio.

A API também permite filtrar contratos próximos do vencimento com base em um parâmetro de consulta, facilitando a criação de automações que monitorem contratos ativos.

A resposta da API retorna os profissionais cadastrados juntamente com seus dados contratuais e informações do responsável.

---

# 8. Automação de Monitoramento de Contratos

Foi implementada uma automação utilizando a ferramenta n8n para monitorar os contratos registrados no sistema.

Essa automação possui um fluxo simples:

Um gatilho de agendamento executa o workflow diariamente.
O workflow realiza uma requisição HTTP para consultar os dados da API da aplicação.
Os resultados são analisados para verificar se existem contratos próximos do vencimento.
Para cada profissional identificado, um e-mail de notificação é enviado ao responsável.

Essa automação garante que contratos próximos do vencimento sejam identificados automaticamente sem necessidade de monitoramento manual.

---

# 9. Lógica de Funcionamento da Automação

A lógica da automação considera a data atual e a data de vencimento do contrato.

Sempre que a diferença entre essas datas for menor ou igual a cinco dias, o contrato é considerado próximo do vencimento.

Quando essa condição é atendida, a automação envia uma notificação ao responsável informando que o contrato está próximo de expirar, permitindo que as ações necessárias sejam tomadas.

---

# 10. Segurança e Integridade de Dados

A aplicação foi desenvolvida considerando práticas básicas de segurança e controle de dados.

Validação de dados no frontend para evitar entradas inválidas.
Uso de backend gerenciado para armazenamento seguro das informações.
Estrutura preparada para uso de políticas de segurança no banco de dados.

Essas práticas ajudam a garantir que as informações armazenadas sejam consistentes e protegidas.

---

# 11. Uso de Inteligência Artificial no Desenvolvimento

O desenvolvimento da aplicação foi realizado com auxílio de ferramentas de IA para acelerar a criação de funcionalidades e estruturar partes da aplicação.

Foram utilizados prompts para:

geração inicial da estrutura da aplicação
criação das telas de cadastro e listagem
implementação de validações de negócio
criação do endpoint de API
estruturação da automação de monitoramento de contratos

Apesar do uso de IA, as decisões de arquitetura, lógica e validações foram definidas manualmente para garantir que o sistema atendesse corretamente aos requisitos do problema.

---

# 12. Pensamento Crítico Aplicado

Durante o desenvolvimento foram identificados cenários que poderiam gerar inconsistências nos dados.

Um exemplo foi a possibilidade de cadastrar um contrato cuja data de vencimento fosse anterior à data de início.

Esse cenário foi tratado com validações adicionais no sistema para impedir esse tipo de registro.

Essa análise ajuda a garantir que os dados armazenados representem corretamente a realidade do contrato.

---

# 13. Possíveis Melhorias Futuras

Embora o sistema atenda aos requisitos do desafio, algumas melhorias podem ser implementadas em versões futuras.

Autenticação de usuários
Controle de acesso baseado em permissões
Dashboard com indicadores de contratos
Histórico de notificações enviadas
Integração com outros canais de comunicação
Melhorias na observabilidade da automação

Essas melhorias tornariam a aplicação mais robusta e preparada para uso em ambientes corporativos.

---

# 14. Execução do Projeto

Para executar o projeto localmente é necessário possuir Node.js instalado.

Após clonar o repositório, basta instalar as dependências e iniciar o servidor de desenvolvimento.

O ambiente de desenvolvimento permite visualizar a aplicação em tempo real e realizar alterações na interface ou na lógica da aplicação.

---

# 15. Conclusão

A solução desenvolvida atende aos requisitos do desafio ao fornecer um sistema simples de cadastro de profissionais integrado a uma automação capaz de monitorar contratos e enviar alertas automáticos.

A arquitetura adotada permite separar responsabilidades entre interface, dados e automação, facilitando manutenção e evolução futura da aplicação.

O uso de ferramentas modernas e automação contribui para criar um fluxo eficiente de monitoramento de contratos, reduzindo a necessidade de controle manual e melhorando a gestão de informações contratuais.

# 16. Prompts Utilizados no Desenvolvimento

Durante o desenvolvimento da aplicação foram utilizados prompts para orientar ferramentas de IA na geração de código, estrutura da aplicação e ajustes de regras de negócio.

O uso de prompts permitiu acelerar o desenvolvimento inicial da solução, mantendo controle manual sobre as decisões de arquitetura, lógica e validações.

A seguir estão os principais prompts utilizados.

---

## Prompt para criação da aplicação

Este prompt foi utilizado para gerar a estrutura inicial da aplicação web responsável pelo cadastro e listagem de profissionais.

Criar uma aplicação web simples para cadastro de profissionais de uma empresa.

A aplicação deve conter:

Tela de cadastro de profissional com os seguintes campos:

* Nome completo
* Email
* Cargo
* Data de início do contrato
* Data de vencimento do contrato
* Email do responsável

Tela de listagem de profissionais contendo:

* Nome
* Cargo
* Data de início
* Data de vencimento do contrato
* Email do responsável

A listagem deve permitir filtro por nome e visualização de contratos próximos do vencimento.

A aplicação deve permitir adicionar, editar e excluir profissionais.

Os dados devem ser armazenados em uma tabela chamada profissionais.

A aplicação também deve disponibilizar um endpoint de API para que automações externas possam consultar os profissionais cadastrados.

---

## Prompt para melhoria da interface

Este prompt foi utilizado para melhorar a experiência visual da aplicação.

Melhorar a interface da aplicação com uma tabela organizada para visualização dos profissionais cadastrados.

Adicionar campo de busca para localizar profissionais pelo nome.

Destacar visualmente contratos que estejam próximos do vencimento utilizando cores ou indicadores visuais.

Garantir que a interface seja responsiva e organizada para facilitar a leitura dos dados.

---

## Prompt para criação do endpoint de API

Este prompt foi utilizado para permitir a integração da aplicação com ferramentas de automação.

Adicionar um endpoint de API que permita consultar os profissionais cadastrados.

O endpoint deve retornar os seguintes dados:

nome completo
cargo
data de início do contrato
data de vencimento do contrato
email do responsável

A API também deve permitir filtrar profissionais com contratos próximos do vencimento utilizando um parâmetro de consulta que receba a quantidade de dias até o vencimento.

---

## Prompt para validações de regras de negócio

Durante os testes foi identificado um cenário onde a data de vencimento do contrato poderia ser anterior à data de início, o que geraria inconsistência nos dados.

Foi utilizado o seguinte prompt para implementar validações adicionais.

Adicionar validações no cadastro de profissionais para evitar inconsistência nas datas do contrato.

A data de vencimento do contrato não pode ser anterior à data de início.

Caso isso ocorra, impedir o salvamento do registro e exibir uma mensagem de erro informando que a data de vencimento deve ser posterior à data de início.

Também garantir validação de formato de e-mail e campos obrigatórios no formulário.

---

## Prompt para preparação da integração com automação

Este prompt foi utilizado para estruturar os dados da API de forma que pudessem ser facilmente consumidos por ferramentas externas como n8n.

Garantir que a API retorne os dados dos profissionais em formato JSON contendo os campos necessários para automação de monitoramento de contratos.

A resposta deve incluir nome do profissional, cargo, data de vencimento do contrato e email do responsável.

Essas informações serão utilizadas por um workflow externo para envio de alertas de vencimento de contrato.

---


## Demonstração da Automação

<img width="1387" height="588" alt="image" src="https://github.com/user-attachments/assets/0d1dc932-f30d-4e09-adbb-369af56ce68f" />
<img width="1862" height="761" alt="image" src="https://github.com/user-attachments/assets/60595687-c077-4d48-9a95-fddb467a6cda" />
<img width="1883" height="693" alt="image" src="https://github.com/user-attachments/assets/7059a021-56f3-47e5-b9ad-5f60c9f09b84" />
<img width="1512" height="31" alt="image" src="https://github.com/user-attachments/assets/53d9db67-c3f0-41a1-bec0-20161990a26c" />
<img width="1519" height="275" alt="image" src="https://github.com/user-attachments/assets/e0a72131-9639-4bef-af6d-1b3a95253684" />




