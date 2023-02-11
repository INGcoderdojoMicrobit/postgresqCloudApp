const { Router } = require("express");
const router = Router();

router.delete("/uczen/:id", async (req, res) => {
  const id = req.params.id;

  const result = await req.db.query("delete from uczen where id = ? returning *", [id]);

  res.json(result.rows[0]);
});

router.get("/deleteuczen/:id", async (req, res) => {
  const id = req.params.id;

  const result = await req.db.query("delete from uczen where id = ? returning *", [id]);

  res.json(result.rows[0]);
});

module.exports = router;
