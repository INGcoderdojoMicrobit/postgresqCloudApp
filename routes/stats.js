const {Router} = require('express');
const router = Router();

router.get('/stats', async (req, res) => {
    const students = await req.db.query('select count(*) from uczen where is_teacher = false');
    const teachers = await req.db.query('select count(*) from uczen where is_teacher = true');

    return res.json({
        students: students.rows[0].count,
        teachers: teachers.rows[0].count
    })
});

module.exports = router;