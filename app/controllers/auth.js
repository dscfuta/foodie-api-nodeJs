const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserModel = mongoose.model('User');
// const jsonPatch = require('jsonpatch');

const router = express.Router();

module.exports = (app) => {
  app.use('/api', router);
};
router.post('/login', (req, res, next) => {
  passport.authenticate('user-login', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).json(info);
    }

    if (user) {
      const token = user.generateJwt();
      const data = {
        token,
      };
      if (req.body && req.body.remember) {
        res.json(data);
      } else {
        res.json(data);
      }
    }
  })(req, res, next);
});

router.post('/signup', (req, res, next) => {
  passport.authenticate('user-register', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      const token = user.generateJwt();
      const data = {
        token,
      };
      if (req.body && req.body.remember) {
        res.json(data);
      } else {
        res.json(data);
      }
    } else {
      res.status(400).json(info);
    }
  })(req, res, next);
});

router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.json({ user: req.user });
});

router.put('/profile', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  let user;
  const { password } = req.body;

  try {
    if (password) {
      req.body.password = await bcrypt.hash(password, 15);
    }
    user = await UserModel.findOneAndUpdate(
      { email: req.user.email },
      { $set: req.body },
      { new: true },
    );
    res.json({ user });
  } catch (err) {
    next(err);
  }
});
