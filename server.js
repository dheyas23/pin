const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.get("/search", async (req, res) => {
  const query = req.query.q;

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true
    });

    const page = await browser.newPage();

    // 👇 IMPORTANT (bot detect avoid)
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    );

    await page.goto(`https://www.pinterest.com/search/pins/?q=${query}`, {
      waitUntil: "networkidle2",
      timeout: 0
    });

    await page.waitForTimeout(7000);

    const pins = await page.evaluate(() => {
      let results = [];
      document.querySelectorAll("img").forEach(img => {
        if (img.alt && img.src) {
          results.push({
            title: img.alt,
            image: img.src
          });
        }
      });
      return results.slice(0, 10);
    });

    await browser.close();

    // 👇 IMPORTANT (empty handle)
    if (!pins || pins.length === 0) {
      return res.json([]);
    }

    res.json(pins);

  } catch (error) {
    console.log("SCRAPER ERROR:", error);
    res.status(500).json({ error: "Scraping failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));