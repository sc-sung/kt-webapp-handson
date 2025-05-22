const { chromium } = require('playwright');
const express = require('express');
const app = express();

app.get('/screenshot', async (req, res) => {
   const url = req.query.url;
   if (!url) return res.status(400).send('Missing url param');

   const browser = await chromium.launch();
   const page = await browser.newPage();
   await page.goto(url);
   const buffer = await page.screenshot();
   await browser.close();

   res.type('image/png').send(buffer);
});

app.listen(3000, () => console.log('Server running on port 3000'));