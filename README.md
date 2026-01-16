
# 📌 Taskflow
Sistema de gerenciamento de tarefas construído com NestJS, Prisma e PostgreSQL

#### ⚠️ Observação: Este projeto ainda está em desenvolvimento. Estrutura base pronta com NestJS + Prisma + testes, mas muitas funcionalidades ainda serão implementadas.

## 📋 Sobre o Projeto

TaskFlow é uma aplicação backend moderna para gerenciamento de tarefas, desenvolvida com as melhores práticas e tecnologias atuais do ecossistema Node.js.

## 📦 Tecnologias

- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo para construção de aplicações server-side eficientes e escaláveis
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Prisma](https://www.prisma.io/)** - ORM moderno para TypeScript e Node.js
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Docker](https://www.docker.com/)** - Containerização da aplicação
- **[Jest](https://jestjs.io/)** - Testes unitários

  
## 🚀 Funcionalidades (planejadas / em progresso)

✅ Estrutura do servidor NestJS com módulos organizados  
✅ Configuração de banco de dados com Prisma  
✅ Scripts de build, start e testes  
✅ Endpoints REST para gerenciar tarefas  
✅ Autenticação / Autorização  
⚙️ Documentação Swagger (planejado)  
⚙️ Deploy automatizado (planejado)  

## 📁 Estrutura do Projeto

```
taskflow/
├── prisma/
│   ├── schema.prisma        # Modelos e relacionamentos
│   └── migrations/          # Histórico de migrações
│
├── src/
│   ├── tasks/               # Domínio de tarefas
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   └── tasks.module.ts
│   │
│   ├── projects/            # Domínio de projetos
│   │   ├── projects.controller.ts
│   │   ├── projects.service.ts
│   │   └── projects.module.ts
│   │
│   ├── users/               # Domínio de usuários
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── login/               # Autenticação (login)
│   │   ├── login.controller.ts
│   │   ├── login.service.ts
│   │   └── login.module.ts
│   │
│   ├── guards/              # Guards de autenticação
│   │   └── jwt-auth.guard.ts
│   │
│   ├── prisma/              # Integração com Prisma
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   │
│   │
│   ├── app.module.ts        # Módulo raiz
│   └── main.ts              # Bootstrap da aplicação
│
│
├── docker-compose.yml       # Ambiente de desenvolvimento
├── package.json             # Dependências e scripts
└── README.md

```

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

## ⚙️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/FelipeAraujoBS/taskflow.git
cd taskflow
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/taskflow?schema=public"
```

### 4. Inicie o banco de dados com Docker

```bash
docker-compose up -d
```

### 5. Execute as migrations do Prisma

```bash
npx prisma migrate dev
```

## 🏃 Executando o Projeto

### Modo de desenvolvimento

```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3000`

### Modo de produção

```bash
# Build
npm run build

# Executar
npm run start:prod
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Roadmap

- [ ] Sistema de categorias/tags
- [ ] Priorização de tarefas
- [ ] Datas de vencimento e lembretes
- [ ] Filtros e busca avançada
- [ ] Documentação da API (Swagger)
- [ ] Testes unitários e de integração

## 👤 Autor

**Felipe Araujo**

- GitHub: [@FelipeAraujoBS](https://github.com/FelipeAraujoBS)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
