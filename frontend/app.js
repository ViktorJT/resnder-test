let modal
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchBtn')
    const cityButtons = document.querySelectorAll('.city-btn')
    const settingsButton = document.getElementById('settingsBtn')
    const saveSettingsButton = document.getElementById('saveSettingsBtn')
    modal = document.getElementById('settingsModal')
    const closeModal = document.querySelector('.close')

    searchButton.addEventListener('click', handleSearch)
    cityButtons.forEach((button) => {
        button.addEventListener('click', () => {
            getWeather(button.dataset.city)
            getForecast(button.dataset.city)
            getHistoricalData(button.dataset.city)
        })
    })
    settingsButton.addEventListener('click', openSettings)
    saveSettingsButton.addEventListener('click', saveSettings)
    closeModal.addEventListener('click', closeSettings)

    // Initialize Web Components
    customElements.define('weather-info', WeatherInfo)
    customElements.define('weather-forecast', WeatherForecast)
    customElements.define('historical-weather', HistoricalWeather)
})

let favoriteCities = []
let unit = 'metric'

// Fetch Weather Data
function getWeather(city) {
    const weatherInfoComponent = document.querySelector('weather-info')
    weatherInfoComponent.displayLoading()

    fetchCoordinates(city)
        .then((coords) => fetchWeatherData(coords.lat, coords.lon))
        .then((data) => {
            weatherInfoComponent.displayWeather(data)
            addFavoriteCity(city)
        })
        .catch((error) => {
            weatherInfoComponent.displayError('Failed to fetch weather data.')
        })
}

// Fetch Coordinates for a City Using Open-Meteo Geocoding API
function fetchCoordinates(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch coordinates.')
            }
            return response.json()
        })
        .then((data) => {
            if (data.results && data.results.length > 0) {
                return {
                    lat: data.results[0].latitude,
                    lon: data.results[0].longitude,
                }
            } else {
                throw new Error('City not found.')
            }
        })
}

// Fetch Data from Open-Meteo API
function fetchWeatherData(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`

    return fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response.json()
    })
}

// Fetch and Display 7-Day Forecast
function getForecast(city) {
    const forecastComponent = document.querySelector('weather-forecast')
    forecastComponent.displayLoading()

    fetchCoordinates(city)
        .then((coords) => fetchWeatherData(coords.lat, coords.lon))
        .then((data) => forecastComponent.displayForecast(data))
        .catch((error) =>
            forecastComponent.displayError('Error fetching forecast.')
        )
}

// Fetch and Display Historical Weather Data
function getHistoricalData(city) {
    const historicalWeatherComponent =
        document.querySelector('historical-weather')
    historicalWeatherComponent.displayLoading()

    fetchCoordinates(city)
        .then((coords) => fetchWeatherData(coords.lat, coords.lon))
        .then((data) => {
            const historicalData = data.daily // Mocking historical data
            historicalWeatherComponent.displayHistoricalData(historicalData)
        })
        .catch((error) =>
            historicalWeatherComponent.displayError(
                'Error fetching historical data.'
            )
        )
}

// Manage Favorite Cities
function addFavoriteCity(city) {
    if (!favoriteCities.includes(city)) {
        favoriteCities.push(city)
        updateFavoriteCities()
    }
}

function updateFavoriteCities() {
    const favoriteCitiesList = document.getElementById('favoriteCities')
    favoriteCitiesList.innerHTML = ''
    favoriteCities.forEach((city) => {
        const listItem = document.createElement('li')
        listItem.textContent = city
        listItem.addEventListener('click', () => {
            getWeather(city)
            getForecast(city)
            getHistoricalData(city)
        })
        favoriteCitiesList.appendChild(listItem)
    })
}

// Settings Management
function openSettings() {
    modal.style.display = 'block'
}

function closeSettings() {
    modal.style.display = 'none'
}

function saveSettings() {
    unit = document.getElementById('units').value
    closeSettings()
}

// Custom Web Components

class WeatherInfo extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.innerHTML = `<div id="info"></div>`
    }

    displayLoading() {
        this.shadowRoot.getElementById('info').innerHTML = 'Loading...'
    }

    displayWeather(data) {
        const today = data.daily.temperature_2m_max[0] // Assuming today is the first element
        this.shadowRoot.getElementById('info').innerHTML = `
      <h2>Current Weather</h2>
      <p>Max Temperature: ${today} °C</p>
      <p>Min Temperature: ${data.daily.temperature_2m_min[0]} °C</p>
    `
    }

    displayError(message) {
        this.shadowRoot.getElementById('info').innerHTML =
            `<p class="error">${message}</p>`
    }
}

class WeatherForecast extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.innerHTML = `<ul id="forecastList"></ul>`
    }

    displayLoading() {
        this.shadowRoot.getElementById('forecastList').innerHTML = 'Loading...'
    }

    displayForecast(data) {
        const forecastList = this.shadowRoot.getElementById('forecastList')
        forecastList.innerHTML = ''
        data.daily.temperature_2m_max.forEach((temp, index) => {
            const listItem = document.createElement('li')
            listItem.textContent = `Day ${index + 1}: Max Temp: ${temp} °C, Min Temp: ${data.daily.temperature_2m_min[index]} °C`
            forecastList.appendChild(listItem)
        })
    }

    displayError(message) {
        this.shadowRoot.getElementById('forecastList').innerHTML =
            `<p class="error">${message}</p>`
    }
}

class HistoricalWeather extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.innerHTML = `<div id="historicalData"></div>`
    }

    displayLoading() {
        this.shadowRoot.getElementById('historicalData').innerHTML =
            'Loading...'
    }

    displayHistoricalData(data) {
        const historicalDataDiv =
            this.shadowRoot.getElementById('historicalData')
        historicalDataDiv.innerHTML = '<h3>Historical Weather Data</h3>'
        data.temperature_2m_max.forEach((temp, index) => {
            const div = document.createElement('div')
            div.textContent = `Day ${index + 1}: Max Temp: ${temp} °C, Min Temp: ${data.temperature_2m_min[index]} °C`
            historicalDataDiv.appendChild(div)
        })
    }

    displayError(message) {
        this.shadowRoot.getElementById('historicalData').innerHTML =
            `<p class="error">${message}</p>`
    }
}

// Utility Functions
function handleSearch() {
    const cityInput = document.getElementById('cityInput').value
    if (cityInput) {
        getWeather(cityInput)
        getForecast(cityInput)
        getHistoricalData(cityInput)
    }
}

function displayError(message) {
    const errorDiv = document.createElement('div')
    errorDiv.textContent = message
    document.body.appendChild(errorDiv)
}

function displayLoading() {
    const loadingDiv = document.createElement('div')
    loadingDiv.textContent = 'Loading...'
    document.body.appendChild(loadingDiv)
}
