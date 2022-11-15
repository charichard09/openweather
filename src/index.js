import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// Business Logic


function getWeather(city) {
  let request = new XMLHttpRequest();
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`;

  request.addEventListener("loadend", function() {
    const response = JSON.parse(this.responseText);
    if (this.status === 200) {
      printElements(response, city);
    } else {
      printError(this, city);
    }

    request.addEventListener("readystatechange", function() {
      console.log(this.readyState);
    });
  });

  request.open("GET", url, true);
  request.send();
}

function getForecast(city) {
  let request = new XMLHttpRequest();
  const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}`;

  request.addEventListener("loadend", function() {
    const response = JSON.parse(this.responseText);
    if (this.status === 200) {
      printForecast(response, city);
    } else {
      printError(this, city);
    }
  });

  request.open("GET", url, true);
  request.send();
}

// UI Logic
function printError(request, city) {
  document.querySelector('#showresponse').innerText = `There was an error accessing the weather data for ${city}: ${request.status} ${request.statusText}`;
}

function printElements(apiResponse, city) {
  const sunrise = new Date(apiResponse.sys.sunrise * 1000);
  document.querySelector('#showResponse').innerText = `The humidity in ${city} is ${apiResponse.main.humidity}%.
  The temperature in Fahrenheit is ${1.8 * (apiResponse.main.temp - 273) + 32} degree. Wind speed is ${apiResponse.wind.speed}. + ${sunrise}`;
}

function printForecast(apiResponse, city) {
  const weekArray = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]; 
  const dayOne = new Date(apiResponse.list[5].dt * 1000);
  const dayTwo = new Date(apiResponse.list[11].dt * 1000);
  document.querySelector('#showResponse').innerText += `The 5 day forecast in ${city} is:
  ${dayOne.getMonth() + 1}/${dayOne.getDate()} ${weekArray[dayOne.getDay()]}  ${(((apiResponse.list[0].main.temp) - 273) +32).toFixed(1)}.
  ${dayTwo.getMonth() + 1}/${dayTwo.getDate()} ${weekArray[dayTwo.getDay()]}  ${(((apiResponse.list[0].main.temp) - 273) +32).toFixed(1)}`;

  let list2 = apiResponse.list;
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