const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const router = require("express").Router();

const Company = require("../models/Company.model");

// CLOUDNARY;
// ********* require fileUploader in order to use it *********
const fileUploader = require("../configs/cloudinary.config");

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
      category,
      subcategory,
      profileImg,
      coverImg,
      password,
      services,
      description,
      offers,
    } = req.body;

    // 1 verificar se recebeu as informações necessárias, caso não, gerar erro.
    if (username === "" || password === "") {
      // throw new Error("Informações Obrigatórias");
      res.status(400).json({ message: "Username e Password são obrigatórios" });
      return;
    }

    //2 verificar se nome de usuário já existe e caso já existir, gerar erro.

    Company.findOne({ username }).then((foundCompany) => {
      if (foundCompany) {
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
        return Company.create({
          name,
          username,
          email,
          phone,
          addresses,
          category,
          subcategory,
          profileImg: req.file.path,
          coverImg,
          password: hashedPassword,
          services,
          description,
          offers,
        });
      })
      .then((createdCompany) => {
        // desestruturar novo objeto para omitir password
        const { name, username, email, phone } = createdCompany;
        console.log(`Empresa Criada: , ${name}(${username})`);
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

  Company.findOne({ username })
    .then((foundCompany) => {
      if (!foundCompany) {
        // se não existir, mande uma repsosta de erro
        res.status(401).json({ message: "Usuário ou senha não encontrados" });
        return;
      }

      // comparar o password com o salvo
      const passwordCorret = bcrypt.compareSync(
        password,
        foundCompany.password
      );

      if (passwordCorret) {
        // desestruturar password object pra omitir password
        const { _id, username } = foundCompany;

        // criar um objeto que vai ser definido como payload do token
        const payload = { _id, username };

        // criar e assinar o token
        const authToken = jwt.sign(payload, process.env.JWT_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // enviar o token como resposta
        res.status(200).json({ authToken: authToken });
      } else {
        res
          .status(401)
          .json({ message: "Não é possível autenticar o usuário" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal Server Error", error: err });
      console.log(err);
    });
});

module.exports = router;
