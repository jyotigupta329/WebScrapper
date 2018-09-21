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
});

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
    console.log("scrape is clicking");
    $.ajax({
        type: "GET",
        url: "/savedArticles"
    }).then(function (response) {
        console.log("ajax scrape call");
        console.log(response);
        window.location.href = "/savedArticles";
    });
});


// open model to view notes to saved articles
$(document).on("click", ".addNote", function () {

    // Grab the id associated with the article from the submit button
    var id = $(this).attr("data-id");
    console.log(id);
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "GET",
        url: "/viewSaveNotes/" + id,

    }).then(function (data) {
        // Empty the notes section
        let body = '<ul>';
        for (let eachData of data) {
            body += '<li><div><a class="deleteNote waves-effect waves-red btn add-comment-btn" data-id="' + eachData._id + '">X</a>' + eachData.body + '</div></li><hr>';
        }
        body += '</ul>';

        $("#notes-list").append(body);

    });

    // saving the note to Note on click of add in the modal
    $(".saveNote").on("click", function () {
        var noteInput = $("#new-note").val().trim();
        console.log(noteInput);
        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/saveNotes",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                // Value taken from note textarea
                _id: id,
                notes: noteInput,
            })
        })
        // With that done
            .then(function (data) {
                // Log the response
                console.log(data);

                // Empty the notes section
            });
        // Also, remove the values entered in the input and textarea for note entry
    });
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
});

$(document).on("click", ".deleteNote", function () {
    event.preventDefault();
    const noteId = $(this).attr("data-id");
    $.ajax({
        type: "DELETE",
        url: "/deleteNotes/" + noteId
    }).then(function (response) {
        console.log("ajax delete call" + response);
        window.location.href = "/savedArticles";
    });
});

