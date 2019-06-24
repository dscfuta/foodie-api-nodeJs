const express = require('express');
const glob = require('glob');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./environment');
mongoose.Promise = require('bluebird');

const logger = require('./winston');

const rootDir = `${__dirname}/../`;
module.exports = (app) => {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';

  // app.use(favicon(config.root + '/public/img/favicon.ico'));

  app.use(morgan('combined', { stream: logger.stream }));
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: false,
    }),
  );

  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(`${rootDir}/public`));
  app.use(methodOverride());
  app.use(cors());
  app.use(passport.initialize());

  mongoose.connect(config.db, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });

  mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database at ${config.db}`);
  });

  mongoose.connection.on('open', () => {
    logger.info('Database Connected');
  });

  glob.sync(`${rootDir}/app/models/*.js`).forEach((model) => {
    require(model);
  });
  glob.sync(`${rootDir}/config/passport/*.js`).forEach((passport) => {
    require(passport);
  });

  glob.sync(`${rootDir}/app/controllers/*.js`).forEach((controller) => {
    require(controller)(app);
  });
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
      console.log(err);
      logger.error(
        `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
      );
      res.status(err.status || 500);
      res.end(err.message);
    });
  } else if (app.get('env') === 'production') {
    app.use((err, req, res, next) => {
      logger.error(
        `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
      );
      res.end();
    });
  }
  return app;
};
