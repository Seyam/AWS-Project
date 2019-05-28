/* -----------------------------                                                
  AUTHOR:  @SEYAM
  seyam.bd.net@gmail.com
------------------------------ */

var express = require('express');
var app = express();
var server = require('http').createServer(app);

var fs = require("fs");
var bodyParser = require('body-parser');


//var sys = require('sys');
//var net = require('net');
var sys = require('util');

app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded




app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html');
});


app.get('/data', function (req, res) {
   fs.readFile( __dirname + "/" + "sensorData.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})
 
// app.get('/data', function (req, res) {
//        //var dataRetrieved = db.getCollection('SensorData').find({});
//        SensorData.find({/*json object key */}, function (err, docs) {
//           //var dt = JSON.parse(docs);
//           console.log(docs);
//           res.json(docs); //perfect!!!
//           //res.end( JSON.stringify(docs));
//           //res.end(docs);
//             // docs.forEach 
//       });
       
// })



server.listen(5000);
console.log("SocketIO server is running at port 5000!");