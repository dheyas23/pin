const express = require("express");
const cors = require("cors");
const { getPins } = require("./scraper");

const app = express();
app.use(cors());

app.get("/search", async (req, res) => {
  const query = req.query.q;
  const data = await getPins(query);
  res.json(data);
});

app.listen(3000, () => console.log("Server running"));