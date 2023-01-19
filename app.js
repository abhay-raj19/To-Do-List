const express = require("express");
const mongoose = require("mongoose");
const bodyparser=require("body-parser");


mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://abhay-raj19:7084851789@todo.yfc1nzj.mongodb.net/TodolistDB");

const itemsSchema ={
    name: String
};

const Item =mongoose.model("Item",itemsSchema);

const item1 =new Item({
    name:"welcome to your to do list!"
});

const item2 =new Item({
    name:"Hit the + button to add a new item."
});

const item3 =new Item({
    name:"<--Hit this to delete an item."
});


const defaultItems = [item1,item2,item3];

const listSchema={
    name:String,
    items:[itemsSchema]
};

const List = mongoose.model("List",listSchema);

const app = express();
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public")); 



app.get("/",function (req,res) {
    Item.find({},function (err,foundItems) {
        if(foundItems.length ===0 ){
            Item.insertMany(defaultItems,function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Sucsessfully added:");
                }
                
            });
            res.redirect("/");
        } else {
            res.render("list",{listtitle :"Today",newlistitems:foundItems});
        }
        
    });     
});

app.get("/:customListName",function (req,res) {
   const customListName = req.params.customListName;

   List.findOne({name:customListName},function(err,foundList){
    if (!err){
        if(!foundList){
            //cerate a new list
            const list =new List({
                name:customListName,
                items: defaultItems 
               });
            
               list.save();
               res.redirect("/"+ customListName);
        } else{
            //show existing list
    
            res.render("list",{listtitle:foundList.name, newlistitems: foundList.items});   
        }
    }
    
   });

   

});

app.post("/",function (req,res) {
    const itemName = req.body.newitem;
    const listname = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listname==="Today"){
        item.save();
        res.redirect("/");
    } else{
        List.findOne({name:listname},function (err,foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listname);
        });
    }

    
});

app.post("/delete",function (req,res) {
    const checkeditemid = req.body.checkbox;
    const listName = req.body.listName;


    if(listName==="Today"){
        Item.findByIdAndRemove(checkeditemid,function (err) {
            if(!err){
                console.log("sucefully removed the item");
                res.redirect("/");
            }
        }); 
    }else{
        List.findOneAndUpdate({name: listName} ,{$pull:{items:{_id:checkeditemid}}},function (err,foundList) {
            if(!err){
                res.redirect("/" + listName);
            }            
        });        
    }   
});



app.get("/work",function (req,res) {
    res.render("list",{listtitle:"Work List", newlistitems: workitems});   
});


app.get("/about",function (req,res) {
    res.render("about");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("SERVER STARTED : 3000 ");
});