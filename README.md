# 👕 Projeto Loja de Roupas - API REST

Este é um projeto inicial de uma loja de roupas, que atualmente conta com uma API REST para gerenciamento de produtos. A API permite criar, listar, atualizar e excluir produtos, com validações básicas para garantir a integridade dos dados.

Atualmente, os dados estão armazenados temporariamente em memória, sem persistência após reiniciar o servidor.

---

## 🚀 Funcionalidades da API

- **GET /produtos** — Listar todos os produtos
- **GET /produtos/:id** — Obter produto específico por ID
- **POST /produtos** — Criar novo produto
- **PUT /produtos/:id** — Atualizar produto existente
- **DELETE /produtos/:id** — Remover produto do catálogo

---

## 🛠 Tecnologias Utilizadas

- Node.js
- Express
- JavaScript

---

## 📋 Como rodar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/h1toh/clothing-store.git

2. Instale as dependências:
   ```bash
   npm install


3. Execute o servidor:
   ```bash
   node index.js


4. Utilize ferramentas como Postman, Insomnia ou curl para testar os endpoints.

---

🔮 Próximos Passos

Este projeto está em desenvolvimento e futuramente contará com:

Banco de dados para persistência dos dados

Front-end completo para a loja, consumindo a API

Sistema de autenticação para administração segura

Implementação de carrinho de compras e checkout

Testes automatizados e documentação da API

---
