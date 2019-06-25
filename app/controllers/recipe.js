const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const RecipeModel = mongoose.model('Recipes');

const router = express.Router();

module.exports = (app) => {
  app.use('/api', router);
};

router.get(
  '/recipe/all',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    let recipes;
    try {
      recipes = await RecipeModel.find({});
      res.json({ recipes });
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/recipe/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    let recipe;
    const { id } = req.params;
    try {
      recipe = await RecipeModel.find({ _id: id });
      res.json({ recipe });
    } catch (err) {
      next(err);
    }
  },
);
