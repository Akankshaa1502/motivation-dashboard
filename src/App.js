import { useEffect, useState } from "react";
import "./App.css";

export default function MotivationDashboard() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [likedQuotes, setLikedQuotes] = useState(() => {
    const saved = localStorage.getItem("likedQuotes");
    return saved ? JSON.parse(saved) : [];
  });

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.quotable.io/random");
      if (!res.ok) throw new Error("Primary failed");
      const data = await res.json();
      setQuote(data.content);
      setAuthor(data.author);
    } catch {
      try {
        const res2 = await fetch("https://dummyjson.com/quotes/random");
        const data2 = await res2.json();
        setQuote(data2.quote);
        setAuthor(data2.author);
      } catch {
        setQuote("Unable to fetch quote.");
        setAuthor("");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    localStorage.setItem("likedQuotes", JSON.stringify(likedQuotes));
  }, [likedQuotes]);

  const toggleLike = () => {
    const exists = likedQuotes.find((q) => q.quote === quote);
    if (exists) {
      setLikedQuotes(likedQuotes.filter((q) => q.quote !== quote));
    } else {
      setLikedQuotes([...likedQuotes, { quote, author }]);
    }
  };

  const isLiked = likedQuotes.some((q) => q.quote === quote);

  return (
    <div className="container app-container">
      <div className="card glass">
        <h1 className="title">🌸 Daily Motivation</h1>

        {loading ? (
          <p className="loading">Fetching your quote...</p>
        ) : (
          <>
            <p className="quote fancy-text">"{quote}"</p>
            <p className="author">– {author}</p>
          </>
        )}

        <div className="btn-row">
          <button
            onClick={fetchQuote}
            disabled={loading}
            className="btn new hover-effect"
          >
            New Quote
          </button>

          <button
            onClick={toggleLike}
            className="btn like hover-effect"
          >
            {isLiked ? "💔 Unlike" : "❤️ Like"}
          </button>
        </div>

        <p className="liked-count">❤️ Liked: {likedQuotes.length}</p>
      </div>

      <div className="liked-box">
        <h2 className="subtitle">Liked Quotes</h2>

        {likedQuotes.length === 0 ? (
          <p className="empty">No liked quotes yet.</p>
        ) : (
          <ul>
            {likedQuotes.map((q, i) => (
              <li key={i} className="liked-card glass">
                <p>"{q.quote}"</p>
                <p className="small">– {q.author}</p>

                <button
                  className="btn new hover-effect"
                  onClick={() => {
                    navigator.clipboard.writeText(q.quote);
                    alert("Copied!");
                  }}
                >
                  📋 Copy
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}