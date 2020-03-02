const express=require("express");
const session = require('express-session');
const server=express();
let path=require("path");
let authenticationRouter=require("./Routers/authRouter.js");
let speakerRouter=require("./Routers/speakerRouter.js");
let eventRouter=require("./Routers/eventsRouter.js");
const mongoose=require("mongoose");
server.use(session({secret: 'alaa'}));

mongoose.connect("mongodb://localhost:27017/ITIDaB")
.then((data)=>{
    console.log("db connect")
}).catch((error)=>{
    console.log(error+"");
    
});

server.use(express.urlencoded({extended:false}));
server.set('view engine','ejs');

server.set(path.join(__dirname,"views"));
server.use(express.static(path.join(__dirname,"./public")));
server.use(express.static(path.join(__dirname, 'node_modules')));

server.listen(8080,()=>{
    console.log("iam listenig....");
});

server.get("/home",function(request,response){
    response.send("HOME Page");
});

server.use(authenticationRouter);

server.use(function(request,response,next){
    if(request.session.role&&request.session.role!="notspeaker"){
        response.locals.name=request.session.name;
        next();
    }
    else{
        response.redirect("/login");
    }
    
});

server.use("/speakers",speakerRouter);
server.use(function(request,response,next){
   
    if(request.session.role=="admin"){
         next();
    }
    else{
        response.send("you are not admin");
    }
    
});
server.use("/events",eventRouter);
