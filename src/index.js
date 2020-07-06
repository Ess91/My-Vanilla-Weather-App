function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
if (hours < 10){
    hours = `0${hours}`
}

  let minutes = date.getMinutes();
  if (minutes < 10) {
      minutes = `0${minutes}`
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[date.getDay()];
  return `${day}, ${hours}:${minutes}`;
}

function displayTemperature(response) {
  //console.log(response.data);
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
}

let apiKey = "c788fbd12920cbf73a67468fe8b0facb";

let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=${apiKey}&units=metric`;

//console.log(apiUrl);

axios.get(apiUrl).then(displayTemperature);