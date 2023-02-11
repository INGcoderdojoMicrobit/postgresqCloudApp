const { Router } = require("express");
const router = Router();

//req.db
/**
 * @param {import('express').Request} req
 * @param {import('pg').Connection} req.db
 */
router.get("/helloworld", (req, res) => {
  res.send("Hello World!");
});

module.exports = router;
