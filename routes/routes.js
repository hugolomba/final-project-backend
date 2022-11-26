const router = require("express").Router();

const User = require("../models/User.model");
const Company = require("../models/Company.model");
const Offer = require("../models/Offer.model");
const Service = require("../models/Service.model");

const { isAuthenticated } = require("../middlewares/jwt.middleware");
const fileUploader = require("../configs/cloudinary.config");

// ROTAS DE VISUALIZAÇÃO

// todos os usuários
router.get("/users", (req, res, next) => {
  User.find()
    .populate("offers")
    .populate("services")
    .then((allUsersFromDB) => {
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
    .populate("services")
    // .populate("services")
    .then((allCompaniesFromDB) => {
      // console.log("allCompaniesFromDB: ", allCompaniesFromDB);

      res.json(allCompaniesFromDB);
    });
});

// busca empresa pelo nome de usuário
router.get("/companies/:username", (req, res, next) => {
  const { username } = req.params;
  Company.find({ username: username })
    .populate("offers")
    .populate("services")
    // .populate("services")
    .then((foundCompany) => {
      // console.log("found unique company: ", foundCompany);
      res.json(foundCompany);
    });
});

// Busca empresa por categoria

router.get("/companies/category/:category", (req, res, next) => {
  const { category } = req.params;
  Company.find({ category: category })
    .populate("offers")
    .populate("services")
    .then((foundCompany) => {
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

// cadastra serviço (modelo)
router.post(
  "/companies/service",
  isAuthenticated,
  fileUploader.single("serviceImg"),
  (req, res, next) => {
    const userId = req.payload._id;
    const { serviceName, servicePrice, serviceImg } = req.body;

    Service.create({
      serviceName,
      servicePrice,
      serviceImg: req.file && req.file.path,
      company: userId,
    })
      .then((createdService) => {
        console.log(`Oferta criada: ${serviceName}`);
        res.status(201).json(createdService);

        return Company.findByIdAndUpdate(userId, {
          $push: { services: createdService._id },
        })
          .populate("services")
          .populate("offers");
      })

      .then((updatedUser) => {
        console.log("updatedUser: ", updatedUser);
        res.status(200).json(updatedUser);
      })
      .catch((error) => console.log(error));
  }
);

// cadastra oferta (modelo)
router.post(
  "/companies/offer",
  isAuthenticated,
  fileUploader.single("offerImg"),
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
        })
          .populate("offers")
          .populate("services");
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
      .populate("offers")
      .populate("services")
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

router.delete(
  "/companies/service/:serviceId",
  isAuthenticated,
  async (req, res, next) => {
    const userId = req.payload._id;
    const { serviceId } = req.params;

    try {
      await User.findByIdAndUpdate(userId, { $pull: { services: serviceId } });
      await Service.findByIdAndDelete(serviceId);
      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
);

// deleta oferta
router.delete(
  "/companies/offer/:offerId",
  isAuthenticated,
  async (req, res, next) => {
    const userId = req.payload._id;
    const { offerId } = req.params;

    try {
      await User.findByIdAndUpdate(userId, { $pull: { offers: offerId } });
      await Offer.findByIdAndDelete(offerId);
      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
);

//

module.exports = router;
