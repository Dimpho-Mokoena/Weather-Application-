document.getElementById("search-form").addEventListener("submit", function (event) {
  event.preventDefault();
  let searchInput = document.getElementById("search-input");
  let city = searchInput.value;
  getWeatherDataByCity(city);
  searchInput.value = "";
});

function getWeatherDataByCity(city) {
  let apiKey = "d669931a5f6cd86bcccf4c1c626f6bc7";
  let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  axios.all([axios.get(currentWeatherUrl), axios.get(forecastUrl)])
    .then(axios.spread(function (currentWeatherResponse, forecastResponse) {
      displayWeatherCondition(currentWeatherResponse.data);
      displayForecast(forecastResponse.data);
    }))
    .catch(function (error) {
      console.log(error);
    });
}

function displayWeatherCondition(data) {
  let temperatureCelsius = Math.round(data.main.temp);
  let temperatureFahrenheit = Math.round((temperatureCelsius * 9) / 5 + 32);
  let humidity = data.main.humidity;
  let precipitation = data.rain ? data.rain["1h"] : "N/A"; // Assuming precipitation is in "rain" property
  let windSpeed = data.wind.speed;
  let city = data.name;
  let weatherDescription = data.weather[0].description;
  let weatherIcon = data.weather[0].icon;

  document.getElementById("temp-value").textContent = temperatureCelsius;
  document.getElementById("humidity-value").textContent = humidity + "%";
  document.getElementById("precipitation-value").textContent = precipitation + " mm";
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

function displayForecast(data) {
  let forecastContainer = document.getElementById("weather-forecast");
  forecastContainer.innerHTML = "";

  let forecastData = data.list;
  let forecastDays = {};

  for (let i = 0; i < forecastData.length; i++) {
    let forecast = forecastData[i];
    let forecastDate = new Date(forecast.dt * 1000);
    let forecastDay = forecastDate.getDate();
    let forecastTemperature = Math.round(forecast.main.temp);
    let forecastDescription = forecast.weather[0].description;
    let forecastIcon = forecast.weather[0].icon;

    if (!forecastDays[forecastDay]) {
      forecastDays[forecastDay] = {
        date: forecastDate,
        temperature: forecastTemperature,
        description: forecastDescription,
        icon: forecastIcon,
      };
    }
  }

  let days = Object.values(forecastDays);
  for (let i = 0; i < days.length; i++) {
    let forecast = days[i];

    let forecastItem = document.createElement("div");
    forecastItem.classList.add("forecast-item");

    let forecastDateElement = document.createElement("div");
    forecastDateElement.classList.add("forecast-date");
    forecastDateElement.textContent = formatDate(forecast.date);
    forecastItem.appendChild(forecastDateElement);

    let forecastIconElement = document.createElement("img");
    forecastIconElement.classList.add("forecast-icon");
    forecastIconElement.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${forecast.icon}.png`
    );
    forecastIconElement.setAttribute("alt", forecast.description);
    forecastItem.appendChild(forecastIconElement);

    let forecastTemperatureElement = document.createElement("div");
    forecastTemperatureElement.classList.add("forecast-temperature");
    forecastTemperatureElement.textContent = forecast.temperature + "°C";
    forecastItem.appendChild(forecastTemperatureElement);

    let forecastDescriptionElement = document.createElement("div");
    forecastDescriptionElement.classList.add("forecast-description");
    forecastDescriptionElement.textContent = forecast.description;
    forecastItem.appendChild(forecastDescriptionElement);

    forecastContainer.appendChild(forecastItem);
  }
}

function formatDate(date) {
  let options = { weekday: "short", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}
