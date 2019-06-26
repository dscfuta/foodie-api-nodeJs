const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const validator = require('validator');
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const mongoose = require('mongoose');

const UserModel = mongoose.model('User');

const { SECRET } = process.env;
class Passport {
  constructor(pasport) {
    this.passport = pasport;
    this.opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET,
    };
    this.jwt();
    this.register();
    this.login();
  }

  jwt() {
    this.passport.use(
      new JwtStrategy(this.opts, (payload, done) => {
        UserModel.findOne({
          email: payload.email,
        })
          .then((user) => {
            if (user) {
              return done(null, user);
            }
            done(null, false, {
              message: 'Unauthorized Acesss',
            });
          })
          .catch(err => done(err));
      }),
    );
  }

  register() {
    this.passport.use(
      'user-register',
      new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password',
          passReqToCallback: true,
        },
        async (req, reqEmail, password, done) => {
          let user;
          const email = reqEmail.toLowerCase();
          if (!validator.isEmail(email)) {
            return done(null, false, {
              message: 'Invalid email',
            });
          }
          try {
            user = await UserModel.findOne({
              email,
            });

            if (user) {
              return done(null, false, {
                message: 'User already exists',
              });
            }

            if (!user) {
              user = new UserModel({
                email,
                password,
                address: req.body.address,
                username: req.body.username,
                phone: req.body.phone,
              });
              await user.save();
              return done(null, user, {
                message: 'User created successfully',
              });
            }
          } catch (err) {
            return done(err);
          }
        },
      ),
    );
  }

  login() {
    this.passport.use(
      'user-login',
      new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password',
        },
        async (reqEmail, password, done) => {
          const email = reqEmail.toLowerCase();
          if (!validator.isEmail(email)) {
            return done(null, false, {
              message: 'Invalid email',
            });
          }
          let user;
          let stat;
          try {
            user = await UserModel.findOne({
              email,
            });

            if (!user) {
              return done(null, false, {
                message: 'User does not exist',
              });
            }
            stat = await user.comparePassword(password);
            if (stat) {
              return done(null, user, {
                message: 'Successful login',
              });
            }
            return done(null, false, {
              message: 'Invalid Password',
            });
          } catch (e) {
            return done(e);
          }
        },
      ),
    );
  }
}

module.exports = new Passport(passport);
