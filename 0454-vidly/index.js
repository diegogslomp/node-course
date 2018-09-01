const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const genres = [
  { id: 1, name: 'action'},
  { id: 2, name: 'drama'},
  { id: 3, name: 'terror'}
];

app.get('/api/genres', (req, res) => {
  res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const genre = genres.find(g => g.id === id);
  if(!genre) return res.status(404).send('The given ID genre does not exists');
  res.send(genre);
});

app.post('/api/genres', (req, res) => {

  const { error } = validateGenre(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const alreadyExists = genres.find(g => g.name === req.body.name);
  if(alreadyExists) return res.status(400).send('The given genre name already exists');

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  }
  genres.push(genre);
  res.send(genre);

});

app.put('/api/genres/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const genre = genres.find(g => g.id === id);
  if(!genre) return res.status(404).send('The given ID genre does not exists');

  const alreadyExists = genres.find(g => g.name === req.body.name);
  if(alreadyExists) return res.status(400).send('The given genre name already exists');

  const { error } = validateGenre(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const genre = genres.find(g => g.id === id);
  if(!genre) return res.status(404).send('The given ID genre does not exists');

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };
  return Joi.validate(genre, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
});
