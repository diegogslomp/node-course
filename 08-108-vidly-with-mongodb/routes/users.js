const _ = require('lodash');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const alreadyExists = await User.findOne({ email: req.body.email });
  if(alreadyExists) return res.status(400).send('The given user email already exists');

  const user = new User(_.pick(req.body, ['name', 'email', 'password']));
  await user.save();

  res.send(_.pick(user, ['_id', 'name', 'email']));

});

module.exports = router;