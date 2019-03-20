const express = require('express')
const app = express()
const port = 3000

const get = require('simple-get')

app.locals.data = {
  users: []
}

const options = {
  method: 'GET',
  url: 'https://randomuser.me/api',
  body: {
    key: 'value'
  },
  json: true
}

var getRequest = async () => {
  try {
    for (var i = 0; i < 10; i++) {
      await get.concat(options, function (err, res, data) {
        if (err) throw err;
	    var json = data.results;
	    var obj = {
           gender: json[0].gender,
           firstname: json[0].name.first,
	       city: json[0].location.city,
	       email: json[0].email,
	       cell: json[0].cell
        }
        console.log(obj);
        app.locals.data.users.push(obj);
      })
    }
  } catch (error) {
	console.error(error);
  }
}

app.get('/users/', function (req, res) {
  getRequest();
  res.status(200).json(app.locals.data);
})

app.post('/users/:gender.:firstname.:city.:email.:cell', function (req, res) {
  var obj = {
    gender: req.params.gender,
    firstname: req.params.firstname,
	city: req.params.city,
	email: req.params.email,
	cell: req.params.cell
  }
  console.log(obj);
  app.locals.data.users.push(obj);
})

app.get('/users/:firstname', function (req, res) {
  var objFound = app.locals.data.users.find(obj => obj.firstname === req.params.firstname);
  
  if (objFound) {
    res.status(200).json( objFound );
	return;
  }
  else {
	message = 'User not found!'
    console.log('Not Found')
	res.status(404).send({ message });
	return;
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))