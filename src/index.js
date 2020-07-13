let apiKey = "c788fbd12920cbf73a67468fe8b0facb";

//Date and Time

function formatDate(timestamp) {
  let date = new Date(timestamp);

  let now = date.getDate(); //current date i.e. 8th

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[date.getMonth()];

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${now} ${month}, ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function formatWeekDay(timestamp) {
  let dateTime = new Date(timestamp);
  let days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  let currentDay = days[dateTime.getDay()];
  return `${currentDay}`;
}

// Weather Information

function displayTemperature(response) {
  //console.log(response.data);
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let feelElement = document.querySelector("#feel");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = Math.round(response.data.main.temp);

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  //console.log(response.data.main.feels_like);
  feelElement.innerHTML = Math.round(response.data.main.feels_like);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  //Daily Forecast
  
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  let apiurl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&
  exclude=current, minutely,hourly&appid=${apiKey}&units=metric`;
  axios.get(apiurl).then(dailyForecast);
}

// Every 3 Hour Forecast

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];

    forecastElement.innerHTML += `
    <div class="col-2">
              <h6>${formatHours(forecast.dt * 1000)}</h6>
              <img src="http://openweathermap.org/img/wn/${
                forecast.weather[0].icon
              }@2x.png" />
            
  
              <div class="weather-advisory-temp">
                <strong id="temp">${Math.round(
                  forecast.main.temp_max
                )}°C</strong> ${Math.round(forecast.main.temp_min)}°C
              </div>
            </div>
    `;
  }
}

//Five Day Forecast

function dailyForecast(response) {
  let dayForecastElement = document.querySelector("#dayForecast");
  dayForecastElement.innerHTML = null;
  let dayForecast = null;

  for (let index = 1; index < 6; index++) {
    dayForecast = response.data.daily[index];
   // console.log(response.data.daily);

    dayMax = `${Math.round(dayForecast.temp.max)}`;
    dayMin = `${Math.round(dayForecast.temp.min)}`;

    dayForecastElement.innerHTML += `
    
    <div class="col">
  <h6>${formatWeekDay(dayForecast.dt * 1000)}</h6>
  <img src="http://openweathermap.org/img/wn/${
    dayForecast.weather[0].icon
  }@2x.png" />
            <p class="forecast-temp"><strong>${dayMax}°C</strong> ${dayMin}°C</p>
            </div>
    `;
  }
}

// Search City

function search(city) {
  let apiKey = "c788fbd12920cbf73a67468fe8b0facb";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);

}

// User Input

function handleSubmit(event) {
  event.preventDefault(); //Prevent page from reloading, have control over it!
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
  // console.log(cityInputElement.value);
}

//GeoLocation

function retrievePosition(position) {
  let apiKey = "c788fbd12920cbf73a67468fe8b0facb";

  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayTemperature);
}

function getCurrentPosition() {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

let present = document.querySelector("#current-btn");
present.addEventListener("click", getCurrentPosition);

// Fahrenheit Link

function showFahTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  // remove the active class to the celsius link
  celsiusLink.classList.remove("active");
  //add the active class to the fahrenheit link
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

// Celsius Link

function showCelTemp(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = celsiusTemperature;
}

search("London");

let celsiusTemperature = null; //global variable

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fah-link");
fahrenheitLink.addEventListener("click", showFahTemp);

let celsiusLink = document.querySelector("#cel-link");
celsiusLink.addEventListener("click", showCelTemp);
