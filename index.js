const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
require("dotenv").config();
const pg = require("pg");

const winston = require('winston');

// Imports the Google Cloud client library for Winston
const {LoggingWinston} = require('@google-cloud/logging-winston');

const loggingWinston = new LoggingWinston();

// Create a Winston logger that streams to Cloud Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    // Add Cloud Logging
    loggingWinston,
  ],
});

// Writes some log entries
//logger.error('warp nacelles offline');
logger.info('Odpalam logowanie');


const client = new pg.Client({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST
});

if (process.env.INSTANCE_CONNECTION_NAME) {
  client.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

logger.info("Podpinam sie do bazy: " + `${client.host}-->${client.database}/${client.user}:${client.port} chmurowo? ${client.socketPath}`);

client.connect().then(() => {
  logger.info("Podpinam sie do bazy");
  console.log("Connected to database: " + `${client.host}-->${client.database}/${client.user}:${client.port} chmurowo? ${client.socketPath}`);
  logger.info("Connected to database: " + `${client.host}-->${client.database}/${client.user}:${client.port} chmurowo? ${client.socketPath}`);
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

let dd, mm, yyyy, HH, hh, MM, SS;

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
  req.log = logger;
  
  const tokenHeader = req.header.Authorization;
  const tokenQuery = req.query.token;

  logger.info("Szukam tokena w bazie...");
  
  if (tokenHeader) {
    logger.info("Szukam: "+ `${tokenHeader}`);
    const u = await client.query("select * from tokens where token = $1", [tokenHeader]);
    if (u.rows.length == 0) return res.status(401).send("Unauthorized");

    if (u.rows[0].expires_at < new Date()) return res.status(401).send("Unauthorized - use proper credentials");

    req.userid = u.rows[0].user_id;
    logger.info("znaleziony: "+ `${u.rows[0].user_id}`);

    return next();
  }

  if (!tokenQuery) return res.status(401).send("Unauthorized");
  logger.info("Szukam: "+ `${tokenQuery}`);
  const u = await client.query("select * from tokens where token = $1", [tokenQuery]);
  if (u.rows.length == 0) return res.status(401).send("Unauthorized");

  if (u.rows[0].expires_at < new Date()) return res.status(401).send("Unauthorized - use proper credentials");

  req.userid = u.rows[0].user_id;
  logger.info("znaleziony: "+ `${u.rows[0].user_id}`);

  return next();
});

// info kto używa aplikacji
app.use(async (req, res, next) => {
  const id = req.userid;

  const u = await client.query("select * from users where id = $1", [id]);

  console.log(u.rows[0]);

  return next();
});

fs.readdirSync("./routes").forEach((f) => {
  app.use(require(`./routes/${f}`));
});

app.get("/secret", async (req, res) => {
  logger.info("Sekcja ukryta!");
  console.log("Accessing the secret section ...");
  res.send("secret - OK");
});

app.get("/", async (req, res) => {
  let date = new Date();
  dd = formatData(date.getDate());
  mm = formatData(date.getMonth() + 1);
  yyyy = date.getFullYear();
  HH = formatData(date.getHours());
  hh = formatData(formatHour(date.getHours()));
  MM = formatData(date.getMinutes());
  SS = formatData(date.getSeconds());

  console.log("Odpalone: " + `${mm}/${dd}/${yyyy} ${HH}:${MM}:${SS}`);
  res.send("Pierwsza apka chmurowa! Odpalone query: " + `${mm}/${dd}/${yyyy} ${HH}:${MM}:${SS}`);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
