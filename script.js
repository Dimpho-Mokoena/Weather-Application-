function getWeatherDataByCity(city) {
  let apiKey = "d669931a5f6cd86bcccf4c1c626f6bc7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

function getWeatherDataByCoordinates(latitude, longitude) {
  let apiKey = "d669931a5f6cd86bcccf4c1c626f6bc7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

function getForecastDataByCity(city) {
  let apiKey = "d669931a5f6cd86bcccf4c1c626f6bc7";
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  axios.get(forecastApiUrl).then(displayWeatherForecast);
}

function displayWeatherCondition(response) {
  let temperatureCelsius = Math.round(response.data.main.temp);
  let temperatureFahrenheit = Math.round((temperatureCelsius * 9) / 5 + 32);
  let humidity = response.data.main.humidity;
  let pressure = response.data.main.pressure;
  let windSpeed = response.data.wind.speed;
  let city = response.data.name;
  let weatherDescription = response.data.weather[0].description;
  let weatherIcon = response.data.weather[0].icon;

  document.getElementById("temp-value").textContent = temperatureCelsius;
  document.getElementById("humidity-value").textContent = humidity + "%";
  document.getElementById("pressure-value").textContent = pressure + " hPa";
  document.getElementById("wind-speed-value").textContent = windSpeed + " m/s";
  document.getElementById("city-name").textContent = city;
  document.getElementById("weather-description").textContent = weatherDescription;

  let weatherIconElement = document.getElementById("weather-icon");
  weatherIconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weatherIcon}.png`
  );
  weatherIconElement.setAttribute("alt", weatherDescription);

  let convertLink = document.getElementById("convert-link");
  convertLink.addEventListener("click", function () {
    let tempValue = document.getElementById("temp-value");
    if (convertLink.textContent === "°F") {
      tempValue.textContent = temperatureFahrenheit;
      convertLink.textContent = "°C";
    } else {
      tempValue.textContent = temperatureCelsius;
      convertLink.textContent = "°F";
    }
  });
}

function displayWeatherForecast(response) {
  let forecastData = response.data.list;
  let forecastContainer = document.getElementById("weather-forecast");
  forecastContainer.innerHTML = "";

  let futureDates = [];

  for (let i = 0; i < 5; i++) {
    let forecastItem = forecastData[i];
    let forecastDate = new Date(forecastItem.dt * 1000); 
    futureDates.push(forecastDate);
    let dayOfWeek = forecastDate.toLocaleDateString(undefined, { weekday: "short" });
    let iconCode = forecastItem.weather[0].icon;
    let maxTemp = Math.round(forecastItem.main.temp_max);
    let minTemp = Math.round(forecastItem.main.temp_min);

    let forecastHTML = `
      <div class="weather-forecast-item">
        <div class="day">${dayOfWeek}</div>
        <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="weather-icon" class="w-icon">
        <div class="temp">High - ${maxTemp}&#176; C</div>
        <div class="temp">Low - ${minTemp}&#176; C</div>
      </div>
    `;

    forecastContainer.innerHTML += forecastHTML;
  }

  let forecastItems = forecastContainer.getElementsByClassName("weather-forecast-item");
  for (let i = 0; i < forecastItems.length; i++) {
    let forecastItem = forecastItems[i];
    let dateElement = document.createElement("div");
    dateElement.className = "date";
    dateElement.textContent = futureDates[i].toLocaleDateString(undefined, {
      month: "short",
      day: "numeric"
    });
    forecastItem.insertBefore(dateElement, forecastItem.firstChild);
  }
}

function searchCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  let city = searchInput.value.trim();
  let cityNameElement = document.querySelector("#city-name");
  cityNameElement.textContent = city;
  getWeatherDataByCity(city);
  getForecastDataByCity(city);
  searchInput.value = "";
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError);
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

function handleGeolocationSuccess(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  getWeatherDataByCoordinates(latitude, longitude);
}

function handleGeolocationError(error) {
  console.error("Error getting current location:", error);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

let currentLocationBtn = document.querySelector("#current-location-button");
currentLocationBtn.addEventListener("click", getCurrentLocation);
function updateTime() {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let amPm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  document.getElementById("time").textContent = hours + ":" + minutes + ":" + seconds;
  document.getElementById("am-pm").textContent = amPm;

  let options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  let date = now.toLocaleDateString(undefined, options);
  document.getElementById("date").textContent = date;
}

setInterval(updateTime, 1000);
updateTime();

