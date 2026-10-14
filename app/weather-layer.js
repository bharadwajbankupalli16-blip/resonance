"use client";
import { useEffect, useState } from "react";
export default function WeatherLayer() {
const [weather, setWeather] = useState("clear");
const [ready, setReady] = useState(false);
useEffect(() => {
let active = true;
async function loadWeather(latitude, longitude) {
try {
const params = new URLSearchParams({
latitude: String(latitude),
longitude: String(longitude),
current: "weather_code,is_day",
timezone: "auto",
});
const response = await fetch(
"https://api.open-meteo.com/v1/forecast?" + params.toString()
);
if (!response.ok) {
throw new Error("Weather API request failed");
}
const data = await response.json();
if (!active) return;
const code = data.current.weather_code;
const isDay = data.current.is_day === 1;
let condition = "clear";
if ([95, 96, 99].includes(code)) {
condition = "storm";
} else if (
(code >= 51 && code <= 67) ||
(code >= 80 && code <= 82)
) {
condition = "rain";
} else if ([71, 73, 75, 77, 85, 86].includes(code)) {
condition = "snow";
} else if ([45, 48].includes(code)) {
condition = "fog";
} else if ([1, 2, 3].includes(code)) {
condition = "cloudy";
}
setWeather(condition + (isDay ? "" : " night"));
setReady(true);
} catch (error) {
console.error("Weather integration failed:", error);
if (active) setReady(false);
}
}
if (!("geolocation" in navigator)) {
console.warn("Geolocation is not supported by this browser.");
return function () {
active = false;
};
}
navigator.geolocation.getCurrentPosition(
function (position) {
loadWeather(
position.coords.latitude,
position.coords.longitude
);
},
function (error) {
console.warn("Weather location unavailable:", error.message);
},
{ timeout: 10000, maximumAge: 600000 }
);
return function () {
active = false;
};
}, []);
const type = weather.split(" ")[0];
const isNight = weather.includes("night");
const layerClass =
"weather-layer " +
(ready ? "weather-ready " : "") +
"weather-" + type +
(isNight ? " weather-night" : "");
return (
<div className={layerClass} aria-hidden="true">
{["cloudy", "fog", "rain", "storm"].includes(type) && (
<div className="weather-clouds">
<span className="weather-cloud cloud-a" />
<span className="weather-cloud cloud-b" />
<span className="weather-cloud cloud-c" />
</div>
)}
{["rain", "storm"].includes(type) && (
<div className="weather-rain">
{Array.from({ length: 65 }, function (_, i) {
return (
<i
key={i}
style={{
left: ((i * 37) % 100) + "%",
animationDelay: ((i * 0.13) % 2.5) + "s",
animationDuration: (0.65 + (i % 5) * 0.12) + "s",
}}
/>
);
})}
</div>
)}
{type === "snow" && (
<div className="weather-snow">
{Array.from({ length: 45 }, function (_, i) {
return (
<i
key={i}
style={{
left: ((i * 43) % 100) + "%",
animationDelay: ((i * 0.31) % 6) + "s",
animationDuration: (4 + (i % 5) * 1.2) + "s",
width: (3 + (i % 4)) + "px",
}}
/>
);
})}
</div>
)}
{type === "storm" && <div className="weather-lightning" />}
{type === "clear" && <div className="weather-sun-glow" />}
{type === "fog" && <div className="weather-fog" />}
</div>
);
}
