const supertest = require('supertest');
const app = require('../app.js');

const request = supertest(app);

describe('Tests app', function() {
  test('...', function(done) {
    done();
  });
});
