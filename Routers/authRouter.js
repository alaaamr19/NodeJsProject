const express = require("express");
const mongoose = require("mongoose");
const authRouter = express.Router();
require("../Models/Speakers");
const speakers = mongoose.model("Speaker");
const session = require('express-session');


authRouter.get("/login", function (request, response) {
    if (request.session.role != "notspeaker") {
        response.render('login.ejs', { alert: 0 });
    }
    else {
        response.render('login.ejs', { alert: 1 });
    }
});
authRouter.post("/login", function (request, response) {
    if (request.body.username == "alaa" && request.body.password == "123") {
        request.session.role = "admin";
        response.redirect("/speakers/list");

    }
    else {
        request.session.name = request.body.username;
        request.session.password = request.body.password;
        request.session.role = "speaker";
        response.redirect("speakers/profile");
    }

});

authRouter.get("/register", function (request, response) {
    response.render("regester.ejs");
});
authRouter.post("/register", function (request, response) {
    let newSpeaker = new speakers({
        _id: request.body.id,
        name: request.body.name,
        password: request.body.password,
        age: request.body.age,
        "Address.city": request.body.addcity,
        "Address.street": request.body.addst,
        "Address.bulding": request.body.addbl,


    }).save().then(() => {
        response.redirect("/speakers/list");
    }).catch((error) => {
        console.log(error + "");

    });
});
authRouter.get("/logout", function (request, response) {
    request.session.destroy();
    response.redirect("/login")
});
module.exports = authRouter;
