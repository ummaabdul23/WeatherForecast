// Load the CSV file and extract the city coordinates
Papa.parse("city_coordinates.csv", {
    download: true,
    header: true,
    complete: function(results) {
        const cities = results.data;
        cities.forEach(city => {
            fetchWeatherData(city.lat, city.lon, city.city);
            populateCitySelect(cities);
        });
    }
});

function fetchWeatherData(lat, lon, cityName) {
    const apiUrl = `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(cityName, data);
        })
        .catch(error => console.log("Error fetching weather data: ", error));
}

function displayWeather(cityName, data) {
    const weatherContainer = document.getElementById('weather-container');

    // Get temperature from the data
    const temperature = data.dataseries[0].temp2m;

    // Create a div for each city
    const cityDiv = document.createElement('div');
    cityDiv.classList.add('city');
    cityDiv.innerHTML = `
        <h3>${cityName}</h3>
        <p>Temperature: ${temperature}°C</p>
    `;

    // Append the city div to the container
    weatherContainer.appendChild(cityDiv);
}

function populateCitySelect(cities) {
    const select = document.getElementById('cities');
    
    // Clear any existing options
    select.innerHTML = '<option value="">--Select a city--</option>';

    // Loop through the parsed cities data and create options
    cities.forEach(city => {
        // Check if city data exists
        if (city.city && city.country) {
            const option = document.createElement('option');
            option.value = `${city.latitude},${city.longitude}`;  // Store lat, lon as value
            option.text = `${city.city}, ${city.country}`;        // Display city, country
            select.appendChild(option);
        }
    });
}
