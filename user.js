const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

// file system module to perform file operations
const fs = require('fs');
// const lineByLine = require('n-readlines');
// const liner = new lineByLine('express/output.txt');

const app = express();
app.use(express.json());
app.use(express.static("express"));
const port = 3000;
// Where we will keep users
let users = [];
//app.use(cookieParser());
app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// for JSON API

app.post('/user', (req, res) => {
    const user = req.body;

    // Output the book to the console for debugging
    console.log(user);
    users.push(user);

    res.send('User is added to the database');
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

//app.get('/read',(req,res))


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));