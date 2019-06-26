const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const RecipeModel = mongoose.model('Recipe');

const router = express.Router();

module.exports = (app) => {
  app.use('/api', passport.authenticate('jwt', { session: false }), router);
};

router.get('/recipe/all', async (req, res, next) => {
  let recipes;
  try {
    recipes = await RecipeModel.find({});
    res.json({ recipes });
  } catch (err) {
    next(err);
  }
});

router.get('/recipe/:id', async (req, res, next) => {
  let recipe;
  const { id } = req.params;
  try {
    recipe = await RecipeModel.findOne({ _id: id });
    res.json({ recipe });
  } catch (err) {
    next(err);
  }
});

router.post('/recipe/add', async (req, res, next) => {
  let recipe;
  try {
    recipe = await RecipeModel.create(req.body);
    res.json({ recipe });
  } catch (err) {
    next(err);
  }
});
