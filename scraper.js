const puppeteer = require("puppeteer");

async function getPins(query) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`https://www.pinterest.com/search/pins/?q=${query}`);

  await page.waitForTimeout(3000);

  const pins = await page.evaluate(() => {
    let results = [];
    document.querySelectorAll("img").forEach(img => {
      if (img.alt) {
        results.push({
          title: img.alt,
          image: img.src
        });
      }
    });
    return results.slice(0, 10);
  });

  await browser.close();
  return pins;
}

module.exports = { getPins };