var express = require('express');
var querystring = require('querystring');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function (req, res) {
    var userNameInput = req.body.userNameInput;
    var passwordInput = req.body.passwordInput;


    var data = querystring.stringify({
      'username_or_email': userNameInput,
      'password': passwordInput
    });

    var options = {
      host: 'dev.prelo.id',
      path: '/api/auth/login',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data)
      }
    };
    var dataPrelo="";
    var httpreq = http.request(options, function (response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        dataPrelo+=chunk;
      });
      response.on('end', function() {
        var objectPrelo = JSON.parse(dataPrelo);
        console.log(objectPrelo._data.token);
          res.redirect('/lovelist?token='+objectPrelo._data.token);
      })
    });
    httpreq.write(data);
    httpreq.end();
});

/* GET lovelsit page. */
router.get('/lovelist', function(req, res, next) {
  res.render('lovelist', { title: 'Lovelist' });
});

module.exports = router;
