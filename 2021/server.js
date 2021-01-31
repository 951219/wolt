const express = require('express');
const fs = require('fs');
const geolib = require('geolib');


const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));



const restaurants = JSON.parse(fs.readFileSync('./data/restaurants.json')).restaurants;


///discovery?lat=60.1709&lon=24.941
app.get("/discovery", async (req, res) => {
    const latitude = parseFloat(req.query.lat);
    const longitude = parseFloat(req.query.lon);

    let popular = await getPopularRestaurants();
    let newest = await getNewestRestaurants();
    let nearby = await getNearbyRestaurants(latitude, longitude);

    let sections = [{
        "title": "Popular Restaurants",
        "restaurants": popular
    }, {
        "title": "New Restaurants",
        "restaurants": newest
    }, {
        "title": "Nearby Restaurants",
        "restaurants": nearby
    }];

    res.status(200).json({ sections });
});


async function getPopularRestaurants() {
    let list = await restaurants.sort((a, b) => {
        if (a.popularity > b.popularity) { return -1 } else { return 1 };
    });
    return list.slice(0, 10);
};

// newest
async function getNewestRestaurants() {
    let list = await restaurants.sort((a, b) => {
        if (a.launch_date > b.launch_date) { return -1 } else { return 1 };
    });
    // TODO “New Restaurants”: Newest launch_date first (descending). This list has also a special rule: launch_date must be no older than 4 months.

    return list.slice(0, 10);
};

// nearby
async function getNearbyRestaurants(lat, lon) {
    const userLocation = { lat, lon };
    let list = await restaurants.sort((a, b) => {
        const firstRestoLocation = { lat: a.location[1], lon: a.location[0] }
        const secondRestoLocation = { lat: b.location[1], lon: b.location[0] }

        const userToFirstResto = geolib.getPreciseDistance(userLocation, firstRestoLocation);

        const userToSecondResto = geolib.getPreciseDistance(userLocation, secondRestoLocation);


        if (userToFirstResto > userToSecondResto) { return 1 } else { return -1 };
    });

    return list.slice(0, 10);

};


//TODO double check if there are 10 items and if not, add empty objects.

//TODO All restaurants returned by the endpoint must be closer than 1.5 kilometers 
// from given coordinates, measured as a straight line between coordinates and the location of the restaurant.


//TODO Open restaurants (online=true) are more important than closed ones. 
// Every list must be first populated with open restaurants, and only adding closed ones if there is still capacity left.

