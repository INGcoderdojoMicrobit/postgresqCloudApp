const { Router } = require("express");
const router = Router();

router.put("/uczen", async (req, res) => {
  const { imie, nazwisko, teacher } = req.body;

  if (!imie || !nazwisko || !teacher) return res.status(400).send("Nie podano imienia lub nazwiska");

  if (teacher !== 1 && teacher !== 0) return res.status(400).send("Teacher musi mieć wartość 0 lub 1");

  const { rows } = await req.db.query("insert into uczen (imie, nazwisko, is_teacher) values ($1, $2, $3) returning *", [
    imie,
    nazwisko,
    teacher == 1
  ]);

  res.status(200).send(rows[0]);
});

router.get("/putuczen", async (req, res) => {
  const { imie, nazwisko, teacher } = req.query;

  if (!imie || !nazwisko || !teacher) return res.status(400).send("Nie podano imienia lub nazwiska");

  if (teacher !== 1 && teacher !== 0) return res.status(400).send("Teacher musi mieć wartość 0 lub 1");

  const { rows } = await req.db.query("insert into uczen (imie, nazwisko, is_teacher) values ($1, $2, $3) returning *", [
    imie,
    nazwisko.teacher == 1
  ]);

  res.status(200).send(rows[0]);
});

module.exports = router;
