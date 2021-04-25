
const http = require('http');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static("express"));


// default URL for website
app.get('/', function(req,res){
    res.send(path.join(__dirname+'/express/index.html'));
    //__dirname : It will resolve to your project folder.
  });

app.use(function(req,res,next) {
    console.log("/" + req.method);
    next();
  });

// Handle 404 error.
// The last middleware.
app.use("*",function(req,res){
  res.sendFile(__dirname + "/express/404.html");;
  });
const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);


/*
var express = require("express");
var app = express();
var router = express.Router();

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.use("/user/:id",function(req,res,next){
  console.log(req.params.id)
  if(req.params.id == 0) {
    res.json({"message" : "You must pass ID other than 0"});
  }
  else next();
});

router.get("/",function(req,res){
  res.sendFile(__dirname + "/express/index.html");
});

router.get("/about",function(req,res){
  res.sendFile(__dirname + "/express/userdashboard.html");
});


router.use("/user/:id",function(req,res,next){
    console.log(req.params.id)
    if(req.params.id == 0) {
      res.json({"message" : "You must pass ID other than 0"});    
    }
    else next();
  });

app.use("/",router);

app.use("*",function(req,res){
//res.status(404).send('404');
  res.sendFile(__dirname + "/express/404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});
*/