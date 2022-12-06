# CATALOGO Backend - Projeto Final Ironhack

Servidor desenvolvido para a aplicação CATALOG, projeto final do bootcamp de desenvolvimento web na Ironhack.

## Como usar

- fork

- clone

```

npm i

```

### Environment variables

```
- MONGO_URI
- CLOUDINARY_NAME
- CLOUDINARY_KEY
- CLOUDINARY_SECRET
- JWT_SECRET
```

## Endpoints

- Rotas de empresa:

| method | endpoint                      | body  | action                               |
| ------ | ----------------------------- | ----- | ------------------------------------ |
| POST   | /company/authcadastro         | JSON  | cadastra uma nova empresa            |
| POST   | /company/auth/login           | JSON  | faz login de uma empresa             |
| POST   | /company/auth/verify          | JSON  | verifica a autenticação da empresa   |
| POST   | /companies/service            | JSON  | cadastra novo serviço para a empresa |
| POST   | /companies/offer              | JSON  | cadastra nova oferta para a empresa  |
| GET    | /companies                    | empty | lista todas as empresas              |
| GET    | /companies/:username          | empty | mostra uma empresa específica        |
| GET    | /companies/category/:category | empty | mostra empresas em uma categoria     |
| PUT    | /projects/:projectId          | JSON  | edits specific project               |
| DELETE | /companies                    | empty | remove uma empresa                   |
| DELETE | /companies/service/:serviceId | empty | remove um serviço de empresa         |
| DELETE | /companies/service/:offerId   | empty | remove uma oferta de empresa         |

---

- Rotas de usuário:

| method | endpoint           | body  | action                             |
| ------ | ------------------ | ----- | ---------------------------------- |
| POST   | /user/authcadastro | JSON  | cadastra um novo usuário           |
| POST   | /user/auth/login   | JSON  | faz login de um usuário            |
| POST   | /user/auth/verify  | JSON  | verifica a autenticação do usuário |
| GET    | /user              | empty | lista todos os usuários            |
| GET    | /user/:username    | empty | mostra um usuário específico       |
| PUT    | /users/edit        | JSON  | edita um usuário específico        |
| DELETE | /users             | empty | deleta usuário                     |
