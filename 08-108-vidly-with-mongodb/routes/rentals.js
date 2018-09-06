const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const { Rental, validate } = require('../models/rental');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {

  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let movie, customer;

  try{
    customer = await Customer.findById(req.body.customerId);  
  } catch(ex) {
    return res.status(400).send('Invalid customer ID');
  }
  if (!customer) return res.status(400).send('Invalid customer ID');
  try{
    movie = await Movie.findById(req.body.movieId);  
  } catch(ex) {
    return res.status(400).send('Invalid movie ID');
  }
  if (!movie) return res.status(400).send('Invalid movie ID');

  if(movie.numberInStock === 0) return res.setMaxListeners(400).send('Movie not in stock');

  const rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id:  movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  
  const result = await rental.save();

  movie.numberInStock--;
  movie.save();

  res.send(result);

});

module.exports = router;