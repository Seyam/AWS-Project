/* -----------------------------                                                
  AUTHOR:  @SEYAM
  seyam.bd.net@gmail.com
------------------------------ */

const express = require('express');
const app = express();
const basicAuth = require('express-basic-auth')
const server = require('http').createServer(app);
var io = require('socket.io')(server);
var connections=[];


const fs = require("fs");
const bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer()



//var sys = require('sys');
//var net = require('net');
const sys = require('util');
var mqtt = require('mqtt'); 




//var broker = new mqtt.MQTTbroker(1883, '127.0.0.1', 'pusher');
const broker = mqtt.connect('mqtt://iot.eclipse.org')
broker.subscribe('sonar');
console.log('subscribed to topic \'sonar\'');
broker.subscribe('feedback');
console.log('subscribed to topic \'feedback\'');



app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// app.use(basicAuth({
//     users: { 'admin': 'secret' },
//     challenge: true, // <--- needed to actually show the login dialog!
//     unauthorizedResponse: getUnauthorizedResponse
// }))


//Uses a custom response body function
var customBodyAuth = basicAuth({
    challenge: false,
    users: { 'zakir': '123', 'sagar':'123' },
    unauthorizedResponse: getUnauthorizedResponse
})






//Multiple sockets requests handler 
io.sockets.on('connection', function (SocketIOclient) {

  console.log(SocketIOclient);

  connections.push(SocketIOclient);


  console.log('Connected: '+connections.length+' sockets connected!');



  SocketIOclient.on('disconnect',function(){ //No Parameter For Disconnect Event
    connections.splice(connections.indexOf(SocketIOclient),1);
    console.log('Disconnected: %s sockets connected!', connections.length);
  });


  // SocketIOclient.on('publish', function (data) {
  //     broker.publish(data.topic,data.payload); //NOTICE BOTH TOPIC & PAYLOAD HAVE TO PUBLISH
  //     console.log('publishing to '+data.topic+' to turn it '+data.payload);
  // });



  // SocketIOclient.on('subscribe', function (data) {
        
  //       //socket.join(data.topic);
  //       broker.subscribe(data.topic);
  //       console.log('Subscribing to '+data.topic);
  // });

});




//Custom authorizer checking if the username starts with 'A' and the password with 'secret'
function myAuthorizer(username, password) {
    return username.startsWith('A') && password.startsWith('secret')
}

//Same but asynchronous
function myAsyncAuthorizer(username, password, cb) {
    if(username.startsWith('A') && password.startsWith('secret'))
        return cb(null, true)
    else
        return cb(null, false)
}

function getUnauthorizedResponse(req) {
    // return req.auth ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') : 'No credentials provided'
    // var rejectedResponse = {'response':'rejected'}
    // var noCredentialResponse = {'response':'No credentials provided'}
    console.log("{'response':'denied'}")
    return req.auth ? JSON.stringify({"response":"denied"}) : JSON.stringify({"response":"No credentials provided"})
}


app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html');
})

app.post('/api/login/', upload.none(), function(req, res) {
    // res.status(200).send('{"response":"success"}')
    console.log("username: "+req.body.username)
    console.log("password: "+req.body.password)
    console.log("device_id: "+req.body.device_id)
    console.log("device_type: "+req.body.device_type)
   
    res.status(200).send({"message": "success", "status_code": "200"})
})




app.post('/api/get_leaseholder_details/',  upload.none(),  function(req, res) {
    console.log("username: "+req.body.username)
    console.log("device_id: "+req.body.device_id)

   fs.readFile( __dirname + "/SmartDays/" + "leaseholder_details.json", 'utf8', function (err, data) {
       console.log( "success" );
       res.end( data );
   });
    // console.log({"response":"success"})
})



app.post('/shome.html', upload.none(), function (req, res) {
  console.log("location: "+req.body.location)
  
   fs.readFile( __dirname + "/JSON/" + "apartmentList.json", 'utf8', function (err, data) {
       // console.log( data );
       res.end( data );
   });
})


app.post('/room_info', upload.none(), function (req, res) {
  console.log("apartment_id: "+req.body.apartment_id)
  
   fs.readFile( __dirname + "/JSON/" + "roomInfo.json", 'utf8', function (err, data) {
       // console.log( data );
       res.end( data );
   });
})

app.post('/request_availabliity', upload.none(), function (req, res) {
  console.log("from_date: "+req.body.from_date)
  console.log("to_date: "+req.body.to_date)
  console.log("bed_uniq_id: "+req.body.bed_uniq_id)
  
   fs.readFile( __dirname + "/JSON/" + "request_availabliity.json", 'utf8', function (err, data) {
       // console.log( data );
       res.end( data );
   });
})



app.post('/power', customBodyAuth, function(req, res) {
   // console.log("authHeader: "+req.headers.authorization)
   fs.readFile( __dirname + "/JSON/" + "Power.json", 'utf8', function (err, data) {
      console.log( "success" );
      res.end( data );
   });
    
})

app.post('/power_consumption_data', function(req, res) {
   // console.log("authHeader: "+req.headers.authorization)
   fs.readFile( __dirname + "/JSON/" + "powerBreakdown.json", 'utf8', function (err, data) {
      console.log( "success" );
      res.end( data );
   });
    
})


app.post('/api/get_leaseholder_details/',  upload.none(),  function(req, res) {
    console.log("username: "+req.body.username)
    console.log("device_id: "+req.body.device_id)

   fs.readFile( __dirname + "/SmartDays/" + "leaseholder_details.json", 'utf8', function (err, data) {
       console.log( "success" );
       res.end( data );
   });
    // console.log({"response":"success"})
})







app.get('/profile',  function (req, res) {
   fs.readFile( __dirname + "/JSON/" + "notificationProfile.json", 'utf8', function (err, data) {
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



// var io = require('socket.io').listen(5000);

server.listen(5000);
console.log("SocketIO server is running at port 5000!");