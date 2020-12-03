// const fs = require('fs');
// const parse = require('csv-parse');

var locationData = [];
var pickupTimes = [];
var dates = [];


(function () {
    CSVToArray("./locations.csv", ',')
    // fs.createReadStream("./locations.csv")
    //     .pipe(parse())
    //     .on('data', function (csvrow) {
    //         var entry = {
    //             "id": csvrow[0],
    //             "latitude": csvrow[1],
    //             "longitude": csvrow[2]
    //         }
    //         locationData.push(entry);
    //     })
    //     .on('end', function () {
    //         locationData.shift();

    //         console.log(`Location csv read - success : ${locationData.length}`);
    //     });


    fs.createReadStream("./pickup_times.csv")
        .pipe(parse())
        .on('data', function (csvrow) {
            var entry = {
                "id": csvrow[0],
                "date": csvrow[1],
                "time": csvrow[2]
            }
            pickupTimes.push(entry);
        })
        .on('end', function () {
            pickupTimes.shift();

            console.log(`Pickup times csv read - success : ${pickupTimes.length}`);
        });
}());








//Get all dates without duplicates
    //For Date field

//Get all times (date)
    //For Hours field
