// import { nanoid } from "nanoid";
// import Url from "../models/Url.js";

// // @desc    Create a short URL
// // @route   POST /api/url/shorten
// export const shortenUrl = async (req, res) => {
//     console.log("req recieved for url shortening",req)
//   try {
//     const { originalUrl } = req.body;

//     if (!originalUrl) {
//       return res.status(400).json({ message: "Original URL is required" });
//     }

//     // Generate unique shortId
//     const shortId = nanoid(6);

//     // Save in DB
//     const newUrl = await Url.create({ shortId, originalUrl });

//     return res.status(201).json({
//       shortUrl: `${process.env.BASE_URL || "http://localhost:5000"}/api/url/${shortId}`,
//       originalUrl: newUrl.originalUrl,
//     });
//   } catch (error) {
//     console.error("Error shortening URL:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // @desc    Redirect to original URL
// // @route   GET /api/url/:shortId
// export const redirectUrl = async (req, res) => {
//   try {
//     const { shortId } = req.params;

//     const urlEntry = await Url.findOne({ shortId });

//     if (!urlEntry) {
//       return res.status(404).json({ message: "URL not found" });
//     }

//     // Increment clicks count
//     urlEntry.clicks++;
//     await urlEntry.save();

//     return res.redirect(urlEntry.originalUrl);
//   } catch (error) {
//     console.error("Error redirecting:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
import { nanoid } from "nanoid";
import Url from "../models/Url.js";

// @desc    Create short URL with expiry
export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, timeframe=30 } = req.body; // timeframe in minutes/hours/days

    if (!originalUrl || !timeframe) {
      return res.status(400).json({ message: "Original URL and timeframe are required" });
    }

    // Calculate expiry time
    const now = new Date();
    const expiresAt = new Date(now.getTime() + timeframe * 60 * 1000); // timeframe in minutes

    const shortId = nanoid(6);

    const newUrl = await Url.create({
      shortId,
      originalUrl,
      expiresAt,
    });
    res.log(`Short URL created: ${shortId} -> ${originalUrl} (expires in ${timeframe} mins)`);
    return res.status(201).json({
      shortUrl: `${process.env.BASE_URL || "http://localhost:5000"}/api/url/${shortId}`,
      originalUrl: newUrl.originalUrl,
      expiresAt: newUrl.expiresAt,
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Redirect with expiry check
export const redirectUrl = async (req, res) => {
  try {
    const { shortId } = req.params;
    const urlEntry = await Url.findOne({ shortId });

    if (!urlEntry){
     res.log(`Attempted access to invalid shortId: ${shortId}`);
   
     return res.status(404).json({ message: "URL not found" });
    } 

    // Check expiry
    if (new Date() > urlEntry.expiresAt) {
     res.log(`Expired link accessed: ${shortId}`);
      return res.status(410).json({ message: "URL expired" }); // 410 Gone
    }

    urlEntry.clicks++;
    await urlEntry.save();
    res.log(`Redirected to: ${entry.originalUrl}`);
    return res.redirect(urlEntry.originalUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({ message: "Server error" });
  }
};
