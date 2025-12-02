import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function AuthorSection() {
  return (
    <div className={styles.authorBox}>
      <img
        src="/img/author.jpg"
        alt="Rajesh Deshpande"
        className={styles.authorImage}
      />

      <div>
        <h3 className={styles.authorTitle}>About the Author</h3>
        <p className={styles.authorBio}>
          I’m <strong>Rajesh Deshpande</strong>, a Platform Engineer and DevSecOps
          practitioner working deeply with Kubernetes, Go, and supply chain security.
          I write Kubernetes Myths to stop misinformation through proofs,
          experiments, and real-world validation.
        </p>

        <div className={styles.socialLinks}>
          <Link to="https://www.linkedin.com/in/rajesh-deshpande-1058b9151/" target="_blank">LinkedIn</Link>
          <Link to="https://github.com/rajeshd2091" target="_blank">GitHub</Link>
    
        </div>
      </div>
    </div>
  );
}
