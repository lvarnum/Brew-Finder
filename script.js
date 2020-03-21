$("#cocktails").on("click", function (event) {
    event.preventDefault();
    window.location.href = "search.html";

})

$("#meals").on("click", function (event) {
    event.preventDefault();
    window.location.href = "search.html";

})

$(".pure-button").on("click", function (event) {
    event.preventDefault();
    window.location.href = "search.html";
})


var term = $("#Search");
term = term.val();
console.log(term);

var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + term;
// Performing an AJAX request with the queryURL
$.ajax({
    url: queryURL,
    method: "GET"
})
    // After data comes back from the request
    .then(function (response) {
        console.log(queryURL);

        console.log(response);
    });