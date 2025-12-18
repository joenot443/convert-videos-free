"use client";

import { useEffect } from "react";

interface GoogleAdSenseProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const GoogleAdSense = ({
  dataAdSlot,
  dataAdFormat = "auto",
  dataFullWidthResponsive = true,
  style,
  className = "",
}: GoogleAdSenseProps) => {
  useEffect(() => {
    try {
      // Push the ad to AdSense
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          ...style,
        }}
        data-ad-client="ca-pub-4230742669769881"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive}
      />
    </div>
  );
};

export default GoogleAdSense;