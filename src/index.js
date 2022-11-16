import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import WeatherService from './js/weather-service';
import ForecastService from './js/forecast-service';

// Business Logic


// function that makes an api request
function getWeather(city) {
  let promise = WeatherService.getWeather(city);

  promise.then(function(weatherDataArray) {
    // function that will print weatherDataArray[0].main.humidity and weatherDataArray[0].main.temp to our HTML DOM
    // with city weatherDataArray[1]
    printElements(weatherDataArray);
  }, function(errorArray) {
    printError(errorArray);
  });
}

function getForecast(city) {
  let promise = ForecastService.getForecast(city);

  promise.then(function(forecastDataArray) {
    // function that will print weatherDataArray[0].main.humidity and weatherDataArray[0].main.temp to our HTML DOM
    // with city weatherDataArray[1]
    printForecast(forecastDataArray);
  }, function(errorArray) {
    printError(errorArray);
  });
}

// UI Logic
function printError(error) {
  document.querySelector('#showresponse').innerText = `There was an error accessing the weather data for 
  ${error[2]}: ${error[0].status} ${error[0].statusText} ${error[0].statusText}: ${error[1].message}`;
}

function printElements(data) {
  const sunrise = new Date(data[0].sys.sunrise * 1000);
  document.querySelector('#showResponse').innerText = `The humidity in ${data[1]} is ${data[0].main.humidity}%.
  The temperature in Fahrenheit is ${1.8 * (data[0].main.temp - 273) + 32} degree. Wind speed is ${data[0].wind.speed}. + ${sunrise}`;
}

function printForecast(data) {
  const weekArray = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]; 
  const dayOne = new Date(data[0].list[5].dt * 1000);
  const dayTwo = new Date(data[0].list[11].dt * 1000);
  document.querySelector('#showResponse').innerText += `The 5 day forecast in ${data[1]} is:
  ${dayOne.getMonth() + 1}/${dayOne.getDate()} ${weekArray[dayOne.getDay()]}  ${(((data[0].list[0].main.temp) - 273) +32).toFixed(1)}.
  ${dayTwo.getMonth() + 1}/${dayTwo.getDate()} ${weekArray[dayTwo.getDay()]}  ${(((data[0].list[0].main.temp) - 273) +32).toFixed(1)}`;

  let list2 = data[0].list;
  let tempTot = 0;
  let ctr = 0;
  let aveTemp = 0;


  list2.forEach(function (element, index)  {
    if(index != 0) {
      
      let pIndex = list2[index-1].dt;      
      let previousDate =  new Date(pIndex * 1000).getDate();   
      let currDate = new Date(element.dt * 1000).getDate();
      console.log(currDate);
      if( previousDate === currDate)
      {
        ctr ++;
        tempTot += element.main.temp; 
        console.log("Temptot: " + tempTot, "MainTemp: " + element.main.temp + "Ctr: " + ctr );

      }
      else
      {
        document.querySelector('#showResponse').innerText += `
        Average Temp is: ${(1.8 * (aveTemp  - 273) + 32).toFixed(1)}
        Average Uncoverted Temp is: ${aveTemp }`;
        ctr = 0;
        tempTot = 0;
        aveTemp = 0;
      }
      aveTemp = tempTot/ctr;
    }
  });
}

function handleFormSubmission(event) {
  event.preventDefault();
  
  const city = document.querySelector('#location').value;
  document.querySelector('#location').value = null;
  getWeather(city);
  getForecast(city);
}
window.addEventListener("load", function() {
  document.querySelector('form').addEventListener("submit", handleFormSubmission);
  
});