const {Router} = require('express');
const router = Router();

router.get('/listuczen', async (req, res) => {
    const {rows} = await req.db.query('select * from uczen where is_teacher=false');

    res.status(200).send(rows);
});

module.exports = router;