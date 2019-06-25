const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.generateJwt = function generateJwt() {
  const user = this;
  return jwt.sign(
    {
      email: user.email,
      name: user.password,
    },
    process.env.SECRET,
    {
      algorithm: 'HS256',
      subject: user.email,
    },
  );
};

exports.saveUser = function saveUser(next) {
  const user = this;
  bcrypt.hash(user.password, 15, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
};

exports.compareUserPassword = function comparePassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, stat) => {
      if (err) {
        reject(err);
      }
      resolve(stat);
    });
  });
};
