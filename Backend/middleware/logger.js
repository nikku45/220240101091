// middleware/logger.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, "../logs");
const logFile = path.join(logsDir, "app.log");

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export const logger = (req, res, next) => {
  const log = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | IP: ${req.ip}\n`;

  fs.appendFile(logFile, log, (err) => {
    if (err) console.error("Error writing log file:", err);
  });

  res.log = (message) => {
    const customLog = `${new Date().toISOString()} | ${message}\n`;
    fs.appendFile(logFile, customLog, (err) => {
      if (err) console.error("Error writing custom log:", err);
    });
  };

  next();
};
