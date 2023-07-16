const express = require("express");
const axios = require("axios");
const app = express();
require('dotenv').config();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null });
});


app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.API_KEY;
  const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  let weather;
  let error = null;
  
  try {
    const response = await axios.get(APIUrl);
    weather = response.data;

    weather =
     {temp: fahrenheit_to_celsius( weather.main.temp), 
    feels_like: fahrenheit_to_celsius( weather.main.feels_like),
    cloud: weather.weather[0].main,
    city:weather.name, 
    country: weather.sys.country}
    res.render("index", { weather, error });

    console.log(weather)
  } catch (error) {
    console.log(`"problem": ${error}`)
    weather = null;
    error = "INVALID CITY. Please enter a valid name";
    res.render("index", { weather, error });

  }
});

function fahrenheit_to_celsius(fahrenheit)
{
    return  Math.round( (fahrenheit -32) / 1.8);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
