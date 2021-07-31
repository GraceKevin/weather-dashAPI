// weather API   -      api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}  
//  e67b161ec4b0a06c7be80ec0f1213f7c

// Variables 
var cityFormElement = document.querySelector("#city-form");
var cityInputElement = document.querySelector("#cityname");
var cityContainerElement = document.querySelector("#city-container");
var  citySearchTerm = document.querySelector("#city-search-term");

var currentDate = function() {
    var currentDay = moment().format("dddd, MMMM Do YYYY");
    return currentDay;
}

// Functions
var formSubmitHandler = function(event) {
    event.preventDefault();

    // GET VALUE FROM INPUT ELEMENT
    var cityname = cityInputElement.value.trim();

    if (cityname) {
        getCityName(cityname);

        // CLEAR OLD CONTENT
        cityContainerElement.textContent = "";
        cityInputElement.value = "";
    } 
    else {
        alert("Please enter valid city name");
    }
};

var getCityName = function (city) {
    // FORMAT WEATHER API
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + "e67b161ec4b0a06c7be80ec0f1213f7c"

    cityInputElement.innerHTML = city + ' ' + currentDate();
    console.log(apiURL);
 
    // FETCH REQUEST
    fetch(apiURL)
    .then(function(response) {
        if(response.ok) {
            console.log(response);
            response.json().then(function(data) {
                console.log(data);
                displayCity(data, user);
            });
        }
        else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to locate city");
    });
};