const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const CartModel = mongoose.model('Cart');
// const jsonPatch = require('jsonpatch');

const router = express.Router();
module.exports = (app) => {
  app.use('/api/cart', passport.authenticate('jwt', { session: false }), router);
};

router.get('/', async (req, res, next) => {
  const { user } = req.user;

  let items;
  try {
    items = await CartModel.findOne({ user: user.id });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get('/add/:id', async (req, res, next) => {
  const recipeId = req.params.id;
  let cart;
  try {
    cart = await CartModel.findOne({ user: req.user.id, recipe: recipeId });
    if (cart) {
      cart = await CartModel.findOneAndUpdate(
        { user: req.user.id, recipe: recipeId },
        { $set: { quantity: cart.quantity + 1 } },
        { new: true },
      );
    } else {
      cart = await CartModel.create({ user: req.user.id, recipe: recipeId, quantity: 1 });
    }
    res.json(cart);
  } catch (e) {
    next(e);
  }
});

router.get('/remove/:id', async (req, res, next) => {
  const recipeId = req.params.id;
  try {
    await CartModel.deleteOne({ user: req.user.id, recipe: recipeId });
    res.json({ message: 'recipe deleted' });
  } catch (e) {
    next(e);
  }
});

router.get('/increment/:id', async (req, res, next) => {
  const { id: userID } = req.user;
  const { id: recipeId } = req.params;
  let newCart;
  let cart;
  try {
    cart = await CartModel.findOne({ user: userID, recipe: recipeId });
    newCart = await CartModel.findOneAndUpdate(
      { user: userID, recipe: recipeId },
      { quantity: cart.quantity + 1 },
      { new: true },
    );
    res.json({ item: newCart });
  } catch (err) {
    next(err);
  }
});

router.get('/decrement/:id', async (req, res, next) => {
  const { id: userID } = req.user;
  const { id: recipeId } = req.params;
  let newCart;
  let cart;
  try {
    cart = await CartModel.findOne({ user: userID, recipe: recipeId });
    newCart = await CartModel.findOneAndUpdate(
      { user: userID, recipe: recipeId },
      { quantity: cart.quantity > 1 ? cart.quantity - 1 : 1 },
      { new: true },
    );
    res.json({ item: newCart });
  } catch (err) {
    next(err);
  }
});
