const { Router } = require("express");
const router = Router();

router.get("/listuczen", async (req, res) => {
  //const { rows } = await req.db.query("select * from uczen where is_teacher=false");


  const uczniowie = await req.pcdb.uczen.findMany({
    
  })

  req.log.info(uczniowie);
  
  res.status(200).send(uczniowie);
});

module.exports = router;
