
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Genre, validate } = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  throw new Error('Could not ge the genres.');
  try {
    res.send(await Genre.find().sort('name'));
  } catch (ex) {
    next(ex);
  }
});

router.get('/:id', async (req, res) => {
  try {
    res.send(await Genre.findById(req.params.id));
  } catch (ex) {
    res.status(404).send('The given ID genre does not exists');
  }
});

router.post('/', auth, async (req, res) => {

  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const alreadyExists = await Genre.findOne({ name: req.body.name });
  if(alreadyExists) return res.status(400).send('The given genre name already exists');

  const genre = new Genre({ name: req.body.name });
  
  const result = await genre.save();
  res.send(result);

});

router.put('/:id', auth, async (req, res) => {

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
  
    const alreadyExists = await Genre.findOne({ name: req.body.name });
    if(alreadyExists) return res.status(400).send('The given genre name already exists');

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name , new: true });
    if (!genre) return res.status(404).send('The given ID genre does not exists');

    res.send(genre);

});

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);  
    res.send(genre);
  } catch (ex) {
    res.status(404).send('The given ID genre does not exists');  
  }
});

module.exports = router;