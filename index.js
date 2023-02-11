const express = require('express');
const app = express();
const https = require('https');
const request = require('request');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config();
const pg = require('pg');

const client = new pg.Client({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST
});

client.connect().then(() => {
  console.log('connected to database');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let dd,mm,yyyy,HH,hh,MM,SS;
  
// Function to convert
// single digit input
// to two digits
const formatData = (input) => {
  if (input > 9) {
    return input;
  } else return `0${input}`;
};
  
// Function to convert
// 24 Hour to 12 Hour clock
const formatHour = (input) => {
  if (input > 12) {
    return input - 12;
  }
  return input;
};


// sprawdzenie dostępu do aplikacji
// Authorization token
// ?token=1234
app.use(async (req, res, next) => {
  req.db = client;
  
  const tokenHeader = req.header.Authorization;
  const tokenQuery = req.query.token;

  if (tokenHeader) {
    const u = await client.query('select * from tokens where token = $1', [tokenHeader]);
    if (u.rows.length == 0) return res.status(401).send('Unauthorized');

    if (u.rows[0].expires_at < new Date()) return res.status(401).send('Unauthorized - use proper credentials');

    req.userid = u.rows[0].user_id;

    return next();
  }

  if (!tokenQuery) return res.status(401).send('Unauthorized');

  const u = await client.query('select * from tokens where token = $1', [tokenQuery]);
  if (u.rows.length == 0) return res.status(401).send('Unauthorized');

  if (u.rows[0].expires_at < new Date()) return res.status(401).send('Unauthorized - use proper credentials');

  req.userid = u.rows[0].user_id;

  return next();
});


// info kto używa aplikacji
app.use(async (req, res, next) => {
  const id = req.userid;

  const u = await client.query('select * from users where id = $1', [id]);

  console.log(u.rows[0]);

  return next();
});


fs.readdirSync('./routes').forEach((f) => {
  app.use(require(`./routes/${f}`));
});

app.get('/secret', async (req, res) => {
    console.log('Accessing the secret section ...')
    res.send('secret - OK');
});

app.get('/', async (req, res) => {
  let date = new Date();
  dd = formatData(date.getDate());
  mm = formatData(date.getMonth() + 1);
  yyyy = date.getFullYear();
  HH= formatData(date.getHours());
  hh= formatData(formatHour(date.getHours()));
  MM= formatData(date.getMinutes());
  SS= formatData(date.getSeconds());
 
  console.log('Odpalone '+ `${mm}/${dd}/${yyyy} ${HH}:${MM}:${SS}`);
  res.send('Pierwsza apka chmurowa! Odpalone query: '+ `${mm}/${dd}/${yyyy} ${HH}:${MM}:${SS}`);  
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});