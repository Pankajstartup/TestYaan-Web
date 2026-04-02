import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, path, keywords }) => {
  const siteName = "TestYaan";
  const fullTitle = `${title} | ${siteName}`;
  const url = `https://testyaan.com${path || ""}`;
  const defaultDescription = "Book lab tests online from top NABL accredited labs in Delhi NCR. Get reports in 6-12 hours at best prices.";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || "lab tests, pathology, blood test at home, AIIMS Delhi, NABL labs"} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content="https://testyaan.com/og-image.jpg" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />

      {/* Robot Tags - Google ko batane ke liye ki index kare */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default SEO;