var queryURL;

$("#cocktails").on("click", function () {
    window.location.href = "search.html";

    var term = $("#search");
    term = term.val();
    console.log(term);

    queryURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + term;
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

});

$("#meals").on("click", function () {
    window.location.href = "search.html";

    var term = $("#search");
    term = term.val();
    console.log(term);

    queryURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term;
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

});

$(".random").on("click", function () {
    window.location.href = "results.html";
});


