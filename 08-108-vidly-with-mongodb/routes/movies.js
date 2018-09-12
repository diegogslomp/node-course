const auth = require('../middleware/auth');
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send(await Movie.find().sort('name'));
});

router.get('/:id', async (req, res) => {
  try {
    res.send(await Movie.findById(req.params.id));
  } catch (ex) {
    res.status(404).send('The given ID movie does not exists');
  }
});

router.post('/', auth, async (req, res) => {

  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let genre;

  try{
    genre = await Genre.findById(req.body.genreId);  
  } catch(ex) {
    return res.status(400).send('Invalid genre');
  }
  
  const movie = new Movie({ 
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate 
  });
  
  const result = await movie.save();
  res.send(result);

});

router.put('/:id', auth, async (req, res) => {

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
  
    const movie = await Movie.findByIdAndUpdate(req.params.id, { 
      title: req.body.title,
      genre: req.body.genre,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      new: true 
    });
    if (!movie) return res.status(404).send('The given ID movie does not exists');

    res.send(movie);

});

router.delete('/:id', auth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    res.send(movie);
  } catch (ex) {
    res.status(404).send('The given ID movie does not exists');
  }
});

module.exports = router;