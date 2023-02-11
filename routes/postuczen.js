const {Router} = require('express');
const router = Router();

router.post('/uczen/:id', async (req, res) => {
    const {imie, nazwisko, teacher} = req.body;
    const {id} = req.params;

    if (!imie || !nazwisko || !id || !teacher) {
        return res.status(400).send('Nie podano wszystkich danych');
    }

    if (teacher !== 1 && teacher !== 0) return res.status(400).send('Teacher musi mieć wartość 0 lub 1');

    const result = await req.db.query('update uczen set imie = $1, nazwisko = $2, is_teacher = $3 where id = $4 returning *', [imie, nazwisko, teacher == 1 ? true : false, id]);

    if (result.affectedRows === 0) {
        return res.status(404).send('Nie znaleziono ucznia');
    }

    res.send(result[0]);
});

router.get('/postuczen/:id', async (req, res) => {
    const {imie, nazwisko, teacher} = req.query;
    const {id} = req.params;

    if (!imie || !nazwisko || !id || !teacher) {
        return res.status(400).send('Nie podano wszystkich danych');
    }

    if (teacher !== 1 && teacher !== 0) return res.status(400).send('Teacher musi mieć wartość 0 lub 1');

    const result = await req.db.query('update uczen set imie = $1, nazwisko = $2, is_teacher = $3 where id = $4 returning *', [imie, nazwisko, teacher == 1 ? true : false, id]);

    if (result.affectedRows === 0) {
        return res.status(404).send('Nie znaleziono ucznia');
    }

    res.send(result[0]);
});

module.exports = router;