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

---

## 📋 Como rodar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/h1toh/clothing-store.git
