const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const scraper = require('./scraper');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

app.use(bodyParser.json())
let notes = [];
let fileNameToStoreNotes = process.argv[2] || 'nodeNotes';
const store = () => fs.writeFile(fileNameToStoreNotes + '.json',
    JSON.stringify(notes).replace(/,{/g, ',\n{'),
    () => console.log('Saved!') || process.exit(0)
);

app.post('/', function (req, res) {
    if (!notes.length)
        setTimeout(store, Number(process.argv[3])|| 15000);

    notes = [...notes, ...req.body];
    res.end();
});

app.listen(3000);

(async () => {
    const browser = await require('puppeteer').launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 960 });
    await page.goto('https://keep.google.com', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.notes-container');
    await page.waitFor(3000);
    await page.evaluate(`${scraper.toString()}; new Scraper()`);
})();