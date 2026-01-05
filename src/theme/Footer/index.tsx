import React from 'react';
import Footer from '@theme-original/Footer';
import MythSeal from '@site/src/components/AuthorSection';

export default function FooterWrapper(props) {
    return (
        <>
            <div className="container" style={{ marginBottom: '2rem' }}>
                <MythSeal />
            </div>
            <Footer {...props} />
        </>
    );
}
