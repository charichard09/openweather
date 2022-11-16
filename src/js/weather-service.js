// declare our WeatherService class which contains our static function getWeather
export default class WeatherService {
  // declare static function that makes an api request
  static getWeather(city) {
    // save promise object in promise variable, passing callback function of API call (aka wrapping our API call in promise)
    return new Promise(function(resolve, reject) {
      // save request object from XMLHttpRequest into request variable
      let request = new XMLHttpRequest();
      // save query to endpoint url as a template literal in url variable
      const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`;
  
      // add "loadend" event which will execute when an API finishes a request, to the XMLHttpRequest object request 
      request.addEventListener("loadend", function() {
        // "this" is the request object we are acting on. The responseText will return the information from the API request. 
        // JSON.parse is a JSON static method that will parse a JSON string and turn it into a JSON object
        const response = JSON.parse(this.responseText);
        //IF status returns 200 meaning "OK", execute code block
        if (this.status === 200) {
          // pass the parsed this.responseText and city into an array to the resolve callback function of promise to be 
          // handled by promise.then(resolveCallback)
          resolve([response, city]);
        } else {
          // IF the request fails, pass an array of request object, response, and city to the reject callback function of promise
          // to be handled by promise.then( , failCallback)
          reject([this, response, city]);
        }
  
        // "readystatechange" event will fire every time the readyState property of request changes. Useful to console.log
        // or print to webpage the readyState of a request to show status
        request.addEventListener("readystatechange", function() {
          console.log(this.readyState);
        });
      });
      // To send the request, use the open() and send() functions on the XMLHttpRequest object
      // "GET" is the request type, url is our variable that stores our API endpoint URL, and true to say be asynchronous
      request.open("GET", url, true);
      request.send();
    });
  }
}