// https://www.youtube.com/watch?v=f__x1VofV2Q //  https://github.com/Tom0901/Weather-App
// 
// file:///Users/Kevin/Desktop/Class-Projects/git-it-done/index.html
// weather API   -      api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}  
//  e67b161ec4b0a06c7be80ec0f1213f7c

// Variables 
var cityFormElement = document.getElementById("city");
var cityInputElement = document.getElementById("cityname");
var temp = document.getElementById("temperature");
var uv = document.getElementById("uvIndex");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var forecastContainer = document.getElementById("forecast-container")
const apiKEY = "e67b161ec4b0a06c7be80ec0f1213f7c";

// Add Function for search on enter key
document.getElementById("cityname")
    .addEventListener("keyup", function(event) {
        event.preventDefault();
        if ( event.keyCode === 13) {
            document.getElementById("searchbtn").click();
        }
});

// Functions

// MOMENT.JS FOR DAILY REFERENCE
var getCurrentDate = function(){
    var currentDay = moment().format('(L)');
    return currentDay;
};

// CITY NAME ENTERED BY USER
var getCityName = function() {
    var location = cityInputElement.value.trim();
    if (location) {
        getCurrentWeather(location);
        cityInputElement.value = '';
    } 
    else {
        alert("Enter a valid city please");
    }
}

// PULL CURRENT DAY WEATHER
var getCurrentWeather = function(city) {
    // SET WEATHER API  FOR CURRENT WEATHER OUTLOOK
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKEY;
    cityFormElement.innerHTML = city + ' ' + getCurrentDate();
    console.log(apiURL);
    // FETCH THE API AGAINST THE 4 DATASETS
    fetch(apiURL)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                temperature.innerHTML = data.main.temp + " F";
                humidity.innerHTML = data.main.humidity;
                wind.innerHTML = data.wind.speed + " MPH";
                var uvData = getUV(data.coord.lat, data.coord.lon);
            });
        }  // UNKNOWN CITY ENTERED
        else {
            alert('Error: ' + response.statusText);
        }
    }) 
    .catch(function(error) {
        alert('Unable to get weather');
    });
    getForecast(city);    
};

// PULL UV DATA WITH LAT/LONG
var getUV = function(latitude, longitude) {
    var pullUV = "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=" + apiKEY + "&lat=" + latitude + "&lon=" + longitude;
    fetch(pullUV)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                resultUv = data[0].value;
                uv.innerHTML = resultUv;
                // SET ALERT VALUES IN BOOTSTRAP
                if (resultUv <= 5) {
                    uv.classList.add("alert")
                    uv.classList.add("alert-success")
                } 
                else if (resultUv > 5 && resultUv <= 9) {
                    uv.classList.add("alert")
                    uv.classList.add("alert-warning")
                } 
                else if (resultUv > 9) {
                    uv.classList.add("alert")
                    uv.classList.add("alert-danger")
                };
            })
        }
    })
};

// PULL FOR 5 DAY FORECAST
var getForecast = function(city) {
    var pullCity = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" + apiKEY + '&q=' + city;
    
    fetch(pullCity)
    .then(function(response) {
        if (response.ok) {

            response.json().then(function(data) {
                console.log(data)
                var dayCount = 1
                for (var i = 6; i < data.list.length; i += 8) {
                    var col = document.createElement('div')
                    col.classList.add("col-2")
                    col.innerHTML = ''
                     var newColumn = document.createElement('div');
                     newColumn.classList.add("col-2");
                     var cardForecast = document.createElement("div")
                     cardForecast.classList.add("card");
                     var cardBody = document.createElement("div")
                     cardBody.classList.add("card-body")
                     var forecastDate = document.createElement("span")
                     forecastDate.classList.add("card-title")
                     forecastDate.innerHTML = moment().add(dayCount, "days").format("M/D/YYYY")
                     var icon = document.createElement("img")
                     icon.src = "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png"
                     var temperatureForecast = document.createElement("p")
                     temperatureForecast.classList.add("card-text")
                     temperatureForecast.innerHTML = data.list[i].main.temp + " F"
                     var humidityForecast = document.createElement("p")
                     humidityForecast.classList.add('card-text')
                     humidityForecast.innerHTML = "Humidity" + data.list[i].main.humidity
                     var windForecast = document.createElement("p")
                     windForecast.classList.add('card-title')
                     windForecast.innerHTML = data.list[i].wind.speed + " MPH";

                     newColumn.innerHTML = "";

                     newColumn.appendChild(cardForecast);
                     cardForecast.appendChild(cardBody);
                     cardBody.appendChild(forecastDate);
                     cardBody.appendChild(icon);
                     cardBody.appendChild(temperatureForecast);
                     cardBody.appendChild(humidityForecast);
                     cardBody.appendChild(windForecast);
                    forecastContainer.appendChild(newColumn);

                    // ADD NUMBER OF DAYS
                    dayCount++;
                    
                }
            })
        } 
        else {
            alert('Error: ' + response.statusText);
        }
    })
    .catch(function(error) {
        alert(error);
    });
}

// REMOVE PRIOR FORECAST DATA
var removeForecast = function() {
    newColumn.removeChild(cardForecast);
    cardForecast.removeChild(cardBody);
    cardBody.removeChild(forecastDate);
    cardBody.removeChild(icon);
    cardBody.removeChild(temperatureForecast);
    cardBody.removeChild(humidityForecast);
    cardBody.removeChild(windForecast);
   forecastContainer.removeChild(newColumn);
}

var searchBtn = document.getElementById("searchbtn");
searchBtn.addEventListener("click", function() {
    var cityInputElement = document.getElementById("cityname");
    var cityElement = {
        cityName: cityInputElement.value
    };
    saveCity(cityElement); 
    getCityName();
    addHistory(cityElement.cityName);

});

// LOCAL STORAGE
var saveCity = function(cityElement) {

    if (localStorage.getItem("cityData") == null) {
        var newArray = [];
        newArray.push(cityElement);
        localStorage.setItem("cityData", JSON.stringify(newArray));
    } 
    else {
        // CHECK THAT ARRAY EXISTS ALREADY
        var currentCityData = JSON.parse(localStorage.getItem("cityData"))
        var cityExists = false;

        for( i = 0; i < currentCityData.length; i++) {
            if (currentCityData[i].cityName == cityElement.cityName) {
                cityExists = true;
            }
        }
        if (!cityExists) {
            currentCityData.push(cityElement);
            localStorage.setItem("cityData", JSON.stringify(currentCityData));
        }
    }
};

// PULL FROM  LOCAL STORAGE
var getCityData = function(){
    var result
    if (localStorage.getItem("cityData") == null) {
        var newArray = [];
        localStorage.setItem("cityData", JSON.stringify(newArray));
        result = newArray;
    } 
    else {
         result = JSON.parse(localStorage.getItem("cityData"))
    }
    return result;
};

var findCity = function() {
    var myCityData = getCityData();
    for( i = 0; i < myCityData.length; i++) {
        priorCity(myCityData[i].cityName);
    }
}

var addHistory = function(cityName) {
    priorCity(cityName);
}

var priorCity = function (cityName) {
    console.log(cityName);
    var newRow = document.createElement('div');
    newRow.classList.add("row");
    var col = document.createElement('div');
    col.classList.add("col");
    var priorCityBtn = document.createElement("button");
    priorCityBtn.classList.add("btn")
    priorCityBtn.classList.add("btn-primary")
    priorCityBtn.classList.add("btn-block")
    priorCityBtn.classList.add("btn-center")
    priorCityBtn.id = "btn" + cityName;
    priorCityBtn.setAttribute("content", "past-city");
    priorCityBtn.setAttribute('class', 'btn-primary');
    priorCityBtn.setAttribute("style", "background-color: grey");
    priorCityBtn.innerHTML = cityName;
    
    console.log(priorCityBtn);
   
    priorCityBtn.addEventListener("click", function(){
        console.log("");
        getCurrentWeather(cityName);
    })
 
    newRow.appendChild(col);
    col.appendChild(priorCityBtn);
    cityContainer.appendChild(newRow);
}