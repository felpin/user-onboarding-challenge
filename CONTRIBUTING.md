# CONTRIBUTING

## .env

Para rodar o código localmente, é necessário criar um arquivo ".env" na raiz do projeto.

Este arquivo contém as variáveis de ambiente do processo que serão automaticamente carregadas ao iniciar o servidor.

O arquivo deve conter a seguinte estrutura:

```txt
DB_CONNECTION_STRING=<string de conexão com o banco de dados>
PORT=<porta utilizada para rodar a aplicação>
```

## Dados iniciais

Os dados iniciais encontram-se na Amazon [https://s3.amazonaws.com/conpass-desafio/conpass_desafio.7z](https://s3.amazonaws.com/conpass-desafio/conpass_desafio.7z)

Após baixá-los, fazer download e restaurá-los com o comando

```bash
mongorestore -d conpass ./
```

## Indexes

Os dados iniciais não possuem nenhum index. Para que os dados sejam acessados mais rapidamente, alguns indexes precisam ser criados.

Os comando abaixo devem ser executados no mongo no banco de dados para o qual foi feita a restauração:

```bash
db.steps.createIndex({ flow: 1 });
```

```bash
db.activities.createIndex({ step: 1 });
```

```bash
db.activities.createIndex({ type: 1, status: 1, occured: 1 });
```
