require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');

const mongooseOptions = {
  keepAlive: true,
  useMongoClient: true,
};

mongoose.connect(process.env.DB_CONNECTION_STRING, mongooseOptions);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'There was an error connecting to the database:'))
db.once('open', whenDatabaseConnectionOpens);

function whenDatabaseConnectionOpens() {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  const PORT = process.env.PORT || 3000;

  http
    .createServer(app)
    .listen(PORT, () => {
      console.log(`***** LISTENING ON PORT ${PORT} *****`);
    });
}
