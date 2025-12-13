import React, { useEffect } from "react";
import OriginalFooter from "@theme-original/DocItem/Footer";

export default function FooterWrapper(props) {
  useEffect(() => {
    console.log("🔥 Footer JS Loaded via useEffect");

    const api = "https://k8s-myth-feedback.rajeshd2091.workers.dev";
    const page = window.location.pathname;

    const upBtn = document.getElementById("thumbs-up");
    const downBtn = document.getElementById("thumbs-down");
    const upCount = document.getElementById("count-up");
    const downCount = document.getElementById("count-down");

    if (!upBtn || !downBtn) {
      console.warn("⚠ Feedback elements not found on this page");
      return;
    }

    // 1️⃣ Load existing counts
    fetch(`${api}?page=${encodeURIComponent(page)}`)
      .then(res => res.json())
      .then(data => {
        upCount.textContent = data.up;
        downCount.textContent = data.down;
      });

    // 2️⃣ Upvote
    upBtn.onclick = () => {
      fetch(`${api}?page=${encodeURIComponent(page)}&type=up`, { method: "POST" })
        .then(res => res.json())
        .then(d => upCount.textContent = d.count);
    };

    // 3️⃣ Downvote
    downBtn.onclick = () => {
      fetch(`${api}?page=${encodeURIComponent(page)}&type=down`, { method: "POST" })
        .then(res => res.json())
        .then(d => downCount.textContent = d.count);
    };

  }, []); // Runs once on mount

  return (
    <>
      <OriginalFooter {...props} />

   {/* Feedback UI */}
<div style={{
  marginTop: "50px",
  padding: "20px",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  textAlign: "center",
  background: "#fafafa"
}}>
  <div style={{ fontSize: "1rem", fontWeight: 600 }}>
    Was this Myth helpful?
  </div>

  <div id="feedback" style={{ marginTop: "12px" }}>
    <button id="thumbs-up" style={{
      fontSize: "22px",
      padding: "6px 10px",
      cursor: "pointer"
    }}>👍</button>

    <span id="count-up" style={{ marginLeft: "6px", marginRight: "20px" }}>0</span>

    <button id="thumbs-down" style={{
      fontSize: "22px",
      padding: "6px 10px",
      cursor: "pointer"
    }}>👎</button>

    <span id="count-down" style={{ marginLeft: "6px" }}>0</span>
  </div>
</div>
    </>
  );
}
