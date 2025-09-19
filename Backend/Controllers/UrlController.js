import { nanoid } from "nanoid";
import Url from "../models/Url.js";

// @desc    Create a short URL
// @route   POST /api/url/shorten
export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "Original URL is required" });
    }

    // Generate unique shortId
    const shortId = nanoid(6);

    // Save in DB
    const newUrl = await Url.create({ shortId, originalUrl });

    return res.status(201).json({
      shortUrl: `${process.env.BASE_URL || "http://localhost:5000"}/api/url/${shortId}`,
      originalUrl: newUrl.originalUrl,
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Redirect to original URL
// @route   GET /api/url/:shortId
export const redirectUrl = async (req, res) => {
  try {
    const { shortId } = req.params;

    const urlEntry = await Url.findOne({ shortId });

    if (!urlEntry) {
      return res.status(404).json({ message: "URL not found" });
    }

    // Increment clicks count
    urlEntry.clicks++;
    await urlEntry.save();

    return res.redirect(urlEntry.originalUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({ message: "Server error" });
  }
};
