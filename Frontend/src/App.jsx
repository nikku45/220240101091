
import './App.css'
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [timeframe, setTimeframe] = useState(""); // minutes
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    if (!originalUrl || !timeframe) {
      setError("Please enter both URL and timeframe");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/url/shorten", {
        originalUrl,
        timeframe, // in minutes
      });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again!");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h1>🔗 URL Shortener with Expiry</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter your long URL here"
          style={{
            width: "80%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        />
        <br />
        <input
          type="number"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          placeholder="Expiry (minutes)"
          style={{
            width: "80%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        />
        <br />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Shorten URL
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {shortUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>✅ Short URL generated:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
