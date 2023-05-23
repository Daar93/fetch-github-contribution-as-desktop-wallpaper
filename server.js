const express = require("express");
const app = express()
const axios = require('axios');
const fs = require("fs");
const { createCanvas } = require('canvas');

app.use(express.json());

async function fetchUserActivity(username) {
    const url = `https://api.github.com/users/${username}/events/public`;
    const response = await axios.get(url);
    const data = response.data;
    return data;
};

function processContributions(events) {
    let contributions = {};
    for (let event of events) {
        let date = new Date(event.created_at).toDateString();
        if (!contributions[date]) {
            contributions[date] = 0;
        }
        contributions[date]++;
    }
    return contributions;
}

function createImage(contributions, width, height) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    const squareSize = Math.floor(width / 7); // 7 days in a week

    // Draw contributions graph based on 'contributions' data
    let x = 0, y = 0;
    for (let date in contributions) {
        // Choose color based on number of contributions
        let color;
        switch (contributions[date]) {
            case 0: color = '#ebedf0'; break; // no contributions: light gray
            case 1: color = '#9be9a8'; break; // 1 contribution: light green
            case 2: color = '#40c463'; break; // 2 contributions: green
            case 3: color = '#30a14e'; break; // 3 contributions: dark green
            default: color = '#216e39'; break; // 4 or more contributions: darkest green
        }

        // Draw square
        context.fillStyle = color;
        context.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);

        // Move to next position in grid
        x++;
        if (x >= 7) {
            x = 0;
            y++;
        }
    }

    const out = fs.createWriteStream(__dirname + '/contributions.png');
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('The PNG file was created.'));
}


let wallpaper;
import('wallpaper').then((module) => {
    wallpaper = module;
    // Use `wallpaper` here
});

app.get("/", async (req, res) => {
    const fetch = await fetchUserActivity("Daar93");
    createImage(processContributions(fetch), 1920, 1080);

    res.send("Hallo");
})

app.listen(3000, () => {

})