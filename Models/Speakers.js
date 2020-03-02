mongoose=require("mongoose");
autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);
speakerscehema=new mongoose.Schema({
    name:String, 
    password :String,
    age:Number,
    Address: {city:String,street:String,building:String}   
 });

speakerscehema.plugin(autoIncrement.plugin,"Speaker");
mongoose.model("Speaker",speakerscehema);
