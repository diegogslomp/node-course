const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const router = express.Router();

const Customer = mongoose.model('Customer', mongoose.Schema({
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
}));

router.get('/', async (req, res) => {
    res.send(await Customer.find().sort('name'));
});

router.get('/:id', async (req, res) => {
  try {
    res.send(await Customer.findById(req.params.id));
  } catch (ex) {
    res.status(404).send('The given ID customer does not exists');
  }
});

router.post('/', async (req, res) => {

  const { error } = validateCustomer(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({ 
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone 
  });
  
  const result = await customer.save();
  res.send(result);

});

router.put('/:id', async (req, res) => {

    const { error } = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);
  
    const customer = await Customer.findByIdAndUpdate(req.params.id, { 
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone, 
      new: true 
    });
    if (!customer) return res.status(404).send('The given ID customer does not exists');

    res.send(customer);

});

router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    res.send(customer);
  } catch (ex) {
    res.status(404).send('The given ID customer does not exists');
  }
});

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.number().min(5).max(50)
  };
  return Joi.validate(customer, schema);
}

module.exports = router;