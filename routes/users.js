var express = require('express');
var router = express.Router();
const axios = require("axios");

var users = []

function createError (res, status, message) {
  var err = new Error(message);
  err.status = status;
  res.render('error', {message, err})
}

/* GET users listing. */
router.get('/', (req, res, next) => {
  axios.get("https://jsonplaceholder.typicode.com/users")
    .then( (response) => {
      var serverUsers = response.data;
      res.render('users', {serverUsers, users});
    }).catch((error) => {
      res.json("Error occured!")
    }); 
});

router.get('/add', (req, res, next) => {
  res.render('form');
})

router.post('/add', (req, res, next) => {
  if( !req.body ){
    res.send('Incorrect form. Try again');
  }
  users.push(req.body);
  res.render('index', { title: 'Express' });
})

router.get('/edit/:id', (req, res, next) => {
  var id = req.params.id;

  if( !id ){
    var userMessage="No index found. Try again"
    res.render('users', {userMessage, users})
  }
  var user = users[id-11];

  res.render('edit', {id, user});
});

router.put('edit/:id', (req, res, next) => {
  if( !req.body ){
    var userMessage="Changes were not saved. Try again"
    res.render('users', {userMessage, users})
  }
  Object.assign(users[req.params.id-11], req.body);

  res.render('index', {title: Express});
});

router.get('/:id', (req, res, next) => {
  if(!req.params.id) {
    createError(res, 404, 'No user username');
  }

  if( req.params.id > 10 ){
    res.json(users[req.params.id-11]);
    return;
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
