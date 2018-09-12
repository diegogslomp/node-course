const auth = require('../middleware/auth');
const { Customer, validate } = require('../models/customer')
const express = require('express');
const router = express.Router();

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

router.post('/', auth, async (req, res) => {

  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({ 
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone 
  });
  
  const result = await customer.save();
  res.send(result);

});

router.put('/:id', auth, async (req, res) => {

    const { error } = validate(req.body);
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

router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    res.send(customer);
  } catch (ex) {
    res.status(404).send('The given ID customer does not exists');
  }
});

module.exports = router;