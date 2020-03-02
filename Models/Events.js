mongoosee=require("mongoose");
autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

eventscehema=new mongoose.Schema({
    _id:Number,
    title: String,
    eventDate:Date,
    mainSpeaker:{type:Number,ref:"Speaker"},
    otherSpeakers:[{type:Number,ref:"Speaker"}]
});
eventscehema.plugin(autoIncrement.plugin,"events");
mongoose.model("events",eventscehema);