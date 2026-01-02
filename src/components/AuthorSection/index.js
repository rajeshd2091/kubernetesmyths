import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function MythSeal() {
  return (
    <div
      style={{
        marginTop: "48px",
        padding: "24px",
        borderLeft: "5px solid var(--ifm-color-primary)", // Theme Green
        background: "var(--ifm-background-surface-color)",
        borderRadius: "12px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "32px" }}>


        <AuthorGroup header="Authored and Debunked By">
          <AuthorProfile
            name="Rajesh Deshpande"
            title="Kubernetes Mythologist"
            img="/img/themythologist.png"
            link="/the-kubernetes-mythologist"
            description="Cloud-Native Platform Architect"
          />
        </AuthorGroup>


        <AuthorGroup header="Reviewed and Verified By">
          <AuthorProfile
            name="Snehal Joshi"
            title="Kubernetes Mythicist"
            img="/img/Mythicist.jpeg"
            link="/the-kubernetes-mythicist"
            description="Cloud-Native Architect (DevOps)"
          />
        </AuthorGroup>

      </div>
    </div>
  );
}

function AuthorGroup({ header, children }) {
  return (
    <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{
        fontSize: "0.85rem",
        textTransform: "uppercase",
        fontWeight: "700",
        letterSpacing: "0.05em",
        color: "var(--ifm-color-emphasis-600)",
        borderBottom: "1px solid var(--ifm-color-emphasis-200)",
        paddingBottom: "8px"
      }}>
        {header}
      </div>
      {children}
    </div>
  );
}

function AuthorProfile({ name, title, img, link, description }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
      <img
        src={useBaseUrl(img)}
        alt={name}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid var(--ifm-color-primary)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <strong style={{ fontSize: "1.05rem", color: "var(--ifm-font-color-base)" }}>
          {name}
        </strong>
        <span style={{ fontSize: "0.85rem", color: "var(--ifm-color-primary)", fontWeight: "600", marginBottom: "4px" }}>
          {title}
        </span>
        <div style={{ fontSize: "0.9rem", opacity: 0.85, lineHeight: "1.4" }}>
          {description}
        </div>
        {link && link !== "#" && (
          <Link to={link} style={{ marginTop: "6px", fontSize: "0.85rem", fontWeight: "600", textDecoration: "none" }}>
            More →
          </Link>
        )}
      </div>
    </div>
  );
}
