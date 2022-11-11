// app.js

// pacotes
require("dotenv/config"); // permite acesso ao arquivo .env
const express = require("express");
const app = express();

// banco de dados
require("./db");

// configurações
require("./configs")(app);

// rotas
app.use("/auth", require("./routes/auth.routes"));

// teste de rota de visualização
app.use("/ver", require("./routes/routes.js"));

// erros
require("./error-handling")(app); // importamos e executamos a função já executando ela.

// exportar app
module.exports = app;
