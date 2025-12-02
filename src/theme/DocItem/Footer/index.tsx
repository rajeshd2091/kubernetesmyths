import React from 'react';
import OriginalFooter from '@theme-original/DocItem/Footer';
import Giscus from '@giscus/react';
import AuthorSection from '@site/src/components/AuthorSection';

export default function FooterWrapper(props) {
  return (
    <>
       <AuthorSection />
      <OriginalFooter {...props} />

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e5e5' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem' }}>Share Your Feedback</h3>

        <Giscus
          repo="kubernetes-myths/website"
          repoId="R_kgDOPVHa4Q"
          category="kubernetes-myths Feedback"
          categoryId="DIC_kwDOPVHa4c4CzSdD"
          mapping="pathname"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme="preferred_color_scheme"
          lang="en"
          loading="lazy"
        />
      </div>
    </>
  );
}
