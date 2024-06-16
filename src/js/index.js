import "../css/style.css";


const searchEl = document.getElementById('search');
const searchSuggestionContainer = document.querySelector('.search-suggestion');


navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude: lat, longitude: lon } = position.coords;
    const locationResult = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const locationData = await locationResult.json();

    const city = locationData.address.city;

    const forecast = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=a10385320a3445488d264307241406&q=${city}&days=3`, { mode: "cors" });
    const data = await forecast.json();
    console.log(data);
})

searchEl.addEventListener("input", async () => {
    let location = searchEl.value.toLowerCase();
    if (!location) return;
    const searchResult = (await fetch(`https://api.weatherapi.com/v1/search.json?key=a10385320a3445488d264307241406&q=${location}`, { mode: "cors", }));
    const data = await searchResult.json();

    renderSuggestion(data);
})

function renderSuggestion(locations) {
    console.log(locations);
    let markup = locations.map(location => {
        return `<div class="suggested-location">${location.name}, ${location.country}</div>`;
    }).join('');
    searchSuggestionContainer.innerHTML = '';
    searchSuggestionContainer.insertAdjacentHTML('beforeend', markup);
}

searchSuggestionContainer.addEventListener('click', (e) => {
    console.log(e.target);
    searchSuggestionContainer.innerHTML = '';
    getWeatherData(e.target.textContent);
})

async function getWeatherData(location) {

    const forecast = (await fetch(`https://api.weatherapi.com/v1/forecast.json?key=a10385320a3445488d264307241406&q=${location}&days=3`, { mode: "cors", }));

    const dataForecast = await forecast.json();
    console.log(dataForecast);

}