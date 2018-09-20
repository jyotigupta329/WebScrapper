
$('.modal').modal();

// to get all articles 
$("#scrape").on("click", function (event) {
  event.preventDefault();
  console.log("scrape is clicking");

  $.ajax({
    type: "GET",
    url: "/scrape"
  }).then(function (response) {
    console.log("ajax scrape call");
    console.log(response);
    window.location.href = "/";
  });
});

// to clear all articles
$("#clear").on("click", function (event) {
  event.preventDefault();
  console.log("clear is clicking");

  $.ajax({
    type: "DELETE",
    url: "/deleteArticles"
  }).then(function (response) {
    console.log("ajax delete call");
    window.location.href = "/";
  });
})

// save your selected articles
$(document).on("click", "#saveArticle", function (event) {
  event.preventDefault();
  var id = $(this).attr("data-id");
  console.log("save is clicking");
  $.ajax({
    type: "POST",
    url: "/saved/" + id
  }).then(function (response) {
    console.log("ajax saved articles call", response);
    window.location.href = "/";
  });
});

// View your saved articles
$("#viewSavedArticle").on("click", function (event) {
  event.preventDefault();
  window.location.href = "/savedArticles";
  // console.log("scrape is clicking");
  // $.ajax({
  //   type: "GET",
  //   url: "/savedArticles"
  // }).then(function (response) {
  //   console.log("ajax scrape call");
  //   console.log(response);
  //   window.location.href = "/savedArticles";
  // });
});



// open model to view notes to saved articles
$(document).on("click", ".addNote", function () {
  // Grab the id associated with the article from the submit button
  var id = $(this).attr("data-id");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/savenotes/" + id,
    data: {
      // Value taken from title input
      // title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// Save note 
// Save note to saved articles
$(document).on("click", ".saveNote", function () {
  // Grab the id associated with the article from the submit button
  var commentInput = $("#new-comment-field").val().trim();

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/savenotes/" + id,
    data: {
      // Value taken from title input
      // title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


// Delete saved article
$(document).on("click", ".deleteSavedArticle", function (event) {
  event.preventDefault();
  var id = $(this).attr("data-id");
  $.ajax({
    type: "DELETE",
    url: "/deleteSavedArticle/" + id
  }).then(function (response) {
    console.log("ajax delete call");
    window.location.href = "/savedArticles";
  });
})

