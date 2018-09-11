const mongoose = require('mongoose');
const Joi = require('joi');

const Rental = mongoose.model('Rental', mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      isGold: {
        type: Boolean, 
        default: false
        
      },
      phone: {
        type: Number,
        minlength: 5,
        maxlength: 50
      }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: { 
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255,
        default: 0
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date
  }, 
  rentalFee: {
    type: Number,
    min: 0
  }
}));

function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };
  
  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;