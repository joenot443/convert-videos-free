'use client';

import Script from 'next/script';
import { useSyncExternalStore } from 'react';

// Measurement IDs for different domains
const GA_IDS = {
  convert: 'G-HZRLNG135W', // convertvideosfree.com
  crop: 'G-2BVFWM6EXC', // cropvideosfree.com
};

const subscribeToNothing = () => () => {};

export default function GoogleAnalytics() {
  // The hostname is only known in the browser, so nothing renders on the server.
  const measurementId = useSyncExternalStore(
    subscribeToNothing,
    () => (window.location.hostname.includes('cropvideosfree') ? GA_IDS.crop : GA_IDS.convert),
    () => null
  );

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
