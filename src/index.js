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
let fileNameToStoreNotes = process.argv[2] || 'notes';

lib.prepare(app).post('/', function (req, res) {
    notes = [...notes, ...req.body];
    res.end();
});

app.get('/', function (req, res) {
    const pathToStore = path.resolve('export/', fileNameToStoreNotes + '.json');
    fs.writeFile(pathToStore, lib.indent(notes), lib.cb(pathToStore));
    res.end();
});

app.listen(3000);

(async _ => {
    const browser = await require('puppeteer').launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 960 });
    await page.goto('https://keep.google.com', { waitUntil: 'networkidle2' });
    await loginToFakeGoogleAccount(page);
    await page.waitForSelector('.notes-container');
    await page.waitFor(3000);
    await page.evaluate(`${scraper.toString()}; new Scraper()`);
})();