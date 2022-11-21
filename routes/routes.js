const router = require("express").Router();

const User = require("../models/User.model");
const Company = require("../models/Company.model");

const { isAuthenticated } = require("../middlewares/jwt.middleware");

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

// Busca empresa por categoria

router.get("/companies/category/:category", (req, res, next) => {
  const { category } = req.params;
  Company.find({ category: category }).then((foundCompany) => {
    // const [_id, name, username] = allUsersFromDB;
    res.json(foundCompany);
  });
});

// router.get("/companies/category/", (req, res, next) => {
//   const { category } = req.query;
//   Company.find({ category: category }).then((foundCompany) => {
//     // const [_id, name, username] = allUsersFromDB;
//     res.json(foundCompany);
//   });
// });

// ROTAS DE UPDATE

// cadastra serviço
router.post("/companies/editservices/:username", (req, res, next) => {
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

// cadastra oferta
router.post("/companies/editoffers/:username", (req, res, next) => {
  const { username } = req.params;
  const { newOffers } = req.body;

  Company.findOneAndUpdate(
    username,
    { $push: { offers: newOffers } },
    { new: true }
  )
    .then((updatedCompany) => {
      console.log(updatedCompany);
      res.json(updatedCompany);
    })
    .catch((error) => next(error));
});

// edita perfil usuário
router.put("/users/edit", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;

  const {
    name,
    username,
    email,
    phone,
    adresses,
    birthDate,
    profileImg,
    // password,
  } = req.body;

  User.findOneAndUpdate(
    { _id: userId },
    { name, username, email, phone, adresses, birthDate, profileImg },
    { new: true }
  )
    .then((updatedUser) => {
      console.log(updatedUser);
      res.json(updatedUser);
    })
    .catch((error) => next(error));
});

// edita perfil empresa

router.put("/companies/edit", isAuthenticated, (req, res, next) => {
  const companyId = req.payload._id;

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
    // password,
    services,
    description,
    offers,
  } = req.body;

  Company.findOneAndUpdate(
    { _id: companyId },
    {
      name,
      username,
      email,
      phone,
      addresses,
      profileImg,
      coverImg,
      // password,
      description,
    },
    { new: true }
  )
    .then((updatedCompany) => {
      console.log(updatedCompany);
      res.json(updatedCompany);
    })
    .catch((error) => next(error));
});

// deleta serviço

// deleta oferta

//

module.exports = router;
