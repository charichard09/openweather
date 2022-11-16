export default class ForecastService {
  static getForecast(city) {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}`;
    
      request.addEventListener("loadend", function() {
        const response = JSON.parse(this.responseText);
        if (this.status === 200) {
          resolve([response, city]);
        } else {
          reject([this, city]);
        }
      });
    
      request.open("GET", url, true);
      request.send();
    });
  }
}