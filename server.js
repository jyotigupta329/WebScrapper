var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webScrapper";

// // Set mongoose to leverage built in JavaScript ES6 Promises
// // Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI);

// Connect to the Mongo DB webScrapper
mongoose.connect("mongodb://localhost/webScrapper", { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.echojs.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
// app.get("/articles", function (req, res) {
//   // Grab every document in the Articles collection
//   db.Article.find({})
//     .then(function (dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       res.render("index", { data: dbArticle });
//     })
//     .catch(function (err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });


app.get("/", function (req, res) {
  console.log("/all route is getting hit by button");
  db.Article.find({}, function (error, found) {
    if (error) {
      console.log(error);
    }
    else {
      // console.log(found);
      // console.log("the index should be rendered now");
      res.render("index", { data: found });
    }
  });
});



// POST Route to add article to saved list
app.post("/saved/:id", function (req, res) {

  db.Article.findOne({ _id: req.params.id }, function (err, article) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    } else {
      var savedArticle = new db.SavedArticle({
        title: article.title,
        link: article.link
      });
      savedArticle.save().then(function (dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
        article.remove({}, function (error) {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          } else {
            console.log("deleted all articles:");
            res.sendStatus(200);
          }
        });
      }).catch(function (err) {
        res.sendStatus(400);
      });

    }
  });
});

// A GET route for viewing all saved articles
app.get("/savedArticles", function (req, res) {
  console.log("/savedArticles route was hit");
  db.SavedArticle.find({}, function (error, foundSavedArticle) {
    if (error) {
      console.log(error);
    }
    else {
      console.log("Saved articles:");
      console.log(foundSavedArticle.length);
      res.render("savedArticles", { data: foundSavedArticle })
    }
  });
});

// A DELETE route to delete all articles
app.delete("/deleteArticles", function (req, res) {
  db.Article.remove({}, function (error) {
    if (error) {
      console.log(error);
    }
    else {
      console.log("deleted all articles:");
      res.sendStatus(200);
    }
  });
})

// A DELETE route saved article
app.delete("/deleteSavedArticle/:id", function (req, res) {
  console.log("hit button Delete all articles!!");
  db.SavedArticle.findByIdAndRemove({ _id: req.params.id }, function (error) {
    if (error) {
      console.log(error);
    }
    else {
      console.log("deleted all articles:");
      res.sendStatus(200);
    }
  });
})

// A POST route to save notes for each article




app.post("/saveNotes/:id", function (req, res) {
  console.log("Clicked to save note button");
  db.SavedArticle.findById({ _id: req.params.id }, function (err, foundNotes) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    } else {
      var note = new db.Note({
        // title: article.title,
        body: foundNotes.body
      });
      note.save().then(function (dbNote) {
        // View the added result in the console
        console.log(dbNote);
      }).catch(function (err) {
        res.sendStatus(400);
      });

    }
  });
});

// A GET route to display comment
app.get("/viewSaveNotes/:id", function () {
  // find article with associated ID
  db.Note.findOne({ _id: req.params.id })
    // populate Article with comments
    .populate("comment")
    .then(function (err, commentData) {
      if (err) {
        console.log(err);
      } else {
        res.render("saved", { Data: commentData });
      }
    });
})


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});