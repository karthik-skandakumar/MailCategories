var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    sanitizer = require("express-sanitizer");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/mailCategories", {useNewUrlParser: true, useFindAndModify: false});
// Schema for a mail category
var mailCategorySchema = new mongoose.Schema({
    name: String,
    description: String,
    created: {type: Date, default: Date.now}
});

// Compile schema into the model
var MailCategory = mongoose.model("MailCategory", mailCategorySchema);

/*
var mailCategories = [{name: "Cat01", description: "Description for Cat01", created: Date.now()},
                      {name: "Cat02", description: "Description for Cat02", created: Date.now()},
                      {name: "Cat03", description: "Description for Cat03", created: Date.now()},
                      {name: "Cat04", description: "Description for Cat04", created: Date.now()},
                      {name: "Cat05", description: "Description for Cat05", created: Date.now()}
                    ];
mailCategories.forEach((mailCategory)=>{
    MailCategory.create(mailCategory, (err)=> {
        if(err){
            console.log("Didn't create");
        }
        else {
            console.log("Created " + mailCategory.name );
        }
    });
});
*/

// The default route and the GET for listing all mail categories use the same handler
app.get("/", defaultHandler);
app.get("/mailCategories", defaultHandler);
app.get("/mailCategories/:pageNumber", defaultHandler);
function defaultHandler(req, res){
    MailCategory.find({}, (err, mailCategories)=>{
        if(err) {
            console.log("Failed to get all mail categories");
            console.log(err);
        }
        else {
            var pageNumber = Number.parseInt(req.params.pageNumber) || 1; // TODO: Move this before fetching from DB and use to fetch precisely only what is required.
            res.render("index", { mailCategories: mailCategories, pageNumber: pageNumber });
        }
    });
};

// Show a page to create a mail category. Input fields with placeholder.
app.get("/new", (req, res)=>{
    res.render("new");
});

// Start listening for incoming requests
app.listen(5000, "localhost", ()=>{
    console.log("Mail Categories started");
});