// #region
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const scraper = require('./scraper');
const lib = require('./lib');
const loginToFakeGoogleAccount = require('../test/login');
// #endregion

let notes = [];

lib.prepare(app).post('/', function (req, res) {
    notes = [...notes, ...req.body];
    res.end();
});

app.get('/', function (req, res) {
    const destination = path.resolve('export/', 'notes.json');
    fs.writeFile(destination, lib.indent(notes), lib.cb(destination));
    res.end();
});

app.listen(3000);

(async _ => {
    const browser = await require('puppeteer').launch({ headless: (process.env.NODE_ENV === 'development') });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 960 });
    await page.goto('https://keep.google.com', { waitUntil: 'networkidle2' });
    await loginToFakeGoogleAccount(page);
    await page.waitForSelector('.notes-container');
    await page.waitFor(3000);
    await page.evaluate(`${scraper.toString()}; new Scraper()`);
})();