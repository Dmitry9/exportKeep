// #region
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const scraper = require('./scraper');
const lib = require('./lib');
const cookie = require('./cookies');
// #endregion

let notes = [], name = ['notes', 'archived'], page;

lib.prepare(app).post('/', function (req, res) {
    notes = [...notes, ...req.body];
    res.end();
});

app.get('/', function (req, res) {
    const destination = path.resolve('export/', `${name.shift()}.json`);
    if (name.length === 1)
        lib.handleArchived(page);

    fs.writeFile(destination, lib.indent(notes), lib.cb(destination, !name.length));
    res.end();
});

app.listen(3000);

(async _ => {
    const browser = await require('puppeteer').launch({ headless: (process.env.NODE_ENV === 'development') });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 960 });
    await page.setCookie(...cookie);
    await page.goto('https://keep.google.com', { waitUntil: 'networkidle2' });
    try {
        await page.waitFor(1000);
        await page.screenshot({ path: '/tmp/uploads/screen5.png' });
        await page.waitForSelector('div[aria-multiline]');
        await page.waitFor(3000);
        await page.evaluate(`${scraper.toString()};(window.scraper = new Scraper()).do();`);
    } catch (e) {
        console.log('Scraping notes failed. ', e);process.exit(1);
    }
})();