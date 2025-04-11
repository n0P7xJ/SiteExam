const API_KEY = '592025a2fcebc6e60c131c67c33ed889'; // WARNING: Move to backend for production!

let apiCallsLeft = 50;
let sessionStartTime = sessionStorage.getItem('sessionStartTime')
    ? parseInt(sessionStorage.getItem('sessionStartTime'))
    : Date.now();
sessionStorage.setItem('sessionStartTime', sessionStartTime);

// Mock city data (replace with a real dataset or API)
const countryCities = {
    US: ['New York', 'Los Angeles', 'Chicago'],
    GB: ['London', 'Manchester', 'Birmingham'],
    IN: ['Mumbai', 'Delhi', 'Bangalore'],
    UA: ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv', 'Dnipro'] // Added Ukraine
    // Add more countries as needed
};

// DOM elements
const elements = {
    countrySelect: document.getElementById('country-select'),
    citySelect: document.getElementById('city-select'),
    cityInput: document.getElementById('city-input'),
    searchButton: document.getElementById('search-button'),
    weatherInfo: document.querySelector('.weather-info'),
    sessionTime: document.getElementById('session-time'),
    apiCalls: document.getElementById('api-calls-left')
};

// Display error message
function displayError(message) {
    elements.weatherInfo.innerHTML = `
        <p class="error-message" style="color: red;">Error: ${message}</p>
    `;
}

// Timer function
function startSessionTimer() {
    setInterval(() => {
        const timeElapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        const hours = Math.floor(timeElapsed / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((timeElapsed % 3600) / 60).toString().padStart(2, '0');
        const seconds = (timeElapsed % 60).toString().padStart(2, '0');
        elements.sessionTime.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

// API call counter
function updateApiCallsCounter() {
    if (apiCallsLeft <= 0) {
        displayError('API call limit reached!');
        return false;
    }
    apiCallsLeft--;
    elements.apiCalls.textContent = apiCallsLeft;
    return true;
}

// Loading state
function showLoading() {
    elements.weatherInfo.innerHTML = '<p>Loading...</p>';
    elements.searchButton.disabled = true;
}

function hideLoading() {
    elements.searchButton.disabled = false;
}

// Fetch countries
async function loadCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Failed to fetch countries');
        const countries = await response.json();
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common))
            .forEach(country => {
                const option = document.createElement('option');
                option.value = country.cca2;
                option.textContent = country.name.common;
                elements.countrySelect.appendChild(option);
            });
    } catch (error) {
        console.error('Error loading countries:', error);
        displayError('Could not load countries. Please try again later.');
    }
}

// Fetch weather data
async function getWeatherData(city) {
    if (!navigator.onLine) {
        displayError('You are offline. Please check your internet connection.');
        return null;
    }
    if (!updateApiCallsCounter()) {
        return null;
    }
    showLoading();
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        );
        if (!response.ok) {
            throw new Error('City not found or invalid request');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayError(error.message);
        return null;
    } finally {
        hideLoading();
    }
}

// Display weather data
function displayWeather(data) {
    if (!data) return;
    elements.weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

// Load cities for a given country code
function loadCities(countryCode) {
    elements.citySelect.innerHTML = '<option value="">Select City</option>';
    const cities = countryCities[countryCode] || [];
    if (cities.length === 0) {
        displayError('No cities available for this country.');
        return;
    }
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        elements.citySelect.appendChild(option);
    });
}

// Validate city name
function isValidCityName(city) {
    return /^[a-zA-Z\s\-]+$/.test(city);
}

// Fetch and display weather
async function fetchAndDisplayWeather(city) {
    if (!city) {
        displayError('Please enter or select a city.');
        return;
    }
    if (!isValidCityName(city)) {
        displayError('City name contains invalid characters.');
        return;
    }
    const weatherData = await getWeatherData(city);
    displayWeather(weatherData);
}

// Event listeners
function initializeApp() {
    // Validate DOM elements
    const requiredElements = [
        'countrySelect',
        'citySelect',
        'cityInput',
        'searchButton',
        'weatherInfo',
        'sessionTime',
        'apiCalls'
    ];
    for (const key of requiredElements) {
        if (!elements[key]) {
            console.error(`Element ${key} not found in the DOM.`);
            displayError('Application initialization failed. Please check the page structure.');
            return;
        }
    }

    startSessionTimer();
    loadCountries();

    elements.searchButton.addEventListener('click', () =>
        fetchAndDisplayWeather(elements.cityInput.value.trim())
    );
    elements.countrySelect.addEventListener('change', () => {
        const countryCode = elements.countrySelect.value;
        if (countryCode) loadCities(countryCode);
    });
    elements.citySelect.addEventListener('change', () =>
        fetchAndDisplayWeather(elements.citySelect.value)
    );
}

document.addEventListener('DOMContentLoaded', initializeApp);