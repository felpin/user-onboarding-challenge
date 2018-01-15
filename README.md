# user-onboarding-challenge

Esta API é o resultado do teste prático da Conpass. Ela apresenta listagem e criação das entidades e alguns relatórios.

Os exemplos abaixo assumem que uma versão está sendo executada em http://localhost:3000/

## Entidades

Existem quatro entidades principais nesse sistema: User, Flow, Step e Activity. Elas são explicadas abaixo:

### User

Esta entidade representa um usuário de um sistema de um cliente da Conpass.

Para acessar a lista de todos os usuário, realizar uma requisição GET para http://localhost:3000/users.  O retorno será um array da seguinte entidade:

```json
{
  "id": "(string) o id do usuário",
  "name": "(string) o nome do usuário",
  "email": "(string) o email do usuário",
  "alias": "(string) um alias para identificar o usuário"
}
```

Também é possível obter um único usuário realizando uma requisição GET para http://localhost:3000/users/:id, onde :id é o id de um usuário.

Para criar novos usuário, deve-se realizar uma requisição POST para http://localhost:3000/users com o seguinte corpo:

```json
{
  "name": "(string, required) o nome do usuário",
  "email": "(string, required) o email do usuário",
  "alias": "(string, required) um alias para identificar o usuário"
}
```

Se a requisição for um sucesso, será retornado um HTTP 201 contendo o id do usuário no cabeçalho location.

### Flow

Esta entidade representa um fluxo que um usuário pode realizar. Um fluxo é composto por zero ou mais passos.

Para acessar a lista de todos os fluxos, realizar uma requisição GET para http://localhost:3000/flows.  O retorno será um array da seguinte entidade:

```json
{
  "id": "(string) o id do fluxo",
  "title": "(string) o título do fluxo",
  "steps": [
    {
      "id": "(string) o id so passo",
      "title": "(string) o título do passo"
    }
  ]
}
```

Também é possível obter um único fluxo realizando uma requisição GET para http://localhost:3000/flows/:id, onde :id é o id de um fluxo.

Para criar novos fluxos, deve-se realizar uma requisição POST para http://localhost:3000/flows com o seguinte corpo:

```json
{
  "title": "(string, required) o título do fluxo"
}
```

Se a requisição for um sucesso, será retornado um HTTP 201 contendo o id do fluxo no cabeçalho location.

### Step

Um passo é a unidade básica de um fluxo. Um fluxo contém zero ou mais passos.

A forma de obtenção dos passos é apenas através da rota de fluxos. Sao listados os fluxos com seus passos.

Para criar novos passos, deve-se realizar uma requisição POST para http://localhost:3000/steps com o seguinte corpo:

```json
{
  "title": "(string, required) o título do fluxo",
  "flow": "(string, required) o id do fluxo ao qual este passo pertence"
}
```

Se a requisição for um sucesso, será retornado um HTTP 201 contendo o id do passo no cabeçalho location.

### Activity

Uma atividade é uma ação realizada por um usuário. Ela pode ser de um fluxo ou de um passo. também pode ser uma ação de início, de fim ou de cancelamento.

Assim como a entidade Step, não é possível obtê-las diretamente. Esta entidade é utilizada para a geração dos relatórios.

Existem seis rotas para criação de atividades, são elas:

* http://localhost:3000/activities/flow-start: início de fluxo
* http://localhost:3000/activities/flow-end: fim de fluxo
* http://localhost:3000/activities/flow-cancel: cancelamento de fluxo
* http://localhost:3000/activities/step-start: início de passo
* http://localhost:3000/activities/step-end: fim de passo
* http://localhost:3000/activities/step-cancel: cancelamento de passo

Todas as rotas acima necessitam que a requisição seja POST e o corpo seja:

```json
{
  "ref": "(string, required) id do fluxo ou do passo, dependendo a rota utilizada",
  "user": "(string, required) id do usuário responsável pela ação"
}
```

Se a requisição for um sucesso, será retornado um HTTP 201 contendo o id da atividade no cabeçalho location.

## Relatórios

Existem dois tipos de relatórios: os de atividade e os de usuário.

### Relatórios de Atividade

Estes relatórios analisam as atividades existentes e geram resultados baseados nesta análise.

Os relatórios de fluxo analisam as todas as atividades de fluxo. Já os relatórios de passo analisam apenas os passos de um determinado fluxo.

Os relatórios de fluxo são:

* http://localhost:3000/reports/most-canceled-flows: fluxos mais cancelados
* http://localhost:3000/reports/most-completed-flows: fluxos mais finalizados
* http://localhost:3000/reports/most-used-flows: fluxos mais utilizados

Qualquer um destes produz um array de:

```json
{
  "flow": {
    "id": "(string) o id do fluxo",
    "title": "(string) o título do fluxo"
  },
  "count": "(number) o número de atividades relacionadas ao fluxo, seja de utilização, finalização ou cancelamento"
}
```

Os relatórios de passo são:

* http://localhost:3000/reports/most-canceled-steps/:id: passos mais cancelados no fluxo com id ":id"
* http://localhost:3000/reports/most-completed-steps/:id: passos mais finalizados no fluxo com id ":id"
* http://localhost:3000/reports/most-used-steps/:id: passos mais utilizados no fluxo com id ":id"

Qualquer um destes produz um array de:

```json
{
  "step": {
    "id": "(string) o id do passo",
    "title": "(string) o título do passo"
  },
  "count": "(number) o número de atividades relacionadas ao passo, seja de utilização, finalização ou cancelamento"
}
```

OBS: após uma análise dos dados iniciais de teste e o resultado produzido pelos relatórios, foram observadas algumas inconsistências, como por exemplo, para um determinado fluxo, existem mais atividade o cancelando do que o criando.

Foram feitas versões alternativas para as rotas acima, onde o resultado de atividades canceladas ou finalizadas não pode ser maior do que o número de atividades de inicialização.

Para acessar estas rotas alternativas, colocar "-alternative" ao final do endpoint. Por exemplo http://localhost:3000/reports/most-canceled-flows-alternative ou http://localhost:3000/reports/most-canceled-steps-alternative/:id

### Relatórios de Usuários

Os relatórios de usuário produzem como resultado uma lista de usuários. São eles:

* http://localhost:3000/user-reports/users-started-flow/:id: usuários que iniciaram o fluxo com id ":id"
* http://localhost:3000/user-reports/users-completed-flow/:id: usuários que finalizaram o fluxo com id ":id"
* http://localhost:3000/user-reports/users-canceles-flow/:id: usuários que cancelaram o fluxo com id ":id"
* http://localhost:3000/user-reports/users-started-step/:id: usuários que iniciaram o passo com id ":id"
* http://localhost:3000/user-reports/users-completed-step/:id: usuários que finalizaram o passo com id ":id"
* http://localhost:3000/user-reports/users-canceles-step/:id: usuários que cancelaram o passo com id ":id"

### Filtrando por períodos

É possível filtrar qualquer relatório, seja de atividade ou de usuário, por um período de tempo. Para isso utiliza-se os parâmetros de URL "since" e "until".

Por exemplo, para obter os usuários que iniciaram o fluxo com id 5a5663eedff37114608e333c entre 10/09/2017 e 17/09/2017, a URL é http://localhost:3000/user-reports/users-started-flow/5a5663eedff37114608e333c?since=2017-09-10T00:00:00Z&until=2017-09-18T00:00:00Z
