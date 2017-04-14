var express = require('express');
var querystring = require('querystring');
var http = require('http');
var router = express.Router();
var url = require('url');

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
        res.redirect('/lovelist?token='+objectPrelo._data.token);
      })
    });
    httpreq.write(data);
    httpreq.end();
});

/* GET lovelsit page. */
router.get('/lovelist', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var data = querystring.stringify({
        'Authorization': ('Token '+ req.query.token)
    });
    var options = {
    host: 'dev.prelo.id',
    path: '/api/me/lovelist',
    method: 'GET',
    headers: {
      'Authorization': ('Token '+ req.query.token)
    }
  };
  var lovelistData="";
  var lovelistObj;
  var httpreq = http.request(options, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      lovelistData+=chunk;
    });
    response.on('end', function() {
      lovelistObj = JSON.parse(lovelistData);
      console.log(lovelistObj);
      lovelistObj.title = 'Lovelist';
      res.render('lovelist', lovelistObj);
    })
  });
  httpreq.write(data);
  httpreq.end();
});

module.exports = router;
