const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const app = express();
const genres = require('./routes/genres');

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
  .then(() => console.log('Connected to Mongodb...'))
  .catch(() => console.log('Error Connecting to Mongodb...'));

app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
});
