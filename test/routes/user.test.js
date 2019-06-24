const chai = require('chai');
const request = require('supertest');
const { app, server } = require('../../app');
const UserModel = require('../../app/models/user');

const { expect } = chai;
/** *********************** */
after(() => {
  server.close();
});
describe('POST /login', () => {
  before(function (done) {
    this.timeout(10000);
    UserModel.deleteOne({ email: 'easyclick05@gmail.com' })
      .then(() => done())
      .catch(err => done(err));
  });
  before(function (done) {
    this.timeout(10000);
    request(app)
      .post('/signup')
      .type('form')
      .send({ email: 'easyclick05@gmail.com', password: 123456 })
      .then(() => done())
      .catch(err => done(err));
  });

  after((done) => {
    UserModel.deleteOne({ email: 'easyclick05@gmail.com' })
      .then(() => done())
      .catch(err => done(err));
  });

  it('should have 200 response status code', (done) => {
    request(app)
      .post('/login')
      .type('form')
      .send({ email: 'easyclick05@gmail.com', password: 123456 })
      .then((res) => {
        expect(res.body).to.have.property('token');
        expect(res.status).to.equals(200);
        done();
      })
      .catch(err => done(err));
  }).timeout(10000);

  it('should have 400 response status code', (done) => {
    request(app)
      .post('/login')
      .type('form')
      .send({ email: 'easyclick' })
      .expect(400, done);
  });
  it('should have Missing credentials error text', (done) => {
    request(app)
      .post('/login')
      .type('form')
      .send({ password: 123456 })
      .then((res) => {
        expect(res.body)
          .to.have.property('message')
          .equal('Missing credentials');
        done();
      })
      .catch(err => done(err));
  });
  it('should have 400 response status code', (done) => {
    request(app)
      .post('/login')
      .type('form')
      .send({ password: 123456 })
      .expect(400, done);
  });
});

describe('POST signup', () => {
  after((done) => {
    UserModel.deleteOne({ email: 'easyclick05@gmail.com' })
      .then(() => done())
      .catch(err => done(err));
  });
  it('should return 200 response status code', (done) => {
    request(app)
      .post('/signup')
      .type('form')
      .send({ email: 'easyclick05@gmail.com', password: 123456 })
      .expect(200, done);
  }).timeout(10000);

  it('should return 400 response status code', (done) => {
    request(app)
      .post('/signup')
      .type('form')
      .send({})
      .expect(400, done);
  });

  it('should return an Invalid email as an error text', (done) => {
    request(app)
      .post('/login')
      .type('form')
      .send({ email: 'easyclick05', password: 123456 })
      .then((res) => {
        expect(res.body)
          .have.property('message')
          .equals('Invalid email');
        done();
      })
      .catch(err => done(err));
  });
});
