const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const router = require("express").Router();

const User = require("../models/User.model");

// rotas de autenticação
router.get("/", (req, res, next) => {
  res.send("Tudo certo aqui!"); // rota de teste
});

//ROTAS DE CADASTRO

router.get("/cadastro", (req, res, next) => {
  res.send("Exibe a página de cadastro"); // teste
});

router.post("/cadastro", (req, res, next) => {
  const {
    name,
    username,
    email,
    phone,
    addresses,
    bithDate,
    profileImg,
    password,
  } = req.body;

  // 1 verificar se recebeu as informações necessárias, caso não, gerar erro.
  if (username === "" || password === "") {
    // throw new Error("Informações Obrigatórias");
    res.status(400).json({ message: "Username e Password são obrigatórios" });
    return;
  }

  //2 verificar se nome de usuário já existe e caso já existir, gerar erro.

  User.findOne({ username }).then((foundUser) => {
    if (foundUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }
  });

  // bcrypt
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hashSync(password, salt))
    .then((hashedPassword) => {
      // console.log(`Password hash: ${hashedPassword}`);
      // res.json(req.body);
      return User.create({
        name,
        username,
        email,
        phone,
        addresses,
        bithDate,
        profileImg,
        password: hashedPassword,
      });
    })
    .then((createdUser) => {
      // desestruturar novo objeto para omitir password
      const { name, username, email, phone } = createdUser;
      console.log(`Usuário Criado: , ${name}(${username})`);
      res.status(201).json({ name: name, user: username });
    })
    .catch((error) => next(error));
});

module.exports = router;
