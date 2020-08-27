var express = require('express');
var router = express.Router();
const axios = require("axios");

var users = []

function createError (res, status, message) {
  var error = new Error(message);
  error.status = status;
  res.json({err});
}

/* GET */
router.get('/', (req, res, next) => {
  axios.get("https://jsonplaceholder.typicode.com/users")
    .then( (response) => {
      users = response.data;
      res.json({users});
    }).catch((error) => {
      res.createError(res, 404, 'Cannot find users list');
    }); 
});

/* ADD User */

router.post('/add', (req, res, next) => {
  if( !req.body ){
    createError(res, 404, 'Incorrect form. Try again');
  }
  users.push(req.body);
  res.send('User successfully added')
})

/* PUT */

router.put('/:id', (req, res, next) => {
  if( !req.body ){
    createError(res, 404, "Could not find the form content");
  }
  Object.assign(users[req.params.id], req.body);

  res.json('Changes are successfully saved');
});

/* GET/:id */

router.get('/:id', (req, res, next) => {
  if(!req.params.id) {
    createError(res, 404, 'No userID');
  }

  axios.get(`https://jsonplaceholder.typicode.com/users/${req.params.id}`)
    .then( (response) => {
      res.json(response.data);
    })
    .catch( (err) => {
      createError(res, err.status, err.message);
    })
});

module.exports = router;
