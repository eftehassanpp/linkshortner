const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Url = require("./models/Url");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "originalUrl is required" });

  const newUrl = new Url({ url });
  await newUrl.save();

  res.json({ shortUrl: `${process.env.BASE_URL}/${newUrl._id}` });
});

app.get("/:id", async (req, res) => {
  try {
    const entry = await Url.findById(req.params.id);
    console.log(entry);
    if (entry) res.redirect(entry.url);
    else res.status(404).json({ error: "Short URL not found" });
  } catch (e) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});
app.get("/", async (req, res) => {
  res.json({ message: "HTTP Method POST only" });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
