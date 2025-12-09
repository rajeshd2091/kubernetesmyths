import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function MythSeal() {
  return (
    <div
      style={{
        marginTop: "48px",
        padding: "24px",
        borderLeft: "4px solid #C89B3C", // Gold accent
        background: "var(--ifm-background-surface-color)",
        borderRadius: "12px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "flex-start",
        gap: "18px",
      }}
    >
      {/* Profile/Logo */}
      <img
        src={useBaseUrl('/img/themythologist.png')}
        alt="The Kubernetes Mythologist"
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #C89B3C",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      />

      {/* Text */}
      <div style={{ flex: 1 }}>
        <strong
          style={{
            fontSize: "1.05rem",
            color: "var(--ifm-font-color-base)",
          }}
        >
          ✓ Debunked & Authored by <span style={{ color: "#C89B3C" }}>Rajesh Deshpande, The Kubernetes Mythologist</span>
        </strong>

        <div
          style={{
            marginTop: "4px",
            fontStyle: "italic",
            opacity: 0.85,
          }}
        >
          Where Kubernetes truths are uncovered — one misconception at a time.
        </div>

        <div style={{ marginTop: "10px" }}>
          <Link
            to="/the-kubernetes-mythologist"
            style={{
              fontWeight: "600",
              textDecoration: "none",
              color: "#C89B3C",
            }}
          >
            → Meet the Mythologist
          </Link>
        </div>
      </div>
    </div>
  );
}
