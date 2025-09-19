import express from "express";
import { shortenUrl, redirectUrl } from "../Controllers/UrlController.js";

const router = express.Router();

router.post("/shorten", shortenUrl);   // POST: Shorten URL
router.get("/:shortId", redirectUrl);  // GET: Redirect to original

export default router;
