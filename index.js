const fs = require('fs'); 
const parse = require('csv-parse');
const servetr = require('express');

var locationData=[];
var pickupTimes=[];

fs.createReadStream("./locations.csv")
    .pipe(parse())
    .on('data', function(csvrow) {
        locationData.push(csvrow);        
    })
    .on('end',function() {
      // removing the first item
      locationData.shift();
    console.log("Location csv read - success : " + locationData.length);    
});


 fs.createReadStream("./pickup_times.csv")
    .pipe(parse())
    .on('data', function(csvrow) {
        pickupTimes.push(csvrow);        
    })
    .on('end',function() {
    // removing the first item
    pickupTimes.shift();
    console.log("Pickup times csv read - success : " + pickupTimes.length );
});