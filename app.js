var express = require('express');
var path = require('path');
var app = express();



app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Headers", "*");
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
      res.header("Access-Control-Allow-Origin", "*");
      next();
});

app.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/html/submit-test.html'));
});

app.get('/spinal-mlx.html', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/html/spinal-mlx.html'));
});

app.get('/images/td-logo.png', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/images/td-logo.png'));
});
app.get('/images/api.png', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/images/api.png'));
});

app.get('/model.json', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/html/model.json'));
});
// Spinal css
app.get('/css/spinal.css', function(req, res, next) {
   res.sendFile(path.join(__dirname + '/css/spinal.css'));
});
// Ulkit
app.get('/css/uikit.css', function(req, res, next) {
   res.sendFile(path.join(__dirname + '/css/uikit.css'));
});
app.get('/css/uikit.min.css', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/css/uikit.min.css'));
});
app.get('/js/uikit.min.js', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/js/uikit.min.js'));
});
app.get('/js/uikit-icons.min.js', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/js/uikit-icons.min.js'));
});
//Spinal js with main logic
app.get('/js/spinal.js', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/js/spinal.js'));
});
// TensorFlow.js files
app.get('/scripts/tfjs@0.11.2', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/scripts/tfjs@0.11.2'));
});

// Model
app.get('/group1-shard1of1', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/mnist/group1-shard1of1'));
});
app.get('/group2-shard1of1', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/mnist/group2-shard1of1'));
});
app.get('/group3-shard1of1', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/mnist/group3-shard1of1'));
});
app.get('/group4-shard1of1', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/mnist/group4-shard1of1'));
});

app.listen(80);

