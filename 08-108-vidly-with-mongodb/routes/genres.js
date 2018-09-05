const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const router = express.Router();

const Genre = mongoose.model('Genre', mongoose.Schema({
  name: { 
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200
  }
}));

router.get('/', async (req, res) => {
    res.send(await Genre.find().sort('name'));
});

router.get('/:id', async (req, res) => {
  try {
    res.send(await Genre.findById(req.params.id));
  } catch (ex) {
    res.status(404).send('The given ID genre does not exists');
  }
});

router.post('/', async (req, res) => {

  const { error } = validateGenre(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const alreadyExists = await Genre.findOne({ name: req.body.name });
  if(alreadyExists) return res.status(400).send('The given genre name already exists');

  const genre = new Genre({ name: req.body.name });
  
  const result = await genre.save();
  res.send(result);

});

router.put('/:id', async (req, res) => {

    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);
  
    const alreadyExists = await Genre.findOne({ name: req.body.name });
    if(alreadyExists) return res.status(400).send('The given genre name already exists');

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name , new: true });
    if (!genre) return res.status(404).send('The given ID genre does not exists');

    res.send(genre);

});

router.delete('/:id', async (req, res) => {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);  
    res.send(genre);
  } catch (ex) {
    res.status(404).send('The given ID genre does not exists');  
  }
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };
  return Joi.validate(genre, schema);
}

module.exports = router;