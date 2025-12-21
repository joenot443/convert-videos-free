'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

// Measurement IDs for different domains
const GA_IDS = {
  convert: 'G-HZRLNG135W',  // convertvideosfree.com
  crop: 'G-2BVFWM6EXC',     // cropvideosfree.com
};

export default function GoogleAnalytics() {
  const [measurementId, setMeasurementId] = useState<string | null>(null);

  useEffect(() => {
    // Determine which GA ID to use based on hostname
    const hostname = window.location.hostname;
    if (hostname.includes('cropvideosfree')) {
      setMeasurementId(GA_IDS.crop);
    } else {
      setMeasurementId(GA_IDS.convert);
    }
  }, []);

  // Don't render until we know which ID to use
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}