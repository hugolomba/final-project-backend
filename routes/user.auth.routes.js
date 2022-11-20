const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// CLOUDNARY;
// ********* require fileUploader in order to use it *********
const fileUploader = require("../configs/cloudinary.config");

const User = require("../models/User.model");

// rotas de autenticação
router.get("/", (req, res, next) => {
  res.send("Tudo certo aqui!"); // rota de teste
});

//ROTAS DE CADASTRO

router.get("/cadastro", (req, res, next) => {
  res.send("Exibe a página de cadastro"); // teste
});

router.post(
  "/cadastro",
  fileUploader.single("profileImg"),
  (req, res, next) => {
    const {
      name,
      username,
      email,
      phone,
      addresses,
      bithDate,
      profileImg,
      password,
      type,
    } = req.body;

    // console.log("payload: ", req.payload);
    // console.log("arquivo: ", req.file);

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
        // console.log(req);
        return User.create({
          name,
          username,
          email,
          phone,
          addresses,
          bithDate,
          profileImg: req.file && req.file.path,
          password: hashedPassword,
          type,
        });
      })
      .then((createdUser) => {
        // desestruturar novo objeto para omitir password
        const { name, username, email, phone } = createdUser;
        console.log(`Usuário Criado: , ${name}(${username})`);
        res.status(201).json({ name: name, user: username });
      })
      .catch((error) => next(error));
  }
);

// ROTA DE LOGIN

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  // Check if email or password are provided as empty string
  if (username === "" || password === "") {
    res.status(400).json({ message: "Informe um email e uma senha" });
    return;
  }

  // checar na coleção se existe um usuário com o mesmo username

  User.findOne({ username })
    .then((foundUser) => {
      if (!foundUser) {
        // se não existir, mande uma repsosta de erro
        res.status(401).json({ message: "Usuário ou senha não encontrados" });
        return;
      }

      // comparar o password com o salvo
      const passwordCorret = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorret) {
        // desestruturar password object pra omitir password
        const {
          _id,
          name,
          username,
          email,
          phone,
          addresses,
          bithDate,
          profileImg,
        } = foundUser;

        // criar um objeto que vai ser definido como payload do token
        const payload = {
          _id,
          name,
          username,
          email,
          phone,
          addresses,
          bithDate,
          profileImg,
        };

        // criar e assinar o token
        const authToken = jwt.sign(payload, process.env.JWT_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // enviar o token como resposta
        res.status(200).json({ authToken: authToken });
        console.log("Token de Usuário Criado!");
      } else {
        res
          .status(401)
          .json({ message: "Não é possível autenticar o usuário" });
      }
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});

// ROTA DE VERIFICAÇÃO

router.get("/verify", isAuthenticated, (req, res, next) => {
  try {
    res.status(200).json({ authenticatedUser: req.payload });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
