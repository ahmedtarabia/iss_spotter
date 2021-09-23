
const request = require('request');

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    fetchCoordsByIP(ip, (error, coords) => {
      fetchISSFlyOverTimes(coords,(error, passTimes) => {
        if (error) {
          return callback(error);
        }
        callback(error, passTimes) 
        
      })
    })
  })      
}

const fetchMyIP = function(callback) {
  const url = "https://api.ipify.org/?format=json";
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // if we get here, all's well and we got the data

    const data = JSON.parse(body);
    if (data.ip) {
      callback(null, data.ip);
    }
  });
}

const fetchCoordsByIP = function(ip, callback) { //ip string
  const url = `https://freegeoip.app/json/${ip}`;
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
      // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
      // if we get here, all's well and we got the data
    const { latitude, longitude } = JSON.parse(body);
    callback(null, { latitude, longitude });
  });
}

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
      // if non-200 status, assume server error
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }
      // if we get here, all's well and we got the data
      const data = JSON.parse(body);
      if (data.response) {
        callback(null, data.response);
        
      }
    });
  }



module.exports = { nextISSTimesForMyLocation };
