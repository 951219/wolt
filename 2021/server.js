const express = require('express');
const fs = require('fs');




const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));



const restaurants = JSON.parse(fs.readFileSync('./data/restaurants.json'));


///discovery?lat=60.1709&lon=24.941
app.get("/discovery", async (req, res) => {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    let popular = await getPopularRestaurants();
    let newest = await getNewestRestaurants();
    let nearby = await getNearbyRestaurants(lat, lon);

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
    let list = await restaurants.restaurants.sort((a, b) => {
        if (a.popularity > b.popularity) { return -1 } else { return 1 };
    });
    return list.slice(0, 10);
};

// newest
async function getNewestRestaurants() {

};

// nearby
async function getNearbyRestaurants(lat, lon) {

};