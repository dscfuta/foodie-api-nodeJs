const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const { app, server } = require('../../app');

const RecipeModel = require('../../app/models/recipe');
const UserModel = require('../../app/models/user');

describe('RECIPE ENDPOINTS', (done) => {
  describe('GET /api/recipe/all', () => {
    let token;
    before(function (done) {
      this.timeout(10000);
      UserModel.deleteOne({ email: 'easyclick05@gmail.com' })
        .then(() => done())
        .catch(err => done(err));
    });
    before(function (done) {
      this.timeout(10000);
      request(app)
        .post('/api/signup')
        .type('form')
        .send({ email: 'easyclick05@gmail.com', password: 123456 })
        .then((res) => {
          ({ token } = res.body);
          done();
        })
        .catch(err => done(err));
    });

    it('should return 200 status code', (done) => {
      request(app)
        .get('/api/recipe/all')
        .set('Authorization', `Bearer ${token}`)
        .expect(200, done);
    });

    it('should return 200 status code', (done) => {
      request(app)
        .get('/api/recipe/all')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.body)
            .to.have.property('recipes')
            .to.be.an('array');
          done();
        })
        .catch(err => done(err));
    });
  });
});
