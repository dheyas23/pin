const express = require("express");
const cors = require("cors");

const app = express();

// CORS fix
app.use(cors({ origin: "*" }));

// Home route
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// 🔥 FIXED SEARCH ROUTE (no scraping = no error)
app.get("/search", (req, res) => {
  const query = req.query.q || "idea";

  const data = [
    {
      title: `Easy ${query} Idea`,
      image: "https://via.placeholder.com/200?text=Pin+1"
    },
    {
      title: `Best ${query} Tips`,
      image: "https://via.placeholder.com/200?text=Pin+2"
    },
    {
      title: `${query} for Beginners`,
      image: "https://via.placeholder.com/200?text=Pin+3"
    },
    {
      title: `Creative ${query} Ideas`,
      image: "https://via.placeholder.com/200?text=Pin+4"
    }
  ];

  res.json(data);
});

// Port fix (Render ke liye)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));