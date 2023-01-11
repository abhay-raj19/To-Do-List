const express = require("express");
const bodyparser=require("body-parser");
const { getDay, getDate } = require("./date");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public")); 
const items = ["Buy Food","Cook Food","Eat Food"];
const workitems = [];
app.get("/",function (req,res) {

    const day = getDate();
    res.render("list",{listtitle :day,newlistitems:items});
    
});

app.post("/",function (req,res) {
    const item = req.body.newitem;
    console.log(req.body);

    if (req.body.list === "Work" ) {
        workitems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});
app.get("/work",function (req,res) {
    res.render("list",{listtitle:"Work List", newlistitems: workitems});   
});
app.get("/about",function (req,res) {
    res.render("about");
});

app.listen(3000,function(){
    console.log("SERVER STARTED : 3000 ");
});