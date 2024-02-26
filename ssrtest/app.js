// Requiring modules
const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs');
// const { ssr } = require('./ssr');
const port = 8000;

const puppeteer = require('puppeteer')
async function ssr(url) {
    console.log("Trying to SSR ", url, "...")
    const browserOptions = {
        headless: true
    };
    try {
        const browser = await puppeteer.launch(browserOptions);
        const page = await browser.newPage();
        await page.goto('file:///home/kamal/Desktop/ssrtest/registration.html', { waitUntil: 'networkidle0' });
        await page.waitForSelector('body');
        await page.$eval('body', ({ dataset }) => {
            dataset.rendered = true
        })

        const serializedHtml = await page.content();
        await browser.close();
        return serializedHtml;
    } catch (error) {
        console.error('SSR Error', error);
        return 'Problem rendering on the server.';
    }
}

// Render index.ejs file
app.get('/', async function(req, res) {

    data = {
            "test": "this is test file"
        }
        // Render page using renderFile method
    const htmlContent = await ssr('./registration.html')
        // console.log("html content", htmlContent);
    res.send(htmlContent)
        // ejs.renderFile('registration.html', { data }, {}, function(err, template) {
        //     if (err) {
        //         throw err;
        //     } else {
        //         res.end(template);
        //     }
        // });
});

// Server setup
app.listen(port, function(error) {
    if (error)
        throw error;
    else
        console.log("Server is running");
});