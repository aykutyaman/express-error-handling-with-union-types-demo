const express = require('express');
const app = express();
const union = require('./union');

// Create an object with a type for each name
const ApiErrors = union([
  'InvalidCredentials',
  'UserNotFound',
  'Other',
]);

const routes = {
  authorize: (request, response, next) => {
    // validate credentials and then:
    next(ApiErrors.InvalidCredentials());
  },
  user: (request, response, next) => {
    // user doesn't exist in database
    next(ApiErrors.UserNotFound(`User ${request.params.id} not found`));
  },
  other: (request, response, next) => {
    next(ApiErrors.Other({ foo: 'bar' }));
  }
};

app.get('/authorize', routes.authorize);
app.get('/user/:id', routes.user);
app.get('/other', routes.other);

app.use((error, request, response, next) => {
  error.match({
    // each type has an object with a method `match`.
    InvalidCredentials: () => response.sendStatus(401),
    UserNotFound: message => response.status(404).send(message),
    Other: data => response.status(500).send(data),
  });
});

app.listen(3000);
