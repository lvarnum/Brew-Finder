var name;
var queryURL;
var searchPage = $(".search-page");
var resultsPage = $(".results-page");
var savedPage = $(".saved-page");
var indexPage = $(".index-page");

searchPage.css("display", "none");
resultsPage.css("display", "none");
savedPage.css("display", "none");
var count = 0;

if (localStorage.getItem("saved") === null) {
    var saved = [];
    localStorage.setItem("saved", JSON.stringify(saved));
}

var saved = JSON.parse(localStorage.getItem("saved"));

if (saved.length === 0) {
    $(".saved-recipes").text("No Saved Recipes");
}

else {
    createSaved();
}

function createSaved() {
    count++;
    for (var i = 0; i < saved.length; i++) {
        var card = $("<div>");
        card.addClass("card single");
        var image = $("<img>");
        image.addClass("card-img-top");
        var cardBody = $("<div>");
        cardBody.addClass("card-body");
        var cardTitle = $("<h5>");
        cardTitle.addClass("card-title");
        var ingLabel = $("<button>");
        ingLabel.addClass("btn btn-link ingredient");
        ingLabel.text("Ingredients");
        var ingredients = $("<ul>");
        ingredients.addClass("card-text ingredients");
        var instButton = $("<button>");
        instButton.addClass("btn btn-link instruction");
        instButton.text("Instructions");
        var instructions = $("<p>");
        instructions.addClass("card-text instructions");
        var cardButton = $("<button>");
        cardButton.addClass("btn btn-primary delete-recipe");
        cardButton.text("Delete Recipe");
        for (var j = 0; j < saved[i].ingredients.length; j++) {
            var li = $("<li>");
            li.text(saved[i].ingredients[j]);
            ingredients.append(li);
        }
        var line = $("<hr>");
        var lineTwo = $("<hr>");
        instructions.text(saved[i].instructions);
        image.attr("src", saved[i].image);
        cardTitle.text(saved[i].name);
        cardBody.append(cardTitle, line, ingLabel, ingredients, lineTwo, instButton, instructions, cardButton);
        card.append(image, cardBody);
        instructions.hide();
        ingredients.hide();
        instructions.attr("visible", "false");
        ingredients.attr("visible", "false");
        var row = $("<div>");
        row.addClass("row saved-recipe");
        var col = $("<div>");
        col.addClass("col");
        col.append(card);
        if (i > 0) {
            row.append(col);
            $(".all-saved").append(row);
        }
        else {
            $(".saved-recipes").text('');
            $(".saved-recipes").append(col);
        }
    }
    if (count === 1) {
        var deleteAll = $("<button>");
        deleteAll.addClass("pure-button delete-all");
        deleteAll.text("Clear All Recipes");
        $(".delete-all-button").append(deleteAll);
    }
}

$("#cocktails").on("click", function () {
    indexPage.css("display", "none");
    searchPage.show();
    name = $("#cocktails").attr("name");
    var header = $("#header");
    header.text(name + " Recipes");
});

$("#meals").on("click", function () {
    indexPage.css("display", "none");
    searchPage.show();
    name = $("#meals").attr("name");
    var header = $("#header");
    header.text(name + " Recipes");
});

$(".random-pair").on("click", function () {
    indexPage.css("display", "none");
    $(".results").empty();
    $(".result").empty();
    resultsPage.show();
    var mealURL = "https://www.themealdb.com/api/json/v1/1/random.php";
    var cocktailURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
    callMeal(mealURL, "pair");
    callCocktail(cocktailURL, "pair");
});

$(".random-single").on("click", function () {
    searchPage.css("display", "none");
    $(".results").empty();
    $(".result").empty();
    resultsPage.show();
    if ($("#header").text().includes("Cocktail")) {
        queryURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
        callCocktail(queryURL, "single");
    }
    else {
        queryURL = "https://www.themealdb.com/api/json/v1/1/random.php";
        callMeal(queryURL, "single");
    }
});

$("#search-btn").on("click", function (event) {
    event.preventDefault();
    searchPage.css("display", "none");
    $(".results").empty();
    $(".result").empty();
    resultsPage.show();
    var term = $("#search").val();
    $("#search").val('');
    if ($("#header").text().includes("Cocktail")) {
        queryURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + term;
        callCocktail(queryURL, "single");
    }
    else {
        queryURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term;
        callMeal(queryURL, "single");
    }
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

function callMeal(queryURL, type) {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        if (response.meals === null) {
            var col = $("<div>");
            col.addClass("col");
            col.text("No Results");
            $(".results").append(col);
            return;
        }
        for (var i = 0; i < response.meals.length; i++) {
            var card = $("<div>");
            card.addClass("card " + type);
            var image = $("<img>");
            image.addClass("card-img-top");
            var cardBody = $("<div>");
            cardBody.addClass("card-body");
            var cardTitle = $("<h5>");
            cardTitle.addClass("card-title");
            var ingLabel = $("<button>");
            ingLabel.addClass("btn btn-link ingredient");
            ingLabel.text("Ingredients");
            var ingredients = $("<ul>");
            ingredients.addClass("card-text ingredients");
            var instButton = $("<button>");
            instButton.addClass("btn btn-link instruction");
            instButton.text("Instructions");
            var instructions = $("<p>");
            instructions.addClass("card-text instructions");
            var cardButton = $("<button>");
            cardButton.addClass("btn btn-primary save-recipe");
            cardButton.text("Save Recipe");
            var ingArray = [];
            var amtArray = [];
            var items = Object.entries(response.meals[i]);
            for (var j = 0; j < items.length; j++) {
                if (items[j][0].includes("Ingredient")) {
                    if (items[j][1] !== "" && items[j][1] !== null) {
                        ingArray.push(items[j][1]);
                    }
                }
                if (items[j][0].includes("Measure")) {
                    if (items[j][1] !== "" && items[j][1] !== null) {
                        amtArray.push(items[j][1]);
                    }
                }
            }
            for (var k = 0; k < ingArray.length; k++) {
                var li = $("<li>");
                if (amtArray[k] === undefined) {
                    amtArray.push("");
                }
                li.text(ingArray[k] + " : " + amtArray[k]);
                ingredients.append(li);
            }
            var line = $("<hr>");
            var lineTwo = $("<hr>");
            instructions.text(response.meals[i].strInstructions);
            image.attr("src", response.meals[i].strMealThumb);
            cardTitle.text(response.meals[i].strMeal);
            cardBody.append(cardTitle, line, ingLabel, ingredients, lineTwo, instButton, instructions, cardButton);
            card.append(image, cardBody);
            instructions.hide();
            ingredients.hide();
            instructions.attr("visible", "false");
            ingredients.attr("visible", "false");
            var row = $("<div>");
            row.addClass("row result");
            var col = $("<div>");
            col.addClass("col");
            col.append(card);
            if (i > 0) {
                row.append(col);
                $(".results-page").append(row);
            }
            else {
                $(".results").append(col);
            }
        }
    });
}

function callCocktail(queryURL, type) {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        if (response.drinks === null) {
            var col = $("<div>");
            col.addClass("col");
            col.text("No Results");
            $(".results").append(col);
            return;
        }
        for (var i = 0; i < response.drinks.length; i++) {
            var card = $("<div>");
            card.addClass("card " + type);
            var image = $("<img>");
            image.addClass("card-img-top");
            var cardBody = $("<div>");
            cardBody.addClass("card-body");
            var cardTitle = $("<h5>");
            cardTitle.addClass("card-title");
            var ingLabel = $("<button>");
            ingLabel.addClass("btn btn-link ingredient");
            ingLabel.text("Ingredients");
            var ingredients = $("<ul>");
            ingredients.addClass("card-text ingredients");
            var instButton = $("<button>");
            instButton.addClass("btn btn-link instruction");
            instButton.text("Instructions");
            var instructions = $("<p>");
            instructions.addClass("card-text instructions");
            var cardButton = $("<button>");
            cardButton.addClass("btn btn-primary save-recipe");
            cardButton.text("Save Recipe");
            var ingArray = [];
            var amtArray = [];
            var items = Object.entries(response.drinks[i]);
            for (var j = 0; j < items.length; j++) {
                if (items[j][0].includes("Ingredient")) {
                    if (items[j][1] !== "" && items[j][1] !== null) {
                        ingArray.push(items[j][1]);
                    }
                }
                if (items[j][0].includes("Measure")) {
                    if (items[j][1] !== "" && items[j][1] !== null) {
                        amtArray.push(items[j][1]);
                    }
                }
            }
            for (var k = 0; k < ingArray.length; k++) {
                var li = $("<li>");
                if (amtArray[k] === undefined) {
                    amtArray.push("");
                }
                li.text(ingArray[k] + " : " + amtArray[k]);
                ingredients.append(li);
            }
            var line = $("<hr>");
            var lineTwo = $("<hr>");
            instructions.text(response.drinks[i].strInstructions);
            image.attr("src", response.drinks[i].strDrinkThumb);
            cardTitle.text(response.drinks[i].strDrink);
            cardBody.append(cardTitle, line, ingLabel, ingredients, lineTwo, instButton, instructions, cardButton);
            card.append(image, cardBody);
            instructions.hide();
            ingredients.hide();
            instructions.attr("visible", "false");
            ingredients.attr("visible", "false");
            var row = $("<div>");
            row.addClass("row result");
            var col = $("<div>");
            col.addClass("col");
            col.append(card);
            if (i > 0) {
                row.append(col);
                $(".results-page").append(row);
            }
            else {
                $(".results").append(col);
            }
        }
    });
}

$(document).on("click", ".instruction", function () {
    var body = $(this).parent();
    var instructions = body.children(".instructions");
    if (instructions.attr("visible") === "false") {
        instructions.show();
        instructions.attr("visible", "true");
    }
    else {
        instructions.hide();
        instructions.attr("visible", "false");
    }
});

$(document).on("click", ".ingredient", function () {
    var body = $(this).parent();
    var ingredients = body.children(".ingredients");
    if (ingredients.attr("visible") === "false") {
        ingredients.show();
        ingredients.attr("visible", "true");
    }
    else {
        ingredients.hide();
        ingredients.attr("visible", "false");
    }
});

$(document).on("click", ".save-recipe", function () {
    var body = $(this).parent();
    var confirmation = $("<div>");
    var line = $("<hr>");
    confirmation.text("Saved!");
    body.append(line, confirmation);
    var recipe = {
        name: body.children(".card-title").text(),
        ingredients: [],
        instructions: body.children(".instructions").text(),
        image: body.parent().children(".card-img-top").attr("src")
    };
    $("li").each(function () {
        recipe.ingredients.push($(this).text());
    });
    saved.push(recipe);
    localStorage.setItem("saved", JSON.stringify(saved));
    createSaved();
});

$(document).on("click", ".delete-recipe", function () {
    var body = $(this).parent();
    for (var i = 0; i < saved.length; i++) {
        if (saved[i].name === body.children(".card-title").text()) {
            saved.splice(i, 1);
        }
    }
    if (saved.length === 0) {
        $(".saved-recipes").text("No Saved Recipes");
        $(".delete-all").remove();
        count = 0;
    }
    localStorage.setItem("saved", JSON.stringify(saved));
    var card = body.parent();
    var col = card.parent();
    col.parent().remove();
});

$(document).on("click", ".delete-all", function () {
    for (var i = 0; i < saved.length; i++) {
        $(".all-saved").children(".row").remove();
    }
    saved = [];
    localStorage.setItem("saved", JSON.stringify(saved));
    $(".delete-all").remove();
    var row = $("<div>");
    row.addClass("row");
    var col = $("<col>");
    col.addClass("col saved-recipes");
    col.text("No Saved Recipes");
    row.append(col);
    $(".all-saved").append(row);
    count = 0;
});





