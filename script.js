// API Configuration
        const API_KEY = '5455a57dd7mshaba369c95da8fc7p1f26b3jsn0792c3306cee';
        const API_HOST = 'ai-weather-by-meteosource.p.rapidapi.com';
        
        // DOM Elements
        const cityInput = document.getElementById('city-input');
        const searchBtn = document.getElementById('search-btn');
        const currentLocation = document.getElementById('current-location');
        const temperature = document.getElementById('temperature');
        const humidity = document.getElementById('humidity');
        const windSpeed = document.getElementById('wind-speed');
        const tempDesc = document.getElementById('temp-desc');
        const humidityDesc = document.getElementById('humidity-desc');
        const windDesc = document.getElementById('wind-desc');
        const citiesTable = document.getElementById('cities-table').querySelector('tbody');
        const spinner = document.getElementById('spinner');
        const weatherDisplay = document.getElementById('weather-display');
        
        // Navigation functionality
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                document.querySelectorAll('.nav-link').forEach(l => {
                    l.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Hide all sections
                document.querySelectorAll('.content-section').forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show target section
                const targetId = this.getAttribute('data-target');
                document.getElementById(targetId).classList.add('active');
            });
        });
        
        // Function to show loading state
        function showLoading() {
            spinner.style.display = 'block';
            weatherDisplay.style.opacity = '0.3';
        }
        
        // Function to hide loading state
        function hideLoading() {
            spinner.style.display = 'none';
            weatherDisplay.style.opacity = '1';
        }
        
        // Function to fetch weather data
        async function fetchWeatherData(lat, lon, date) {
            const url = `https://${API_HOST}/time_machine?lat=${lat}&lon=${lon}&date=${date}&units=auto`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': API_KEY,
                    'x-rapidapi-host': API_HOST
                }
            };
            
            try {
                showLoading();
                const response = await fetch(url, options);
                const data = await response.json();
                hideLoading();
                return data;
            } catch (error) {
                hideLoading();
                console.error('Error fetching weather data:', error);
                showNotification('Failed to fetch weather data. Please try again.', 'error');
                return null;
            }
        }
        
        // Function to update UI with weather data
        function updateWeatherUI(data, cityName) {
            if (!data || !data.data) return;
            
            // Get current weather
            const currentWeather = data.data[0];
            
            // Update location
            currentLocation.textContent = cityName;
            
            // Update temperature
            temperature.textContent = `${Math.round(currentWeather.temperature)}°C`;
            
            // Update humidity
            humidity.textContent = `${currentWeather.humidity}%`;
            
            // Update wind speed
            windSpeed.textContent = `${currentWeather.wind.speed} km/h`;
            
            // Update descriptions
            tempDesc.textContent = `Current temperature is ${Math.round(currentWeather.temperature)}°C. Min: ${Math.round(currentWeather.temperature_min)}°C, Max: ${Math.round(currentWeather.temperature_max)}°C.`;
            humidityDesc.textContent = `Wind degree is ${currentWeather.wind.angle}. Feels like ${Math.round(currentWeather.feels_like)}°C with humidity at ${currentWeather.humidity}%.`;
            windDesc.textContent = `Wind speed is ${currentWeather.wind.speed} km/h. Cloud coverage: ${currentWeather.cloud_cover}%.`;
        }
        
        // Function to populate cities table
        async function populateCitiesTable() {
            // Cities with coordinates (lat, lon)
            const cities = [
                { name: 'Shanghai', lat: 31.2304, lon: 121.4737 },
                { name: 'Boston', lat: 42.3601, lon: -71.0589 },
                { name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
                { name: 'Kolkata', lat: 22.5726, lon: 88.3639 }
            ];
            
            // Get today's date in YYYY-MM-DD format
            const today = new Date();
            const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            
            // Clear existing table rows
            citiesTable.innerHTML = '';
            
            // Fetch data for each city and populate table
            for (const city of cities) {
                const data = await fetchWeatherData(city.lat, city.lon, dateStr);
                
                if (data && data.data) {
                    const weather = data.data[0];
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${city.name}</td>
                        <td>${weather.cloud_cover}</td>
                        <td>${Math.round(weather.feels_like)}°C</td>
                        <td>${weather.humidity}%</td>
                        <td>${Math.round(weather.temperature_max)}°C</td>
                        <td>${Math.round(weather.temperature_min)}°C</td>
                        <td>${formatTime(weather.sunrise)}</td>
                        <td>${formatTime(weather.sunset)}</td>
                        <td>${Math.round(weather.temperature)}°C</td>
                        <td>${weather.wind.angle}°</td>
                        <td>${weather.wind.speed} km/h</td>
                    `;
                    
                    citiesTable.appendChild(row);
                }
            }
        }
        
        // Function to format time
        function formatTime(timestamp) {
            const date = new Date(timestamp * 1000);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // Function to show notification
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${type === 'success' ? 'var(--accent)' : '#ff6b6b'};
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: fadeIn 0.3s ease;
            `;
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }
        
        // Add fadeOut animation to CSS
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(20px); }
            }
        `;
        document.head.appendChild(style);
        
        // Initialization
        document.addEventListener('DOMContentLoaded', () => {
            // Set today's date
            const today = new Date();
            const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            
            // Load initial weather for Haldwani
            fetchWeatherData(29.218, 79.517, dateStr)
                .then(data => updateWeatherUI(data, 'Haldwani, Uttarakhand, India'));
            
            // Populate cities table
            populateCitiesTable();
            
            // Search functionality
            searchBtn.addEventListener('click', searchWeather);
            cityInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') searchWeather();
            });
        });
        
        // Search weather function
        function searchWeather() {
            const city = cityInput.value.trim();
            if (!city) return;
            
            // Simple geocoding for demo purposes
            // In a real app, i would use a geocoding API to get coordinates
            const cities = {
    'haldwani': { lat: 29.218, lon: 79.517 },
    'delhi': { lat: 28.7041, lon: 77.1025 },
    'mumbai': { lat: 19.0760, lon: 72.8777 },
    'new york': { lat: 40.7128, lon: -74.0060 },
    'london': { lat: 51.5074, lon: -0.1278 },
    'tokyo': { lat: 35.6762, lon: 139.6503 },
    'bangalore': { lat: 12.9716, lon: 77.5946 },
    'chennai': { lat: 13.0827, lon: 80.2707 },
    'kolkata': { lat: 22.5726, lon: 88.3639 },
    'lucknow': { lat: 26.8467, lon: 80.9462 },
    'hyderabad': { lat: 17.3850, lon: 78.4867 },
    'pune': { lat: 18.5204, lon: 73.8567 },
    'ahmedabad': { lat: 23.0225, lon: 72.5714 },
    'jaipur': { lat: 26.9124, lon: 75.7873 },
    'kanpur': { lat: 26.4499, lon: 80.3319 },
    'paris': { lat: 48.8566, lon: 2.3522 },
    'sydney': { lat: -33.8688, lon: 151.2093 },
    'moscow': { lat: 55.7558, lon: 37.6173 },
    'beijing': { lat: 39.9042, lon: 116.4074 },
    'dubai': { lat: 25.2048, lon: 55.2708 },
    'los angeles': { lat: 34.0522, lon: -118.2437 },
    'san francisco': { lat: 37.7749, lon: -122.4194 },
    'chicago': { lat: 41.8781, lon: -87.6298 },
    'toronto': { lat: 43.651070, lon: -79.347015 },
    'vancouver': { lat: 49.2827, lon: -123.1207 },
    'berlin': { lat: 52.5200, lon: 13.4050 },
    'madrid': { lat: 40.4168, lon: -3.7038 },
    'rome': { lat: 41.9028, lon: 12.4964 },
    'amsterdam': { lat: 52.3676, lon: 4.9041 },
    'vienna': { lat: 48.2082, lon: 16.3738 },
    'prague': { lat: 50.0755, lon: 14.4378 },
    'cairo': { lat: 30.0444, lon: 31.2357 },
    'nairobi': { lat: -1.2921, lon: 36.8219 },
    'cape town': { lat: -33.9249, lon: 18.4241 },
    'lagos': { lat: 6.5244, lon: 3.3792 },
    'buenos aires': { lat: -34.6037, lon: -58.3816 },
    'sao paulo': { lat: -23.5505, lon: -46.6333 },
    'mexico city': { lat: 19.4326, lon: -99.1332 },
    'boston': { lat: 42.3601, lon: -71.0589 },
    'seattle': { lat: 47.6062, lon: -122.3321 },
    'washington dc': { lat: 38.9072, lon: -77.0369 },
    'singapore': { lat: 1.3521, lon: 103.8198 },
    'hong kong': { lat: 22.3193, lon: 114.1694 },
    'seoul': { lat: 37.5665, lon: 126.9780 },
    'jakarta': { lat: -6.2088, lon: 106.8456 },
    'bangkok': { lat: 13.7563, lon: 100.5018 },
    'manila': { lat: 14.5995, lon: 120.9842 },
    'karachi': { lat: 24.8607, lon: 67.0011 },
    'lahore': { lat: 31.5204, lon: 74.3587 },
    'islamabad': { lat: 33.6844, lon: 73.0479 },
    'dhaka': { lat: 23.8103, lon: 90.4125 },
    'kathmandu': { lat: 27.7172, lon: 85.3240 },
    'colombo': { lat: 6.9271, lon: 79.8612 },
    'andhra pradesh': {'lat': 15.9129, 'lon': 79.7400},
    'arunachal pradesh': {'lat': 28.2180, 'lon': 94.7278},
    'assam': {'lat': 26.2006, 'lon': 92.9376},
    'bihar': {'lat': 25.0961, 'lon': 85.3131},
    'chhattisgarh': {'lat': 21.2787, 'lon': 81.8661},
    'goa': {'lat': 15.2993, 'lon': 74.1240},
    'gujarat': {'lat': 22.2587, 'lon': 71.1924},
    'haryana': {'lat': 29.0588, 'lon': 76.0856},
    'himachal pradesh': {'lat': 31.1048, 'lon': 77.1734},
    'jharkhand': {'lat': 23.6102, 'lon': 85.2799},
    'karnataka': {'lat': 15.3173, 'lon': 75.7139},
    'kerala': {'lat': 10.8505, 'lon': 76.2711},
    'madhya pradesh': {'lat': 22.9734, 'lon': 78.6569},
    'maharashtra': {'lat': 19.7515, 'lon': 75.7139},
    'manipur': {'lat': 24.6637, 'lon': 93.9063},
    'meghalaya': {'lat': 25.4670, 'lon': 91.3662},
    'mizoram': {'lat': 23.1645, 'lon': 92.9376},
    'nagaland': {'lat': 26.1584, 'lon': 94.5624},
    'odisha': {'lat': 20.9517, 'lon': 85.0985},
    'punjab': {'lat': 31.1471, 'lon': 75.3412},
    'rajasthan': {'lat': 27.0238, 'lon': 74.2179},
    'sikkim': {'lat': 27.5330, 'lon': 88.5122},
    'tamil nadu': {'lat': 11.1271, 'lon': 78.6569},
    'telangana': {'lat': 18.1124, 'lon': 79.0193},
    'tripura': {'lat': 23.9408, 'lon': 91.9882},
    'uttar pradesh': {'lat': 26.8467, 'lon': 80.9462},
    'uttarakhand': {'lat': 30.0668, 'lon': 79.0193},
    'west bengal': {'lat': 22.9868, 'lon': 87.8550},

    //US States (abbreviated)
    'california': {'lat': 36.7783, 'lon': -119.4179},
    'texas': {'lat': 31.9686, 'lon': -99.9018},
    'florida': {'lat': 27.9944, 'lon': -81.7603},
    'new york': {'lat': 40.7128, 'lon': -74.0060},
    'illinois': {'lat': 40.6331, 'lon': -89.3985},
    'pennsylvania': {'lat': 41.2033, 'lon': -77.1945},
    'ohio': {'lat': 40.4173, 'lon': -82.9071},
    'georgia': {'lat': 32.1656, 'lon': -82.9001},
    'north carolina': {'lat': 35.7596, 'lon': -79.0193},
    'michigan': {'lat': 44.3148, 'lon': -85.6024},

    //Chinese Provinces
    'beijing': {'lat': 39.9042, 'lon': 116.4074},
    'shanghai': {'lat': 31.2304, 'lon': 121.4737},
    'guangdong': {'lat': 23.3790, 'lon': 113.7633},
    'zhejiang': {'lat': 29.1416, 'lon': 119.7889},
    'jiangsu': {'lat': 32.9711, 'lon': 119.4550},
    'shandong': {'lat': 36.3427, 'lon': 118.1498},
    'sichuan': {'lat': 30.6517, 'lon': 104.0759},
    'hunan': {'lat': 27.6104, 'lon': 111.7088},
    'henan': {'lat': 33.8820, 'lon': 113.6140},
    'hubei': {'lat': 30.5454, 'lon': 112.2707},

    //Russian Federal Subjects (some key ones)
    'moscow': {'lat': 55.7558, 'lon': 37.6173},
    'saint petersburg': {'lat': 59.9311, 'lon': 30.3609},
    'novosibirsk': {'lat': 55.0084, 'lon': 82.9357},
    'yekaterinburg': {'lat': 56.8389, 'lon': 60.6057},
    'kazan': {'lat': 55.8304, 'lon': 49.0661},
    'nizhny novgorod': {'lat': 56.2965, 'lon': 43.9361},
    'samara': {'lat': 53.2038, 'lon': 50.1606},
    'omsk': {'lat': 54.9885, 'lon': 73.3242},
    'chelyabinsk': {'lat': 55.1644, 'lon': 61.4368},
    'rostov-on-don': {'lat': 47.2357, 'lon': 39.7015},
};

            
            const normalizedCity = city.toLowerCase();
            const coords = cities[normalizedCity];
            
            if (coords) {
                const today = new Date();
                const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                
                fetchWeatherData(coords.lat, coords.lon, dateStr)
                    .then(data => updateWeatherUI(data, city.charAt(0).toUpperCase() + city.slice(1)));
                
                cityInput.value = '';
                showNotification(`Weather data loaded for ${city}`);
            } else {
                showNotification('City not found. Try Haldwani, Delhi, Mumbai, etc.', 'error');
            }
        }