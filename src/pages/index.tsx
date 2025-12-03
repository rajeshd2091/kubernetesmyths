import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import styles from './index.module.css';

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Kubernetes Myths"
      description="Debunking Kubernetes misconceptions with proofs, experiments, and real-world validation."
    >
  
<header
  style={{
    padding: "6rem 1rem",
    textAlign: "center",
    background: "linear-gradient(180deg, #ffffff 0%, #f3f7fc 100%)",
  }}
>
  <div className="container">
     <img
          src="/img/kubernetesmyths.png"   // ← put your logo here
          alt="Kubernetes Myths Logo"
          className={styles.heroLogo}
        />

    {/* TITLE */}
    <h1 className={styles.heroTitle} style={{
  fontSize: "3.8rem",
  fontWeight: 800,
  marginBottom: "1.2rem",
  background: "linear-gradient(90deg, #0052cc, #2684ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
      Kubernetes Myths
    </h1>

    {/* SHORT SUBTITLE */}
    <p className={styles.heroSubtitle} 
      style={{
        fontSize: "1.45rem",
        maxWidth: "780px",
        margin: "0.5rem auto 0 auto",
        lineHeight: "1.7",
        color: "#333",
      }}
    >
      Debunking Kubernetes misconceptions with proofs, experiments, and real-world validation.
    </p>

    {/* CTA BUTTONS */}
    <div className={styles.heroButtons}  style={{ marginTop: "2.5rem" }}>
      <Link
        className="button button--primary button--lg margin-right--md"
        style={{ padding: "0.9rem 2rem", fontSize: "1.1rem", borderRadius: "8px" }}
        to="/architecture-myths/overview"
      >
        Explore Myths
      </Link>

      <Link
        className="button button--secondary button--lg"
        style={{
          padding: "0.9rem 2rem",
          fontSize: "1.1rem",
          borderRadius: "8px",
          border: "1px solid #0052cc",
        }}
        to="https://github.com/kubernetes-myths/website"
      >
        GitHub Repo
      </Link>
    </div>
{/* VISITOR COUNTER - PLACE IT HERE */}
<div
  style={{
    marginTop: "2rem",
    display: "inline-block",
    padding: "0.8rem 1.4rem",
    borderRadius: "10px",
    background: "#f0f4ff",
    border: "1px solid #d0ddff",
  }}
>
    
 <span style={{ fontSize: "0.95rem", color: "#4a4a4a" }}>
    Total Visitors:
  </span>
   <img src="https://hitwebcounter.com/counter/counter.php?page=20281476&style=0011&nbdigits=6&type=page&initCount=100" title="Counter Widget" Alt="Visit counter For Websites" 
     border="0"
         style={{
      height: "22px",
      verticalAlign: "middle",
      marginLeft: "6px",
    }}
     />
</div>
  </div>
</header>



      {/* WHY SECTION */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontSize: "2.2rem", fontWeight: 700 }}>
            Why Kubernetes Myths Spread
          </h2>

          <p
            style={{
              textAlign: "center",
              maxWidth: "800px",
              margin: "1rem auto",
              fontSize: "1.2rem",
              lineHeight: "1.7",
            }}
          >
            Most Kubernetes misunderstandings come from outdated blogs,
            oversimplified diagrams, interview shortcuts, and “heard it
            somewhere” knowledge. This project validates everything with real
            code, YAML, logs, and Kubernetes source truth.
          </p>
        </div>
      </section>

      {/* FEATURED MYTHS SECTION */}
    {/*  <section style={{ padding: "4rem 0", background: "#f9f9f9" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontSize: "2.2rem", fontWeight: 700 }}>
            Most Popular Myths
          </h2>

          <div className="row" style={{ marginTop: "2rem" }}>
            {[
              {
                title: "Myth: Kubernetes Scheduler Considers Limits",
                link: "/docs/myths/scheduler-considers-limits",
              },
              {
                title: "Myth: Persistent Volumes Can Be Resized",
                link: "/docs/myths/pv-resize",
              },
              {
                title: "Myth: Only One Default StorageClass Allowed",
                link: "/docs/myths/default-sc",
              },
            ].map((myth, idx) => (
              <div key={idx} className="col col--4 margin-bottom--lg">
                <div className="card shadow--md" style={{ height: "100%" }}>
                  <div className="card__body">
                    <h3 style={{ fontSize: "1.3rem" }}>{myth.title}</h3>
                    <p>
                      A quick breakdown of why this myth exists — and the real
                      Kubernetes behavior with experiments.
                    </p>
                    <Link className="button button--primary button--sm" to={myth.link}>
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> 
      */}

      {/* ABOUT SECTION 
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontSize: "2.2rem", fontWeight: 700 }}>
            About This Project
          </h2>

          <p
            style={{
              maxWidth: "800px",
              margin: "1rem auto",
              textAlign: "center",
              fontSize: "1.2rem",
              lineHeight: "1.7",
            }}
          >
            Kubernetes Myths is an open project by <strong>Rajesh
            Deshpande</strong> to bring clarity, correctness, and real technical
            truth to the Kubernetes community.  
            No theory. No fluff. Only real experiments and validated behavior.
          </p>

  
        </div>
      </section>*/}

      {/* FOOTER CTA */}
      <section style={{ background: "#1a1a1a", padding: "4rem 0", color: "#fff" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>
            Stop believing. Start understanding.
          </h2>
          <p style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
            Explore the myths and strengthen your Kubernetes fundamentals.
          </p>

          <Link
            className="button button--primary button--lg"
            to="/architecture-myths/overview"
            style={{ marginTop: "1.5rem" }}
          >
            Start Reading →
          </Link>
        </div>
      </section>
    </Layout>
  );
}
