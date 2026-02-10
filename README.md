# Catalog Service

Serviço de catálogo de produtos em Node.js com TypeScript. API REST para CRUD de produtos, persistência em MongoDB e publicação de eventos em RabbitMQ.

## Tecnologias

- **Runtime:** Node.js
- **Linguagem:** TypeScript
- **Framework HTTP:** Fastify
- **Validação / schemas:** Zod
- **Banco de dados:** MongoDB
- **Mensageria:** RabbitMQ (amqplib)
- **Documentação:** OpenAPI (Swagger UI em `/docs`)
- **Testes:** Jest

## Arquitetura

O projeto segue uma estrutura em camadas (Clean Architecture):

- **`domain`** — entidades, eventos e interfaces de repositório
- **`application`** — DTOs e casos de uso (insert, get, update, delete, list)
- **`infrastructure`** — implementações (MongoDB, RabbitMQ)
- **`presentation`** — controllers, rotas e schemas HTTP

## Pré-requisitos

- Node.js (recomendado v22)
- Docker e Docker Compose (para MongoDB e RabbitMQ)

## Configuração

1. Clone o repositório e instale as dependências:

```bash
npm install
```

2. Copie o arquivo de ambiente de exemplo e ajuste se necessário:

```bash
cp .env.example .env
```

Variáveis em `.env`:

| Variável     | Descrição                    | Padrão                          |
|-------------|------------------------------|---------------------------------|
| `PORT`      | Porta do servidor            | `3001`                          |
| `MONGO_URI` | URI de conexão do MongoDB    | `mongodb://localhost:27017`     |
| `RABBITMQ_URI` | URI do RabbitMQ           | `amqp://guest:guest@localhost:5672` |

3. Suba MongoDB e RabbitMQ com Docker Compose:

```bash
docker-compose up -d
```

- MongoDB: porta `27017`
- RabbitMQ: porta `5672` (AMQP) e `15672` (management UI)

## Executando

**Desenvolvimento (watch):**

```bash
npm run dev
```

**Produção (com Docker):**

```bash
docker build -t catalog-service .
docker run -p 3001:3001 --env-file .env catalog-service
```

O servidor sobe em `http://localhost:3001` (ou na porta definida em `PORT`).

## API

Base path: **`/api/v1`**

| Método | Endpoint           | Descrição        |
|--------|--------------------|------------------|
| POST   | `/products`        | Criar produto    |
| GET    | `/products/:id`    | Buscar por ID    |
| PUT    | `/products/:id`    | Atualizar produto|
| DELETE | `/products/:id`    | Remover produto  |

**Documentação interativa:** [http://localhost:3001/docs](http://localhost:3001/docs) (Swagger UI)

### Exemplo de corpo para criar/atualizar produto

```json
{
  "name": "Produto Exemplo",
  "description": "Descrição do produto",
  "price": 29.99,
  "stock": 100
}
```

### Eventos (RabbitMQ)

Quando RabbitMQ está configurado, o serviço publica:

- `catalog.product.created` — produto criado
- `catalog.product.updated` — produto atualizado
- `catalog.product.deleted` — produto removido

Se o RabbitMQ não estiver disponível, os eventos são ignorados (NoOp) e a aplicação continua funcionando.

## Testes

```bash
# Testes unitários
npm test

# Testes de integração (ex.: repositório MongoDB)
npm run test:integration
```

## Scripts

| Script              | Descrição                          |
|--------------------|------------------------------------|
| `npm run dev`      | Sobe o servidor em modo watch      |
| `npm test`         | Roda os testes unitários           |
| `npm run test:integration` | Roda testes de integração (timeout 10s) |

## Licença

ISC
