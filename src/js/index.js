import { formatDate } from "date-fns/format";
import "../css/style.css";
import lookupIcon from "./lookupIcon";
import { format, isThisHour } from "date-fns";


let currentWeather;
let forecastWeather;
let in_kph = true;
let in_cel = true;

const searchEl = document.getElementById('search');
const searchSuggestionContainer = document.querySelector('.search-suggestion');
const generalWeatherContainer = document.querySelector('.general-weather-container');
const hourlyCardsContainer = document.querySelector('.hourly-cards-container');
const weeklyCardContainer = document.querySelector('.week-cards-container')
const settingLogoContainer = document.querySelector('.setting-logo-container');
const tempunitSetting = document.querySelector('.temp-unit')
const speedunitSetting = document.querySelector('.speed-unit')
const settingSuggestionContainer = document.querySelector('.settings-suggestion');



settingLogoContainer.addEventListener('click', () => {

})


navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude: lat, longitude: lon } = position.coords;
    const locationResult = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const locationData = await locationResult.json();

    const city = locationData.address.city;

    searchEl.value = city;

    const { current, forecast } = await getWeatherData(city);

    currentWeather = current;
    forecastWeather = forecast;
    generalWeatherContainer.innerHTML = '';
    renderHeadline(current, forecast, in_cel, in_kph);
    renderGeneralDetail(current, forecast, in_cel, in_kph);
    renderHourlyForecast(forecast, in_cel, in_kph);
    renderWeeklyForecast(forecast, in_cel, in_kph);
})

searchEl.addEventListener("input", async () => {
    let location = searchEl.value.toLowerCase();
    if (!location) return;
    const searchResult = (await fetch(`https://api.weatherapi.com/v1/search.json?key=a10385320a3445488d264307241406&q=${location}`, { mode: "cors", }));
    const data = await searchResult.json();

    renderSuggestion(data);
})

function renderSuggestion(locations) {
    let markup = locations.map(location => {
        return `<div class="suggested-location">${location.name}, ${location.country}</div>`;
    }).join('');
    searchSuggestionContainer.innerHTML = '';
    searchSuggestionContainer.insertAdjacentHTML('beforeend', markup);
}

searchSuggestionContainer.addEventListener('click', async (e) => {
    searchSuggestionContainer.innerHTML = '';
    const { current, forecast } = await getWeatherData(e.target.textContent);
    searchEl.value = e.target.textContent;
    generalWeatherContainer.innerHTML = '';
    currentWeather = current;
    forecastWeather = forecast;
    renderHeadline(current, forecast, in_cel, in_kph);
    renderGeneralDetail(current, forecast, in_cel, in_kph);
    renderHourlyForecast(forecast, in_cel, in_kph);
    renderWeeklyForecast(forecast, in_cel, in_kph);

})

async function getWeatherData(location) {

    const forecast = (await fetch(`https://api.weatherapi.com/v1/forecast.json?key=a10385320a3445488d264307241406&q=${location}&days=3`, { mode: "cors", }));

    const dataForecast = await forecast.json();
    return dataForecast;
}

function renderHeadline(current, forecast, inCel, inKph) {

    console.log(current, forecast);
    generalWeatherContainer.innerHTML = '';
    generalWeatherContainer.insertAdjacentHTML('beforeend', `<div class="weather-headline">
    <div class="main-detail">
      <img
        src="${lookupIcon(current.condition.code, current.is_day)}"
        class="weather-main-icon"
        alt=""
      />
      <div class="weather-temp-title">
        <div class="temp">${inCel ? current.temp_c : current.temp_f}&deg;</div>
        <div class="title">${current.condition.text}</div>
      </div>
    </div>
    <div class="min-max-detail">
      <div class="min-temp">
        <ion-icon name="arrow-down-sharp"></ion-icon>${inCel ? forecast.forecastday[0].day.mintemp_c : forecast.forecastday[0].day.mintemp_f}&deg;
      </div>
      <div class="max-temp">
        <div>
          <ion-icon name="arrow-up-sharp"></ion-icon>
          ${inCel ? forecast.forecastday[0].day.maxtemp_c : forecast.forecastday[0].day.maxtemp_f}&deg;
        </div>
        <p class="feel-temp">Feels like ${inCel ? current.feelslike_c : current.feelslike_f}&deg;</p>
      </div>
    </div>
  </div>`)
}

function renderGeneralDetail(current, forecast, inCel, inKph) {
    generalWeatherContainer.insertAdjacentHTML('beforeend', `<div class="weather-details">
    <div class="weather-details-card">
      <div class="icon-left">
        <svg
          color="#83b4cf"
          fill="currentColor"
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3c3.17 0 4.97 2.1 5.23 4.63h.08a3.69 3.69 0 110 7.37h-.85a.75.75 0 01-.09.17l-1 1.5a.75.75 0 01-1.24-.84l.56-.83h-2.23a.75.75 0 01-.09.17l-1 1.5a.75.75 0 11-1.24-.84l.56-.83H8.46a.75.75 0 01-.09.17l-1 1.5a.75.75 0 01-1.24-.84l.56-.83a3.69 3.69 0 110-7.37h.08A4.95 4.95 0 0112 3zM7.13 18.83a.75.75 0 101.24.84l1-1.5a.75.75 0 10-1.24-.84l-1 1.5zm4.2 1.04a.75.75 0 01-.2-1.04l1-1.5a.75.75 0 111.24.84l-1 1.5a.75.75 0 01-1.04.2z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <div class="card-details">
        <p class="small-text light-text">Chance of rain</p>
        <p class="card-text dark-text" id="chance-of-rain">${forecast.forecastday[0].day.daily_chance_of_rain}%</p>
      </div>
    </div>
    <div class="weather-details-card">
      <div class="icon-left">
        <svg
          class="wind-icon"
          color="#969eb0"
          fill="currentColor"
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style="transform: rotate(166deg)"
        >
          <path
            d="M12 22a10 10 0 100-20 10 10 0 000 20zm2.5-13.25a.75.75 0 011.5 0v6.5c0 .41-.34.75-.75.75h-6.5a.75.75 0 010-1.5h4.74L8.22 9.28a.75.75 0 011.06-1.06l5.22 5.17V8.75z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <div class="card-details">
        <p class="small-text light-text">Wind</p>
        <p class="card-text dark-text" id="wind">${inKph ? current.wind_kph + " kph" : current.wind_mph + " mph"} </p>
      </div>
    </div>
    <div class="weather-details-card">
      <div class="icon-left">
        <svg
          color="#ffc755"
          fill="currentColor"
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2c.41 0 .75.34.75.75v.5a.75.75 0 01-1.5 0v-.5c0-.41.34-.75.75-.75zM8 9a4 4 0 118 0 4 4 0 01-8 0zm4.75 5.75a.75.75 0 00-1.5 0v.5a.75.75 0 001.5 0v-.5zM5.75 8a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM17 8.75c0-.41.34-.75.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM6.72 5.78a.75.75 0 001.06-1.06l-.5-.5a.75.75 0 00-1.06 1.06l.5.5zm1.06 6.44a.75.75 0 00-1.06 0l-.5.5a.75.75 0 101.06 1.06l.5-.5c.3-.3.3-.77 0-1.06zm9.5-6.44a.75.75 0 11-1.06-1.06l.5-.5a.75.75 0 111.06 1.06l-.5.5zm-1.06 6.44c.3-.3.77-.3 1.06 0l.5.5a.75.75 0 11-1.06 1.06l-.5-.5a.75.75 0 010-1.06zm-13 9.62c-.33.25-.8.2-1.06-.12-.4-.51.12-1.06.12-1.06h.02a3.49 3.49 0 01.18-.15l.54-.36A16.78 16.78 0 0112 17.5a16.78 16.78 0 019.7 3.15l.01.01a.75.75 0 01-.93 1.18l-.03-.03a5.63 5.63 0 00-.58-.4A15.28 15.28 0 0012 19a15.28 15.28 0 00-8.75 2.81l-.03.02z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <div class="card-details">
        <p class="small-text light-text">Sunrise</p>
        <p class="card-text dark-text" id="sunrise">${forecast.forecastday[0].astro.sunrise}</p>
      </div>
    </div>
    <div class="weather-details-card">
      <div class="icon-left">
        <svg
          color="#5a7ec6"
          fill="currentColor"
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.75 2.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zm6.28 2.22c.3.3.3.77 0 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06c.3-.3.77-.3 1.06 0zM6.59 13a5.5 5.5 0 1110.82 0h3.84a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5h3.84zm.16 3a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H6.75zm4 3a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5zM4.97 4.97c.3-.3.77-.3 1.06 0l1.06 1.06a.75.75 0 11-1.06 1.06L4.97 6.03a.75.75 0 010-1.06z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <div class="card-details">
        <p class="small-text light-text">Sunset</p>
        <p class="card-text dark-text" id="sunset">${forecast.forecastday[0].astro.sunset}</p>
      </div>
    </div>
    <div class="weather-details-card">
      <div class="icon-left">
        <svg
          color="#fba087"
          fill="currentColor"
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2c.41 0 .75.34.75.75v1.5a.75.75 0 01-1.5 0v-1.5c0-.41.34-.75.75-.75zm5 10a5 5 0 11-10 0 5 5 0 0110 0zm4.25.75a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM12 19c.41 0 .75.34.75.75v1.5a.75.75 0 01-1.5 0v-1.5c0-.41.34-.75.75-.75zm-7.75-6.25a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zm-.03-8.53c.3-.3.77-.3 1.06 0l1.5 1.5a.75.75 0 01-1.06 1.06l-1.5-1.5a.75.75 0 010-1.06zm1.06 15.56a.75.75 0 11-1.06-1.06l1.5-1.5a.75.75 0 111.06 1.06l-1.5 1.5zm14.5-15.56a.75.75 0 00-1.06 0l-1.5 1.5a.75.75 0 001.06 1.06l1.5-1.5c.3-.3.3-.77 0-1.06zm-1.06 15.56a.75.75 0 101.06-1.06l-1.5-1.5a.75.75 0 10-1.06 1.06l1.5 1.5z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <div class="card-details">
        <p class="small-text light-text">UV Index</p>
        <p class="card-text dark-text" id="uv-index">${current.uv}</p>
      </div>
    </div>
    <div class="weather-details-card">
      <div class="icon-left">
        <svg
          color="#db8cea"
          fill="currentColor"
          ="aria-hidden"
          ="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 5.5h7a1 1 0 011 .88v7.12a1 1 0 01-2 .12V8.9l-7.3 7.3a1 1 0 01-1.31.08l-.1-.08L9 13.9l-5.28 5.3a1 1 0 01-1.5-1.32l.08-.1 6-6a1 1 0 011.32-.08l.1.08L12 14.1l6.58-6.59H14a1 1 0 01-.99-.88V6.5a1 1 0 01.88-1H21h-7z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <div class="card-details">
        <p class="small-text light-text">Pressure</p>
        <p class="card-text dark-text" id="pressure">${current.pressure_mb} mb</p>
      </div>
    </div>
    <div class="weather-details-card">
      <div class="icon-left">
        <svg
          color="#6bbbea"
          fill="currentColor"
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.47 2.22c.3-.3.77-.3 1.06 0 .4.4 2 2.13 3.5 4.36C17.5 8.78 19 11.63 19 14.25c0 2.52-.75 4.48-2.04 5.8A6.78 6.78 0 0112 22a6.78 6.78 0 01-4.96-1.94C5.74 18.73 5 16.77 5 14.25c0-2.62 1.5-5.46 2.97-7.67 1.5-2.23 3.1-3.96 3.5-4.36z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <div class="card-details">
        <p class="small-text light-text">Humidity</p>
        <p class="card-text dark-text" id="humidity">${current.humidity}%</p>
      </div>
    </div>
    <div class="weather-details-card">
      <div class="icon-left">
        <svg
          color="#78e07d"
          fill="currentColor"
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.75 9.5a3.25 3.25 0 01.18 6.49h-.2l-.11.01h-.8c.12.31.18.65.18 1 0 1.66-1.26 3-2.93 3-1.3 0-2.23-.63-2.69-1.63a1 1 0 011.77-.93l.1.2c.14.23.37.36.82.36.53 0 .93-.42.93-1a1 1 0 00-.9-1H3a1 1 0 01-.12-2h15.87l.13-.01a1.25 1.25 0 10-1.26-1.8l-.1.23a1 1 0 01-1.83-.8 3.25 3.25 0 013.06-2.13zm-7 2.5H3a1 1 0 01-.12-2h8.87A2.25 2.25 0 109.5 7.75a1 1 0 01-2 0 4.25 4.25 0 114.48 4.24l-.23.01H3h8.75z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <div class="card-details">
        <p class="small-text light-text">Gusts</p>
        <p class="card-text dark-text" id="gusts">${inKph ? current.gust_kph + " kph" : current.gust_mph + " mph"}</p>
      </div>
    </div>
  </div>`)
}

function gethourlyForecast(forecast) {
    let count = 0;
    let next8Hours = forecast.forecastday[0].hour;

    next8Hours = next8Hours.filter((hour) => {
        if (isThisHour(hour.time)) {
            count = 1;
        }
        if (count >= 1 && count <= 8) {
            count++;
            return hour;
        }
    })
    return next8Hours;
}

function renderHourlyForecast(forecast) {

    const next8hours = gethourlyForecast(forecast);

    hourlyCardsContainer.innerHTML = '';
    next8hours.forEach(hour => {
        hourlyCardsContainer.insertAdjacentHTML('beforeend', `<div class="hourly-card">
        <span class="hour-text small-text dark-text">${format(hour.time, "p")}</span
        ><img class="weather-icon" src="${lookupIcon(hour.condition.code, hour.is_day)}" />
        <p class="temp-text dark-text"></p>
      </div>`)
    })


}

function renderWeeklyForecast(forecast, inCel, inKph) {
    weeklyCardContainer.innerHTML = '';
    forecast.forecastday.forEach(day => {
        weeklyCardContainer.insertAdjacentHTML('beforeend', `          <div class="week-card">
        <div class="icon-container">
          <img
            class="week-brief-card-icon"
            src="${lookupIcon(day.day.condition.code, 1)}"
    />
        </div >
        <div class="week-details-container">
            <div class="date">
                <p class="day-name">${formatDate(day.date, "eee")}</p>
                <p class="date">${formatDate(day.date, "d MMM")}</p>
            </div>
            <div class="temp-details">
                <div class="min">
                    <p class="temp">${inCel ? day.day.mintemp_c : day.day.mintemp_f}&deg;</p>
                    <p class="temp-label">min</p>
                </div>
                <div class="max">
                    <p class="temp">${inCel ? day.day.maxtemp_c : day.day.maxtemp_f}&deg;</p>
                    <p class="temp-label">max</p>
                </div>
            </div>
        </div>
      </div > `)
    })
}

function initSettings() {

    settingLogoContainer.addEventListener('click', () => {
        settingSuggestionContainer.classList.toggle('hide');
    })

    tempunitSetting.addEventListener('click', () => {
        settingSuggestionContainer.classList.toggle('hide');
        in_cel = !in_cel;

        in_cel ? tempunitSetting.textContent = "Celsius" : tempunitSetting.textContent = "Fahrenheit";

        renderHeadline(currentWeather, forecastWeather, in_cel, in_kph);
        renderGeneralDetail(currentWeather, forecastWeather, in_cel, in_kph);
        renderHourlyForecast(forecastWeather, in_cel, in_kph);
        renderWeeklyForecast(forecastWeather, in_cel, in_kph);
    })
    speedunitSetting.addEventListener('click', () => {
        settingSuggestionContainer.classList.toggle('hide');
        in_kph = !in_kph;

        in_kph ? speedunitSetting.textContent = "kph" : speedunitSetting.textContent = "mph";

        renderHeadline(currentWeather, forecastWeather, in_cel, in_kph);
        renderGeneralDetail(currentWeather, forecastWeather, in_cel, in_kph);
        renderHourlyForecast(forecastWeather, in_cel, in_kph);
        renderWeeklyForecast(forecastWeather, in_cel, in_kph);
    })
}

initSettings();