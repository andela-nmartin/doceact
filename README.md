# doceact

Adapted from the `webpack-express-boilerplate` forked from @gottsohn

[![Javascript Version][javascript-image]][javascript-url]
[![React Version][reactjs-image]][reactjs-url]
[![Material UI Version][material-ui-image]][material-ui-url]
[![Build Status](https://semaphoreci.com/api/v1/n8e/doceact/branches/master/shields_badge.svg)](https://semaphoreci.com/n8e/doceact)
[![Coverage Status](https://coveralls.io/repos/github/n8e/doceact/badge.svg?branch=master)](https://coveralls.io/github/n8e/doceact?branch=master)
[![License][license-image]][license-url]


The MIT License (MIT). Please see [License File](LICENSE) for more information.

[javascript-image]:https://img.shields.io/badge/Javascript-ES6-yellow.svg
[javascript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[reactjs-image]:https://img.shields.io/badge/ReactJS-15.1.0-blue.svg
[reactjs-url]: https://facebook.github.io/react
[material-ui-image]:https://img.shields.io/badge/Material--UI-0.15.0-lightgrey.svg
[material-ui-url]: https://material-ui.org
[license-image]: https://img.shields.io/badge/License-MIT-red.svg
[license-url]: LICENSE


## Document Management System (React, Node, Express, Mongo)

##  Models
The models contained are `users`, `documents` and `roles`. A document belongs to a `User` and is related to them using the `ownerId`. A `Role` is related to the `User` using the `id` field. Each `Document` has restrictions on the roles. A `Role` also relates to the `Document` using the `title`.

## Testing
Back end testing is done using the `superagent` node module which is installed via `npm` when you install all the other node modules in `package.json`. `superagent` is used to make requests to the api routes and receive responses. The tests are run on terminal using the command:
```
jasmine-node tests/ --verbose
```
Front end testing is done using `chai` and `sinon`
## Express Routes
The routes are created using `express` routers. The server needs to be started using the terminal command `nodemon server.js`. Our server file is called `server.js`. The routes are defined in the `./server/routes/api.js` file.

## Mongo Database
One needs an installation of `Mongodb` locally. Our database is called `docms`. We connect to it using the configurations in `./server/config/config.js` file.
```
'database': 'mongodb://localhost/docms',
```
This line in particular is needed. To use this database throughout the run-time of the application, one needs to run the command `mongod` on the terminal.
The database needs to be dropped first, before the tests are run. It is dropped in the express server by the command:
```
mongoose.connection.db.dropDatabase(function(err) {
  if (err) {
    return err;
  } else {
    console.log('Dropped database');
    (function() {
      seed.seeder();
    })();
  }
});
```
## Front End
The front end is composite, rendered by `ReactJs`.


`TIA`
