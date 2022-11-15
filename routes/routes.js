const router = require("express").Router();

const User = require("../models/User.model");
const Company = require("../models/Company.model");

router.get("/users", (req, res, next) => {
  User.find().then((allUsersFromDB) => {
    // const [_id, name, username] = allUsersFromDB;
    res.json(allUsersFromDB);
  });
});

router.get("/companies", (req, res, next) => {
  Company.find().then((allCompaniesFromDB) => {
    // const [_id, name, username] = allUsersFromDB;
    res.json(allCompaniesFromDB);
  });
});

module.exports = router;
