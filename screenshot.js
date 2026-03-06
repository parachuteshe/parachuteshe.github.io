const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('https://parachuteshe.github.io/freelancer-hub/', {
    waitUntil: 'networkidle0',
    timeout: 15000
  });
  await page.screenshot({
    path: path.join(__dirname, 'images', 'freelancer-hub.png'),
    fullPage: false
  });
  await browser.close();
  console.log('Screenshot saved to images/freelancer-hub.png');
})();
