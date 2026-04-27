const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();

// ✅ CORS fix (VERY IMPORTANT)
app.use(cors({
  origin: "*"
}));

// ✅ Test route (check ke liye)
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// ✅ Search route
app.get("/search", async (req, res) => {
  const query = req.query.q;

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true
    });

    const page = await browser.newPage();
    await page.goto(`https://www.pinterest.com/search/pins/?q=${query}`);

    await page.waitForTimeout(5000);

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

    res.json(pins);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Scraping failed" });
  }
});

// ✅ PORT FIX (IMPORTANT for Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));