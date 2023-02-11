const {Router} = require('express');
const router = Router();

router.get('/listnauczyciel', async (req, res) => {
    const {rows} = await req.db.query('select * from uczen where is_teacher=true');

    res.status(200).send(rows);
});

module.exports = router;