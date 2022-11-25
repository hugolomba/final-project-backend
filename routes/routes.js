const router = require("express").Router();

const User = require("../models/User.model");
const Company = require("../models/Company.model");
const Offer = require("../models/Offer.model");

const { isAuthenticated } = require("../middlewares/jwt.middleware");
const fileUploader = require("../configs/cloudinary.config");

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
  Company.find()
    .populate("offers")
    .then((allCompaniesFromDB) => {
      console.log("allCompaniesFromDB: ", allCompaniesFromDB);

      res.json(allCompaniesFromDB);
    });
});

// busca empresa pelo nome de usuário
router.get("/companies/:username", (req, res, next) => {
  const { username } = req.params;
  Company.find({ username: username })
    .populate("offers")
    .then((foundCompany) => {
      console.log("found unique company: ", foundCompany);
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
router.put("/companies/editservices/", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;

  Company.findByIdAndUpdate(
    userId,
    { $push: { services: req.body } },
    { new: true }
  )

    .then((updatedCompany) => {
      console.log(updatedCompany);
      res.json(updatedCompany);
    })
    .catch((error) => next(error));
});

// // cadastra oferta
// router.put("/companies/editoffers/", isAuthenticated, (req, res, next) => {
//   const userId = req.payload._id;

//   console.log("userId ", userId);
//   console.log("req body: ", req.body);

//   Company.findByIdAndUpdate(
//     userId,
//     { $push: { offers: req.body } },
//     { new: true }
//   )

//     .then((updatedCompany) => {
//       console.log(updatedCompany);
//       res.json(updatedCompany);
//     })
//     .catch((error) => {
//       console.log(error);
//       next(error);
//     });
// });

// cadastra oferta (modelo)
router.post(
  "/companies/addoffer",
  isAuthenticated,
  fileUploader.single("profileImg"),
  (req, res, next) => {
    const userId = req.payload._id;
    const { offerName, offerPrice, expiration, offerImg } = req.body;

    Offer.create({
      offerName,
      offerPrice,
      expiration,
      offerImg: req.file && req.file.path,
      company: userId,
    })
      .then((createdOffer) => {
        console.log(`Oferta criada: ${offerName}`);
        res.status(201).json(createdOffer);

        return Company.findByIdAndUpdate(userId, {
          $push: { offers: createdOffer._id },
        }).populate("offers");
      })

      .then((updatedUser) => {
        console.log("updatedUser: ", updatedUser);
        res.status(200).json(updatedUser);
      })
      .catch((error) => console.log(error));
  }
);

// edita perfil usuário
router.put(
  "/users/edit",
  isAuthenticated,
  fileUploader.single("profileImg"),
  (req, res, next) => {
    const userId = req.payload._id;

    const {
      name,
      username,
      email,
      phone,
      adresses,
      // birthDate,
      profileImg,
      // password,
    } = req.body;

    User.findByIdAndUpdate(
      userId,
      {
        name,
        username,
        email,
        phone,
        adresses,
        profileImg: req.file && req.file.path,
      },
      { new: true }
    )
      .then((updatedUser) => {
        console.log(updatedUser);
        res.json(updatedUser);
      })
      .catch((error) => next(error));
  }
);

// edita perfil empresa

router.put(
  "/companies/edit",
  isAuthenticated,
  fileUploader.single("profileImg"),
  (req, res, next) => {
    const companyId = req.payload._id;

    const {
      name,
      username,
      email,
      phone,
      addresses,
      // category,
      // subcategory,
      profileImg,
      // coverImg,
      // password,
      // services,
      description,
      // offers,
    } = req.body;

    Company.findByIdAndUpdate(
      companyId,
      {
        name,
        username,
        email,
        phone,
        addresses,
        profileImg: req.file && req.file.path,
        // coverImg,
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
  }
);

// deleta usuário

router.delete("/users", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;

  User.findByIdAndDelete(userId)
    .then((deletedUser) => {
      console.log(`Usuário ${deletedUser.username} deletado!`);
      res.json(`Usuário ${deletedUser.username} deletado!`);
    })

    .catch((error) => next(error));
});

// deleta empresa

router.delete("/companies", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;

  Company.findByIdAndDelete(userId)
    .then((deletedUser) => {
      console.log(`Empresa ${deletedUser.username} deletada!`);
      res.json(`Empresa ${deletedUser.username} deletada!`);
    })

    .catch((error) => next(error));
});

// deleta serviço

// deleta oferta

//

module.exports = router;
