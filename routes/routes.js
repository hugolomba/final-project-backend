const router = require("express").Router();

const User = require("../models/User.model");

router.get("/", (req, res, next) => {
  User.find().then((allUsersFromDB) => {
    res.json(allUsersFromDB);
  });
});

module.exports = router;
