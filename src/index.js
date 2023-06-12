let apiKey = "57b2c40fdae71a6ba41d72685e3226e2";

function showDayDateTime(timeStamp)
{
    // Displaying when the data was last updated
    let now = new Date(timeStamp);
    let dayIndex = now.getDay();
    
    //Day
    let week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = week[dayIndex];

    //Date
    let date = now.getDate();
    
    //Month
    let monthIndex = now.getMonth();
    let months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month = months[monthIndex];
    
    
    // Time
    let hrs = now.getHours();
    if(hrs<10) hrs=`0${hrs}`;

    let mins = now.getMinutes();
    if(mins<10) mins=`0${mins}`;

    let dayDateTimeDiv = document.querySelector("#dayDateTime");
    dayDateTimeDiv.innerHTML = `Last Updated: ${day}, ${month} ${date}, ${hrs}:${mins}`;

}

// Using OpenWeather API to fetch temperature, country code in real time
function showTempUsingOpenApi(response) {
    let temperature = Math.round(response.data.main.temp);
    let city = response.data.name;
    let country = response.data.sys.country;
    let humidity = Math.round(response.data.main.humidity);
    let windSpeed = Math.round(response.data.wind.speed);
    let desc = response.data.weather[0].description;

    let minTemp = Math.round(response.data.main.temp_min);
    let maxTemp = Math.round(response.data.main.temp_max);

    let tempElement = document.querySelector("#current-temp");
    tempElement.innerHTML = `${temperature}°`;

    let cityElement = document.querySelector(".location");
    cityElement.innerHTML = `${city}, ${country}`;

    let humidElement = document.querySelector("#humid-data");
    humidElement.innerHTML = `${humidity}%`;

    let windElement = document.querySelector("#wind-data");
    windElement.innerHTML = `${windSpeed} m/s`;

    let descElement = document.querySelector("#description");
    descElement.innerHTML = desc;

    let maxMinElement = document.querySelector("#maxMinTemp");
    maxMinElement.innerHTML = `${maxTemp}°C/${minTemp}°C`;

    showDayDateTime(response.data.dt * 1000);
}

// Displaying real City 
function displayCity(event) {
    event.preventDefault();
    let cityName = document.querySelector("#cityName").value;
    let locationDiv = document.querySelector(".location");

    if (cityName) {
        locationDiv.innerHTML = cityName;
    }
    else {
        alert("Please enter a city");
    }

    showRealTemp(cityName);
}

let search = document.querySelector("#search-bar");
search.addEventListener("submit", displayCity);

// Showing temperature of city in search box 
function showRealTemp(cityName,response)
{
    let apiUrl =`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(showTempUsingOpenApi);
}

// Celsius and Fahrenheit Links
let flag = 0; // Shows current temp is in Celsius

function convertToFah(event) {
    if (!flag) {
        flag = 1;
        event.preventDefault();

        let tempCel = document.querySelector("#current-temp");
        let tempCelValue = parseInt(tempCel.innerHTML);
        let tempFah = Math.round((9 / 5 * tempCelValue) + 32);
        tempCel.innerHTML = `${tempFah}°`;

        let fahLink=document.querySelector("#fahrenheit-link");
        let celLink = document.querySelector("#celsius-link");

        fahLink.style.border="2px solid black";
        fahLink.style.borderRadius="5px";
        celLink.style.border="";
    }
}

function convertToCel(event) {
    if (flag) {
        flag = 0;
        event.preventDefault();
        let tempFah = document.querySelector("#current-temp");
        let tempFahValue = parseInt(tempFah.innerHTML);
        let tempCel = Math.round(5 / 9 * (tempFahValue - 32));
        tempFah.innerHTML = `${tempCel}°`;

        let fahLink = document.querySelector("#fahrenheit-link");
        let celLink = document.querySelector("#celsius-link");

        celLink.style.border = "2px solid black";
        celLink.style.borderRadius = "5px";
        fahLink.style.border = "";
    }
}

let fahLink = document.querySelector("#fahrenheit-link");
fahLink.addEventListener("click", convertToFah);

let celLink = document.querySelector("#celsius-link");
celLink.addEventListener("click", convertToCel);

// Using geolocation API to fetch coordinates
function showPosition(position) {
    navigator.geolocation.getCurrentPosition(showPosition);
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(showTempUsingOpenApi);
}

let locationIcon = document.querySelector("#location-dot");
locationIcon.addEventListener("click", showPosition);
