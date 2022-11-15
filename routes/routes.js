const router = require("express").Router();

const User = require("../models/User.model");
const Company = require("../models/Company.model");

// ROTAS DE VISUALIZAÇÃO

// todos os usuários
router.get("/users", (req, res, next) => {
  User.find().then((allUsersFromDB) => {
    // const [_id, name, username] = allUsersFromDB;
    res.json(allUsersFromDB);
  });
});

// busca usuário pelo nome de usuário
router.get("/users/:username", (req, res, next) => {
  const { username } = req.params;
  User.find({ username: username }).then((foundUser) => {
    // const [_id, name, username] = allUsersFromDB;
    res.json(foundUser);
  });
});

//todas as empresas
router.get("/companies", (req, res, next) => {
  Company.find().then((allCompaniesFromDB) => {
    // const [_id, name, username] = allUsersFromDB;
    res.json(allCompaniesFromDB);
  });
});

// busca empresa pelo nome de usuário
router.get("/companies/:username", (req, res, next) => {
  const { username } = req.params;
  Company.find({ username: username }).then((foundCompany) => {
    // const [_id, name, username] = allUsersFromDB;
    res.json(foundCompany);
  });
});

// ROTAS DE UPDATE

// cadastra serviço
router.post("/companies/:username/editservices", (req, res, next) => {
  const { username } = req.params;
  const { newServices } = req.body;

  Company.findOneAndUpdate(
    username,
    { $push: { services: newServices } },
    { new: true }
  )
    .then((updatedCompany) => {
      console.log(updatedCompany);
      res.json(updatedCompany);
    })
    .catch((error) => next(error));
});

//

module.exports = router;
