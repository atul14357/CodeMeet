const express= require("express");
require('dotenv').config();
const https= require("https");
var request = require('request');
const bodyParser= require('body-parser');
const axios = require("axios");
const cors = require("cors");
const app= express();

app.use(bodyParser.urlencoded({extended:true}));

const corsOptions ={
    origin:'http://localhost:3000',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

const server= require('http').createServer(app)
var io = require('socket.io')(server,{
  cors:{
    origin:"*"
  }
});

// making an object of {roomId:value} where value is in code editor
// so that we can set the initial code to editor
var room_val_obj={}
io.on('connection', (socket) => { 
     console.log(socket.id + ' joined')
    socket.emit('connection', null);
    
    socket.on('connecting',(payload)=>{
      //console.log(room_val_obj[[payload.roomId]]+ payload.roomId)
      if(room_val_obj[[payload.roomId]]===undefined){
        room_val_obj[[payload.roomId]] = payload.val
      }
      io.sockets.to(socket.id).emit('new_connection',{value:room_val_obj[[payload.roomId]]})
      socket.join(payload.roomId);
      //console.log(payload)
      socket.broadcast.to(payload.roomId).emit('new_user',payload.userName)
      
    })
    socket.on('code_change',(payload)=>{
      room_val_obj[[payload.roomId]]= payload.newValue;
      io.sockets.to(payload.roomId).emit('code_change',payload);
    })
    // socket.on("disconnect", () => {
    //   // socket.rooms.size === 0
    //   console.log(socket.id + ' left ');
    // });
});




// compiling code and sending back response
app.post('/',function(req,res){
  const clientId =process.env.CLIENT_ID;
const clientSecret=process.env.CLIENT_SECRET;
   //console.log('got request from frontend');
   //res.send("request received");
   var code=req.body.code;
   var input = req.body.input;
   var lang= req.body.language;
   var version_index='0';
   if(lang==='cpp') lang= 'cpp17';
   else if(lang==='python') lang= 'python3';
   else if(lang==='javascript') lang='nodejs';
   else if(lang==='java') version_index="1";
   //console.log(lang)
   var program = {
    script : code,
    language: lang,
    versionIndex: version_index,
    clientId: clientId,
    stdin:input,
    clientSecret:clientSecret
};
request({
    url: 'https://api.jdoodle.com/v1/execute',
    method: "POST",
    json: program
},
function (error, response, body) {
    // console.log('error:', error);
    // console.log('statusCode:', response && response.statusCode);
    // console.log('body:', body);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(body);
});
});




server.listen(3001,function(){
  console.log("Server started at port number 3001");
});


