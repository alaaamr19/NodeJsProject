const mongoose = require("mongoose");
const express = require("express");
const eventRouter = express.Router();
require("../Models/Events");
const events = mongoose.model("events");
const speakers = mongoose.model("Speaker");

eventRouter.get("/list", function (request, response) {
    events.find({}).populate({ path: "mainSpeaker otherSpeakers" }).
        then((data) => {
            response.render("EventsList.ejs", { data: data });

        }).catch((error) => {
            console.log(error);
        });

});

eventRouter.post("/add", function (request, response) {
    let event = new events(request.body).save()
        .then((data) => {
            console.log(data);
            response.redirect("./list");
        }).catch((error) => {
            console.log(error + "");
        });

});
eventRouter.get("/add", function (request, response) {
    speakers.find({}).
        then((data) => {
            response.render("AddEventt.ejs", { data: data });

        }).catch((error) => {
            console.log(error);
        });

});

eventRouter.post("/update", function (request, response) {
    events.updateOne({ _id: request.body['_id'] }, { $set: request.body })
        .then((data) => {
            console.log( request.body, request.body['_id']);
            response.redirect("./list")

        }).catch((error) => {
            console.log(error + "");
        });
});

eventRouter.get("/update/:id", function (request, response) {
    events.find({ _id: request.params.id }).populate({ path: "mainSpeaker otherSpeakers" }).
        then((eventdata) => {
            speakers.find({}).
                then((data) => {

                    response.render("EditEventt.ejs", { eventdata: eventdata, speakerdata: data });


                }).catch((error) => {
                    console.log(error);
                });
        });


});

eventRouter.get("/delete/:id", function (request, response) {
    events.deleteOne({ _id: request.params.id })
        .then((data) => {
            response.send(data);
        }).catch((error) => {
            console.log(error + "");
        });
});

module.exports = eventRouter;