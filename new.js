

const apiKey = "9d18bd79ca0c680ced6c4b4db745fce3"; 
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// ✅ DOM references
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const loadingEl = document.querySelector(".loading");
const errorEl = document.querySelector(".error");
const weatherEl = document.querySelector(".weather");
const historyList = document.querySelector(".history-list");


async function fetchWeather(city) {
  if (!city) return;

  loadingEl.style.display = "block";
  errorEl.style.display = "none";
  weatherEl.style.display = "none";

  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").textContent = data.main.humidity + "%";
    document.querySelector(".wind").textContent = data.wind.speed + " km/h";

    
    const condition = data.weather[0].main;
    switch (condition) {
      case "Clouds": weatherIcon.src = "clouds.png"; break;
      case "Clear": weatherIcon.src = "clear.png"; break;
      case "Rain": weatherIcon.src = "rain.png"; break;
      case "Drizzle": weatherIcon.src = "drizzle.png"; break;
      case "Mist": weatherIcon.src = "mist.png"; break;
      default: weatherIcon.src = "WhatsApp Image 2025-06-27 at 00.24.58.jpeg";
    }

    weatherEl.style.display = "block";

    
    saveToHistory(city);
    showHistory();

  } catch (err) {
    console.error("Weather fetch error:", err.message);
    errorEl.style.display = "block";
  } finally {
    loadingEl.style.display = "none";
  }
}


function saveToHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  city = city.toLowerCase();
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }
}


function showHistory() {
  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  historyList.innerHTML = "";

  history.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => fetchWeather(city));
    historyList.appendChild(li);
  });
}


searchBtn.addEventListener("click", () => {
  const city = searchBox.value.trim();
  fetchWeather(city);
});


showHistory();
