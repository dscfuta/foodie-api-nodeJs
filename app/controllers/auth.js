const express = require('express');
const passport = require('passport');
// const jsonPatch = require('jsonpatch');

const router = express.Router();

module.exports = (app) => {
  app.use('/', router);
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
