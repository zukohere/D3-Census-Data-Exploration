
// 'YYYY-MM-DD' format.
var dates = ['2021-03-01','2021-04-01']

var data = []

var API_Key = "03ae3b73753445fa992cc8614494aea9"


// 40.2204° N, 74.0121° W Asbury Park
var lat = 40.2204
var long = -74.0121
// `https://api.ipgeolocation.io/astronomy?apiKey=${API_Key}&lat=${lat}&long=${long}&date=${date}`
// var location = "New%20York,%20US"
// "Asbury%20Park,%20US"

dates.forEach(function(date) {d3.json(`https://api.ipgeolocation.io/astronomy?apiKey=${API_Key}&lat=${lat}&long=${long}&date=${date}`).then(function(jdata) {
    data.push(jdata)
})
// Promise Pending
const dataPromise = d3.json(`https://api.ipgeolocation.io/astronomy?apiKey=${API_Key}&ip=1.1.1.1&date=${date}`);
console.log("Data Promise: ", dataPromise);

}
);

console.log(data)