const express  = require('express');

const ejs = require('ejs');
// const mongoose = require('mongoose'); 
// mongoose.connect('mongodb://localhost:27017/UserDB'); 
// var db=mongoose.connection; 
// db.on('error', console.log.bind(console, "connection error")); 
// db.once('open', function(callback){ 
//     console.log("connection succeeded"); 
// })
// file system module to perform file operations
const fs = require('fs');
const mongo = require("mongodb")
const mongo_url = "mongodb://localhost:27017/";

const database_name = "travalblog";
const post_collec = "blogposts";

const crypto = require('crypto');
const app = express();
const authTokens = {};
app.use(express.static("views/layouts"));
//app.set('view engine','ejs');
const exphbs   = require('express-handlebars');// "express3-handlebars"
const  helpers  = require('handlebars-helpers');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const readline = require('readline');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


var handlebars;


// // Create `ExpressHandlebars` instance with a default layout.
// handlebars = exphbs.create({
//     defaultLayout: 'main',
//     helpers      : helpers,
//     extname      : '.ejs', //set extension to .html so handlebars knows what to look for

//     // Uses multiple partials dirs, templates in "shared/templates/" are shared
//     // with the client-side of the app (see below).
//     partialsDir: [
//         'views/layouts/'
//     ]
// });



//app.engine('ejs', handlebars.engine);


const users = [
    // This user is added to the array to avoid creating new user on each restart
    {
        // firstName: 'John',
        // lastName: 'Doe',
        // email: 'johndoe@email.com',
        // // This is the SHA256 hash for value of `password`
        // password: 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg='
    }
];

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}
app.set('view engine','ejs');
app.use(express.static('static'));
app.use(cookieParser())
// to support URL-encoded bodies


app.use((req, res, next) => {
    const authToken = req.cookies['AuthToken'];
    req.user = authTokens[authToken];
    next();
});

// app.engine('hbs', exphbs({
//     extname: '.hbs'
// }));

// app.set('view engine', 'hbs');


app.get("/",(req,res) => {
    res.render("home")
    

    // res.render('gamezone_home',{});
});
app.get("/blogs",(req,res) => {

    mongo.connect(mongo_url,function(err,db){
        var dbo = db.db(database_name);
        dbo.collection(post_collec).find({}).toArray(function(err, results){
            console.log(results)
            res.render("blog_home",{records:results})
            db.close();
        });
    });

    // res.render('gamezone_home',{});
});
app.get('/new_discussion',(req,res) =>{
    res.render('upload_post',{});
})

app.get('/dy_detail/:post_id', (req,res) =>{
    console.log(req.params);
    var lastGameChoosen = req.params["post_id"]
    res.cookie("lastPostVisited",lastGameChoosen)
    console.log("Cookies that have been set=",req.cookies)
    // res.render('gamezone_comments',{});

    mongo.connect(mongo_url,function(err,db){
        var dbo = db.db(database_name);

        dbo.collection(post_collec).findOne(mongo.ObjectId(lastGameChoosen), function(err, result) {
            if (err) throw err;
            console.log(result.post_title);
            res.render("blogs",{records:result})
            db.close();
          });
    });
})

app.get('/blog_home',(req,res) =>{
    res.render('blog_home',{});
})
app.get('/delete/:post',(req,res) =>{

})
app.get("/update/:postid",(req,res) =>{
    console.log(req.params);
    var gameChoosen = req.params["postid"]
    // console.log(`Data ID recieved is : ${gameChoosen}`)
    // res.render('gamezone_comments',{});

    mongo.connect(mongo_url,function(err,db){
        var dbo = db.db(database_name);

        dbo.collection(post_collec).findOne(mongo.ObjectId(gameChoosen), function(err, result) {
            if (err) throw err;
            console.log(result.post_title);
            res.render("updateblog",{records:result})
            db.close();
          });
    });
})
app.get("/deleteu/:postid",(req,res) =>{
    console.log(req.params);
    console.log("inside delete function")
    var gameChoosen = req.params["postid"]
    console.log(`Data ID recieved is : ${gameChoosen}`)
    

    mongo.connect(mongo_url,function(err,db){
        var dbo = db.db(database_name);

        dbo.collection(post_collec).findOne(mongo.ObjectId(gameChoosen), function(err, result) {
            if (err) throw err;
            console.log(result.post_title);
            res.render("deleteblog",{records:result})
            db.close();
          });
    });
})
app.post("/update", function(req,res){
    console.log(req.body);
    // INserting received data into mongo client
    
    mongo.connect(mongo_url,function(err,db){
        if (err) throw err;
        var dbo = db.db(database_name);
        var myPost = {post_title: req.body.post_title, post_description: req.body.post_description}

        // console.log("receieved following data for updation:");
        // console.log(myPost);

        dbo.collection(post_collec).updateOne({post_title:req.body.post_title},{$set: myPost},function(err,res){
            if (err) throw err;
            console.log("Data Updated.");
            db.close();
        })
    });

    res.redirect("/");
});

app.post("/delete",(req,res)=>{
    mongo.connect(mongo_url, function(err, db) {
        if (err) throw err;

        var dbo = db.db(database_name);
        var myPost = {post_title: req.body.post_title}

        dbo.collection(post_collec).deleteOne(myPost, function(err, obj) {
          if (err) throw err;
          console.log("The record has been deleted.");
          db.close();
        });
      });

      res.redirect("/");
});
app.post('/open_post', (req,res) =>{
    // INserting received data into mongo client
    console.log(req.body);
    var myPost = {post_title: req.body.post_title, post_description: req.body.post_description}
    
    mongo.connect(mongo_url,function(err,db){
        if (err) throw err;
        var dbo = db.db(database_name);


        // console.log("receieved following data:");
        // console.log(myPost);

        dbo.collection(post_collec).insertOne(myPost,function(err,res){
            if (err) throw err;
            console.log("Data inserted");
            db.close();
        })
    });

    res.redirect("/");

});

app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/list', (req, res) => {
    res.render('list');
});
app.get('/blogs', (req, res) => {
    res.render('blogs');
});
app.get('../package/temp', (req, res) => {
    res.render('temp');
});
app.get('../package/packagedetails', (req, res) => {
    res.render('packagedetails');
});
app.get('../package/australia', (req, res) => {
    res.render('australia');
});
app.get('../package/bali', (req, res) => {
    res.render('bali');
});
app.get('../package/packagereg', (req, res) => {
    res.render('packagereg');
});
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    const user = users.find(u => {
        return u.email === email && hashedPassword === u.password
    });

    if (user) {
        const authToken = generateAuthToken();

        authTokens[authToken] = email;

        res.cookie('AuthToken', authToken);
        res.redirect('../package/temp2.html');
        return;
    } else {
        res.render('login', {
            message: 'Invalid username or password',
            messageClass: 'alert-danger'
        });
    }
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { firstname, lastname,email, phone ,sex,addr,age,password, cpassword } = req.body;

    if (password === cpassword) {
        if (users.find(user => user.email === email)) {

            res.render('register', {
                message: 'User already registered.',
                messageClass: 'alert-danger'
            });

            return;
        }

        const hashedPassword = getHashedPassword(password);

        users.push({
            firstname,
            lastname,
            email,
            phone,
            sex,
            addr,
            age,
            password: hashedPassword
        });

        res.render('login', {
            message: 'Registration Complete. Please login to continue.',
            messageClass: 'alert-success'
        });
        
    } else {
        res.render('register', {
            message: 'Password does not match.',
            messageClass: 'alert-danger'
        });
    }
});
app.get('/user', (req, res) => {
    res.json(users);
});
app.get("../package/temp2.html", (req, res) => {
    if (req.user) {
        res.render('../package/temp2.html');
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
    }
});

path="output.txt";

// checks execute permission
fs.access(path, fs.constants.X_OK, (err) => {
    if (err) {
        console.log("%s doesn't exist", path);
    } else {
        console.log('can execute %s', path);
    }
});
// Check if we have read/write permissions
// When specifying multiple permission modes
// each mode is separated by a pipe : `|`
fs.access(path, fs.constants.R_OK | fs.constants.W_OK, (err) => {
    if (err) {
        console.log("%s doesn't exist", path);
    } else {
        console.log('can read/write %s', path);
    }
});

fs.stat(path, function(err) {
    if (!err) {
        console.log(' %s file exists',path);
    }
    else if (err.code === 'ENOENT') {
        console.log('%s file does not exist',path);
    }
});

//linecount

var linesCount = 0;
var rl = readline.createInterface({
    input: fs.createReadStream(path),
    output: process.stdout,
    terminal: false
});
rl.on('line', function (line) {
    linesCount++; // on each linebreak, add +1 to 'linesCount'
});
rl.on('close', function () {
    console.log("%d line count of %s",linesCount,path); // print the result when the 'close' event is called
});

app.get('/user', (req, res) => {
    var jsonData = users
     // parse json
    var jsonObj = JSON.parse(JSON.stringify(jsonData));
    console.log(jsonObj);
    
      // stringify JSON Object
    var jsonContent = JSON.stringify(jsonObj);
    console.log(jsonContent);
    fs.appendFile("output.txt", jsonContent+'\r\n', function (err) {
       if (err) {
           console.log("An error occured while writing JSON Object to File.");
           return console.log(err);
       }
 
     console.log("JSON file has been saved.");
     });
    res.json(users);
});

console.log(users);

//reading file
var rl = readline.createInterface({
    input: fs.createReadStream(path),
    output: process.stdout,
    terminal: false
});



rl.on('line', function (line) {
    console.log(line) // print the content of the line on each linebreak
});


//multer

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  var upload = multer({ storage: storage })
//single file
  app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file)
   
  })
//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
      const error = new Error('Please choose files')
      error.httpStatusCode = 400
      return next(error)
    }
  
      res.send(files)
   
  })

  // Handle 404 error.
// The last middleware.
app.use("*",function(req,res){
    res.sendFile(__dirname + "/express/404.html");
    });
app.listen(process.env.PORT || 3000)