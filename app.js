var express = require("express");
var bodyParser = require("body-parser")
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

mongoose.connect("Put your database connection string here",{ useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false);


var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type:Date,
        default: Date.now
    }
})

var blog = mongoose.model("Blog",blogSchema);

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"))

// blog.create(
//     {title:"vikram",image:"https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",body:" vikram"},
//     function(err,campground) {
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log("Newly created blog: ");
//             console.log(campground);
//         }
//     }
//  )


// Restful Routes




app.get("/",function(req,res) {
    res.redirect("/blogs")
})

app.get("/blogs",function(req,res) {
    blog.find({},function(err,blogs) {
        if(err){
            console.log(err);
        }
        else{
            res.render("index.ejs",{blogs:blogs});
        }
    })
    
})

app.post("/blogs",function(req,res) {
    // var title = req.body.title;
    // var img = req.body.image;
    // var desc = req.body.body;
    // var b = {title:title,image:img,body:desc};
    // campgrounds.push(camp);
    req.body.blog.body = req.sanitize(req.body.blog.body)
    blog.create(
        req.body.blog,
        function(err,campground) {
            if(err){
                console.log(err);
            }
            else{
                res.redirect("/blogs");
            }
        }
    )    
})



app.get("/blogs/new",function(req,res) {
    res.render("new.ejs");
})


app.get("/blogs/:id",function(req,res) {
    // res.send("this will be the show page");
    blog.findById(req.params.id,function(err,blog) {
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.render("show.ejs",{blog:blog});
        }
    })



})

app.get("/blogs/:id/edit",function(req,res) {
    // res.send("this will be the show page");
    blog.findById(req.params.id,function(err,blog) {
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.render("edit.ejs",{blog:blog});
        }
    })
})


app.put("/blogs/:id",function(req,res) {
   
    req.body.blog.body = req.sanitize(req.body.blog.body)
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog) {
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.redirect("/blogs/"+ req.params.id);
        }
    })
})

app.delete("/blogs/:id",function(req,res) {
   
    blog.findByIdAndRemove(req.params.id,function(err) {
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.redirect("/blogs")
        }
    })
})



app.listen(8080,function() {
    console.log("Server is listening on port 3000");
})