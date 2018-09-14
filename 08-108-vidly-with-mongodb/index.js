require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const  config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const app = express();

require('./startup/routes')(app);

winston.handleExceptions(
  new winston.transports.File( { filename: 'uncaughtException.log' }));

process.on('unhandledRejection', (ex) => {
  throw ex;
});

winston.add(winston.transports.File, {filename: 'logfile.log'});
winston.add(winston.transports.MongoDB, { 
  db: 'mongodb://localhost/vidly',
  level: 'info' 
});

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}
mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
  .then(() => console.log('Connected to Mongodb...'))
  .catch(() => console.log('Error Connecting to Mongodb...'));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
});
