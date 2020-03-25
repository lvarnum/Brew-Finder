var name;
var searchPage = $(".search-page");
var resultsPage = $(".results-page");
var savedPage = $(".saved-page");
var indexPage = $(".index-page");

searchPage.css("display", "none");
resultsPage.css("display", "none");
savedPage.css("display", "none");

$("#cocktails").on("click", function () {
    indexPage.css("display", "none");
    searchPage.css("display", "inline");
    name = $("#cocktails").attr("name");
    var header = $("#header");
    header.text(name + " Recipe Search");
});

// // var term = $("#search");
// // term = term.val();
// // console.log(term);

$("#meals").on("click", function () {
    indexPage.css("display", "none");
    searchPage.show();
    name = $("#meals").attr("name");
    var header = $("#header");
    header.text(name + " Recipe Search");
});

$(".random-pair").on("click", function () {
    indexPage.css("display", "none");
    $(".meal").empty();
    $(".cocktail").empty();
    resultsPage.show();
    var mealURL = "https://www.themealdb.com/api/json/v1/1/random.php";
    var cocktailURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
    callRandomMeal(mealURL);
    callRandomCocktail(cocktailURL);
});

$(".random-single").on("click", function () {
    searchPage.css("display", "none");
    resultsPage.show();
});

$("#search-btn").on("click", function (event) {
    event.preventDefault();
    searchPage.css("display", "none");
    resultsPage.show();

});

$(".navbar-brand").on("click", function () {
    searchPage.css("display", "none");
    resultsPage.css("display", "none");
    $(".saved-page").css("display", "none");
    $(".index-page").show();
});

$(".home").on("click", function () {
    $(".search-page").css("display", "none");
    $(".results-page").css("display", "none");
    $(".saved-page").css("display", "none");
    $(".index-page").show();
});

$(".saved").on("click", function () {
    $(".search-page").css("display", "none");
    $(".results-page").css("display", "none");
    $(".index-page").css("display", "none");
    $(".saved-page").show();
});

function callRandomMeal(queryURL) {
    var card = $("<div>");
    card.addClass("card");
    var image = $("<img>");
    image.addClass("card-img-top");
    var cardBody = $("<div>");
    cardBody.addClass("card-body");
    var cardTitle = $("<h5>");
    cardTitle.addClass("card-title");
    var cardText = $("<p>");
    cardText.addClass("card-text");
    var cardButton = $("<button>");
    cardButton.addClass("btn btn-primary save-recipe");
    card - cardButton.text("Save Recipe");
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var items = Object.entries(response.meals[0]);
        for (var i = 0; i < items.length; i++) {
            if (items[i][0].includes("Ingredient")) {
                if (items[i][1] != "" || items[i][1] != null) {
                    console.log(items[i][1]);
                }
            }
        }
        image.attr("src", response.meals[0].strMealThumb);
        cardTitle.text(response.meals[0].strMeal);
        cardBody.append(cardTitle);
        card.append(image, cardBody);
        $(".meal").append(card);
    });
}

function callRandomCocktail(queryURL) {
    var card = $("<div>");
    card.addClass("card");
    var image = $("<img>");
    image.addClass("card-img-top");
    var cardBody = $("<div>");
    cardBody.addClass("card-body");
    var cardTitle = $("<h5>");
    cardTitle.addClass("card-title");
    var cardText = $("<p>");
    cardText.addClass("card-text");
    var cardButton = $("<button>");
    cardButton.addClass("btn btn-primary save-recipe");
    card - cardButton.text("Save Recipe");
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        image.attr("src", response.drinks[0].strDrinkThumb);
        cardTitle.text(response.drinks[0].strDrink);
        cardBody.append(cardTitle);
        card.append(image, cardBody);
        $(".cocktail").append(card);
    });
}


