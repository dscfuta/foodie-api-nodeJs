const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'dsc-app-dev',
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost:27017/dsc-app-dev',
  },

  test: {
    root: rootPath,
    app: {
      name: 'dsc-app-test',
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost:27017/dsc-app-test',
  },

  production: {
    root: rootPath,
    app: {
      name: 'dsc-app',
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost:27017/dsc-app',
  },
};

module.exports = config[env];
