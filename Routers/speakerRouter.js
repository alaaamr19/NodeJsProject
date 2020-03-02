const mongoose=require("mongoose");
const express=require("express");
const SpeakersRouter=express.Router();

require("../Models/Speakers");
const speakers=mongoose.model("Speaker");
require("../Models/Events");
const events=mongoose.model("events");




SpeakersRouter.get("/add",function(request,response){
    response.render('regester.ejs')
});
SpeakersRouter.get("/profile",function(request,response){
    speakers.find({name:request.session.name,password:request.session.password}).
            then((SpeakersData)=>{
                if(SpeakersData[0]){
                    console.log(SpeakersData);
                    events.find({$or:[{mainSpeaker:SpeakersData[0]._id},{otherSpeakers:SpeakersData[0]._id}]}).then((speakersevent)=>
                        {                              
                            if(!speakersevent[0]){
                                response.render("speakerprofile.ejs",{SpeakersData:SpeakersData,eventdata:0});
                            }
                            else{
                                response.render("speakerprofile.ejs",{SpeakersData:SpeakersData,eventdata:speakersevent});}
                        }).catch((error)=>{
                            response.send(error);
                        }) }   
            else{
                request.session.role="notspeaker";
                response.redirect("login");
                
            }
                
            }).catch((error)=>{
                response.send(error);
            });    
});

SpeakersRouter.post("/add",function(request,response){
    let newSpeaker=new speakers({
        _id:request.body.id,
        name:request.body.name,
        password:request.body.password,
        age:request.body.age,
        "Address.city":request.body.addcity,
        "Address.street":request.body.addst,
        "Address.bulding":request.body.addbl,


    }).save().then(()=>{
        response.redirect("/speakers/list");
    }).catch((error)=>{
        console.log(error+"");
        
    });
    
});

SpeakersRouter.get("/update/:id",function(request,response){
    request.session.idkey=request.params.id;
    speakers.find({_id:request.params.id},{}).then(function(data){
       
        response.render('EditSpeakerr.ejs',{data:data[0]})
    })
})


SpeakersRouter.post("/update",function(request,response){
    if(request.session.idkey==request.body.id || request.session.role=="admin"){
        speakers.updateOne({_id:request.body.id},{$set:{name:request.body.name,password:request.body.password,
            age:request.body.age,
            "Address.city":request.body.addcity,
            "Address.street":request.body.addst,
            "Address.building":request.body.addbl
        }}).then(()=>{
            console.log(request.body);
            response.redirect("/speakers/profile")
        
        }).catch((error)=>{
     console.log("error :"+error);
     
 });}
 else
    {
        response.send("you are not admin")
    }
});

 SpeakersRouter.use(function(request,response,next){
    if(request.session.role=="admin"){
         next();
    }
    else{
        response.send("you are not admin");
    }
    
});
SpeakersRouter.get("/list",function(request,response){
    speakers.find({}).
    then((SpeakersData)=>{
       
        response.render("list.ejs",{SpeakersData :SpeakersData});
    }).catch((error)=>{
        console.log(error+"");
    });

    
});
SpeakersRouter.get("/delete/:id",function(request,response){
    speakers.deleteOne({_id:request.params.id}).then((data)=>{
        response.send(data);
        
    }).catch((error)=>{
        console.log(error+"");
        
    });    
    

});
module.exports=SpeakersRouter;