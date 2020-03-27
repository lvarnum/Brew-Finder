// Declare global variables
var name;
var queryURL;
var searchPage = $(".search-page");
var resultsPage = $(".results-page");
var savedPage = $(".saved-page");
var indexPage = $(".index-page");

// Hide pages that aren't part of the home
searchPage.hide();
resultsPage.hide();
savedPage.hide();

// Set local storage as a string array
if (localStorage.getItem("saved") === null) {
    var saved = [];
    localStorage.setItem("saved", JSON.stringify(saved));
}

// Declaring var to hold the object array from local storage
var saved = JSON.parse(localStorage.getItem("saved"));

// Checking if local storage has any saved recipies
if (saved.length === 0) {
    noSaved();
}
else {
    createSaved(0);
}

// Set amount of saved recipes in storage
var count = saved.length;

// Function to show "No Saved Recipes"
function noSaved() {
    var row = $("<row>");
    row.addClass("row no-saved");
    var col = $("<col>");
    col.addClass("col");
    col.text("No Saved Recipes");
    row.append(col);
    $(".all-saved").append(row);
}


// Function to create cards for the saved recipes page based on local storage
function createSaved(index) {

    // Starting at the index provided in the parameter, loop through the saved array
    for (var i = index; i < saved.length; i++) {
        // Create new cards to hold the saved recipe info
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

        // Create list items for the saved ingredients
        for (var j = 0; j < saved[i].ingredients.length; j++) {
            var li = $("<li>");
            li.text(saved[i].ingredients[j]);
            ingredients.append(li);
        }

        // Set other card elements
        var line = $("<hr>");
        var lineTwo = $("<hr>");
        instructions.text(saved[i].instructions);
        image.attr("src", saved[i].image);
        cardTitle.text(saved[i].name);

        // Append all card elements to the card
        cardBody.append(cardTitle, line, ingLabel, ingredients, lineTwo, instButton, instructions, cardButton);
        card.append(image, cardBody);

        // Hide ingredients list and instructions in a dropdown
        instructions.hide();
        ingredients.hide();
        instructions.attr("visible", "false");
        ingredients.attr("visible", "false");

        // Create and append new rows and cols with the cards to the saved page
        $(".no-saved").remove();
        var row = $("<div>");
        row.addClass("row saved-recipe");
        var col = $("<div>");
        col.addClass("col");
        col.append(card);
        row.append(col);
        $(".all-saved").append(row);

    }

    // Create the delete all button on the first call to the function
    if (index === 0) {
        var deleteAll = $("<button>");
        deleteAll.addClass("pure-button delete-all");
        deleteAll.text("Clear All Recipes");
        $(".delete-all-button").append(deleteAll);
    }
}

// Function that calls the mealDB api and creates recipe cards for the results page
function callMeal(queryURL, type) {

    // AJAX call to provided queryURL
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        // If no results come up, show "No Results" and create Search Again button
        if (response.meals === null) {
            var noResults = $("<div>");
            noResults.addClass("row no-results");
            var col = $("<div>");
            col.addClass("col");
            col.text("No Results");
            noResults.append(col);
            var searchAgain = $("<div>");
            searchAgain.addClass("row new-search");
            var colTwo = $("<div>");
            colTwo.addClass("col");
            var searchAgainButton = $("<button>");
            searchAgainButton.addClass("pure-button pure-button-primary search-again");
            searchAgainButton.text("Search Again");
            colTwo.append(searchAgainButton);
            searchAgain.append(colTwo);
            resultsPage.append(noResults, searchAgain);
            return;
        }

        // Loop through the results in response
        for (var i = 0; i < response.meals.length; i++) {
            // Create new cards for each result
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

            // Create arrays to hold ingredients and ingredient amounts from api
            var ingArray = [];
            var amtArray = [];

            // Loop through the api entries and find igredients and measures
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

            // Create ingredient list items from the ingredient and amount arrays
            for (var k = 0; k < ingArray.length; k++) {
                var li = $("<li>");
                if (amtArray[k] === undefined) {
                    amtArray.push("");
                }
                li.text(ingArray[k] + " : " + amtArray[k]);
                ingredients.append(li);
            }

            // Set card elements
            var line = $("<hr>");
            var lineTwo = $("<hr>");
            instructions.text(response.meals[i].strInstructions);
            image.attr("src", response.meals[i].strMealThumb);
            cardTitle.text(response.meals[i].strMeal);

            // Append card items
            cardBody.append(cardTitle, line, ingLabel, ingredients, lineTwo, instButton, instructions, cardButton);
            card.append(image, cardBody);

            // Hide instructions and ingredients as dropdowns
            instructions.hide();
            ingredients.hide();
            instructions.attr("visible", "false");
            ingredients.attr("visible", "false");

            // Append rows and cols with cards to results page
            var row = $("<div>");
            row.addClass("row result");
            var col = $("<div>");
            col.addClass("col");
            col.append(card);
            if (type === "pair") {
                $(".results").append(col);
            }
            else {
                row.append(col);
                resultsPage.append(row);
            }
        }
    });
}

// Function to call cocktailDB api 
function callCocktail(queryURL, type) {

    // AJAX call based on given queryURL
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        // If no results come up, show "No Results" and create Search Again button
        if (response.drinks === null) {
            var noResults = $("<div>");
            noResults.addClass("row no-results");
            var col = $("<div>");
            col.addClass("col");
            col.text("No Results");
            noResults.append(col);
            var searchAgain = $("<div>");
            searchAgain.addClass("row new-search");
            var colTwo = $("<div>");
            colTwo.addClass("col");
            var searchAgainButton = $("<button>");
            searchAgainButton.addClass("pure-button pure-button-primary search-again");
            searchAgainButton.text("Search Again");
            colTwo.append(searchAgainButton);
            searchAgain.append(colTwo);
            resultsPage.append(noResults, searchAgain);
            return;
        }

        // Loop through results in response
        for (var i = 0; i < response.drinks.length; i++) {
            // Create cards for each result
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

            // Create arrays to store ingredients and ingredient amounts
            var ingArray = [];
            var amtArray = [];

            // Loop through all response entries to find ingredients and measures
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

            // Create ingredient list items
            for (var k = 0; k < ingArray.length; k++) {
                var li = $("<li>");
                if (amtArray[k] === undefined) {
                    amtArray.push("");
                }
                li.text(ingArray[k] + " : " + amtArray[k]);
                ingredients.append(li);
            }

            // Create the rest of the card elements
            var line = $("<hr>");
            var lineTwo = $("<hr>");
            instructions.text(response.drinks[i].strInstructions);
            image.attr("src", response.drinks[i].strDrinkThumb);
            cardTitle.text(response.drinks[i].strDrink);

            // Append elements to card
            cardBody.append(cardTitle, line, ingLabel, ingredients, lineTwo, instButton, instructions, cardButton);
            card.append(image, cardBody);

            // Hide instructions and ingredients as drop-downs
            instructions.hide();
            ingredients.hide();
            instructions.attr("visible", "false");
            ingredients.attr("visible", "false");

            // Append new rows and cols with card to results page
            var row = $("<div>");
            row.addClass("row result");
            var col = $("<div>");
            col.addClass("col");
            col.append(card);
            if (type === "pair") {
                $(".results").append(col);
            }
            else {
                row.append(col);
                resultsPage.append(row);
            }
        }
    });
}

// Event listener for home page cocktail div
$("#cocktails").on("click", function () {
    // Show search page and set header to appropriate search type
    indexPage.hide();
    searchPage.show();
    name = $("#cocktails").attr("name");
    var header = $("#header");
    header.text(name + " Recipes");
});

// Event listener for home page meal div
$("#meals").on("click", function () {
    // Show search page and set header to appropriate search type
    indexPage.hide();
    searchPage.show();
    name = $("#meals").attr("name");
    var header = $("#header");
    header.text(name + " Recipes");
});

// Event listener for when home page random pair button is clicked
$(".random-pair").on("click", function () {
    // Clear any previous results and show results page
    $(".no-results").remove();
    $(".new-search").remove();
    $(".results").remove();
    indexPage.hide();
    $(".result").empty();
    resultsPage.show();
    var row = $("<div>");
    row.addClass("row results");
    resultsPage.append(row);
    // Call functions that contain AJAX and send random api urls
    var mealURL = "https://www.themealdb.com/api/json/v1/1/random.php";
    var cocktailURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
    callMeal(mealURL, "pair");
    callCocktail(cocktailURL, "pair");
});

// Show results page and give random recipe based on cocktail or meal selection
$(".random-single").on("click", function () {
    $(".no-results").remove();
    $(".new-search").remove();
    $(".results").remove();
    searchPage.hide();
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

// Upon search button clicked, prevent page load, show results page, and use appropriate API to run call function
$("#search-btn").on("click", function (event) {
    event.preventDefault();
    $(".no-results").remove();
    $(".new-search").remove();
    $(".results").remove();
    searchPage.hide();
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

// Changing display of application sections based on where click happens
$(".navbar-brand").on("click", function () {
    searchPage.hide();
    resultsPage.hide();
    $(".saved-page").hide();
    $(".index-page").show();
});

$(".home").on("click", function () {
    $(".search-page").hide();
    $(".results-page").hide();
    $(".saved-page").hide();
    $(".index-page").show();
});

$(".saved").on("click", function () {
    $(".search-page").hide();
    $(".results-page").hide();
    $(".index-page").hide();
    $(".saved-page").show();
});

// Toggle instructions contents
$(document).on("click", ".instruction", function () {
    var instructions = $(this).siblings(".instructions");
    if (instructions.attr("visible") === "false") {
        instructions.show();
        instructions.attr("visible", "true");
    }
    else {
        instructions.hide();
        instructions.attr("visible", "false");
    }
});

// Toggle ingredient list
$(document).on("click", ".ingredient", function () {
    var ingredients = $(this).siblings(".ingredients");
    if (ingredients.attr("visible") === "false") {
        ingredients.show();
        ingredients.attr("visible", "true");
    }
    else {
        ingredients.hide();
        ingredients.attr("visible", "false");
    }
});

// If not already saved, save the recipe making an array to store name, ingredients, instructions, and image 
$(document).on("click", ".save-recipe", function () {
    var body = $(this).parent();
    if (!$(this).siblings(".confirm").text().includes("Saved")) {
        var confirmation = $("<div>");
        confirmation.addClass("confirm");
        var line = $("<hr>");
        confirmation.text("Saved!");
        body.append(line, confirmation);
        var recipe = {
            name: body.children(".card-title").text(),
            ingredients: [],
            instructions: body.children(".instructions").text(),
            image: body.siblings(".card-img-top").attr("src")
        };
        $("li").each(function () {
            recipe.ingredients.push($(this).text());
        });
        saved.push(recipe);
        localStorage.setItem("saved", JSON.stringify(saved));
        createSaved(count);
        count++;
    }
});

// Clicking on "this" delete button decreses the count var and takes this 1 recipe out of the array
$(document).on("click", ".delete-recipe", function () {
    count--;
    var body = $(this).parent();
    for (var i = 0; i < saved.length; i++) {
        if (saved[i].name === body.children(".card-title").text()) {
            saved.splice(i, 1);
        }
    }
    if (saved.length === 0) {
        noSaved();
        $(".delete-all").remove();
        count = 0;
    }
    localStorage.setItem("saved", JSON.stringify(saved));
    var card = body.parent();
    var col = card.parent();
    col.parent().remove();
});

// Removes all recipes by removing rows, resets "saved" array to null (in local storage as well), deletes "Delete All" button, makes "No Saved Recipes" div, and sets count back to 0
$(document).on("click", ".delete-all", function () {
    $(".all-saved").children(".row").remove();
    saved = [];
    localStorage.setItem("saved", JSON.stringify(saved));
    $(".delete-all").remove();
    noSaved();
    count = 0;
});

// Do a new search if no results are found
$(document).on("click", ".search-again", function () {
    resultsPage.hide();
    searchPage.show();
    $("#search").val('');
    $(this).remove();
});






