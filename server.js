const express = require("express");
const app = express()

const axios = require('axios');

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

const { createCanvas } = require('canvas');

function createImage(contributions, width, height) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    // TODO: Draw contributions graph based on 'contributions' data

    const out = fs.createWriteStream(__dirname + '/contributions.png');
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('The PNG file was created.'));
}

// const wallpaper = require('wallpaper');

// async function setImageAsWallpaper() {
//     await wallpaper.set('./contributions.png');
// }
let wallpaper;
import('wallpaper').then((module) => {
    wallpaper = module;
    // Use `wallpaper` here
});

app.get("/", async (req, res) => {
    const fetch = await fetchUserActivity("Daar93");
    console.log(fetch)

    res.send("Hallo");
})

app.listen(3000, () => {

})