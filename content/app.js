const express = require('express');
const app = express();
const txt2json = require('./middleware/txt2json');

app.get('/hello', function(req, res) {
  res.send({
    Output: 'Hello World!'
  });
});

app.post('/hello', function(req, res) {
  res.send({
    Output: 'Hello World!'
  });
});

app.use(express.json());
app.use('/', (req, res, next) => {
  res.set({ 'Access-Control-Allow-Origin': '*' });
  return next();
});
app.options('/', (req, res, next) => {
  res.set({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  return next();
});
app.options('/', (req, res, next) => {
  return res.sendStatus(204);
});
app.post('/', txt2json);

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
