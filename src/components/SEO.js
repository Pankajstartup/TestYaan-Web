import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, path, testsData = [] }) => {
  const siteUrl = "https://www.testyaan.online";
  const fullUrl = path ? `${siteUrl}${path}` : siteUrl;

  // 1. HAR TEST KE LIYE DYNAMIC KEYWORDS GENERATION
  // Ye logic har test ke naam ke saath "Cheap", "Discount", "Compare" jod dega
  const dynamicTestKeywords = testsData.length > 0 
    ? testsData.map(t => 
        `${t['Test Name']} cheap price, ${t['Test Name']} discount Delhi, Compare ${t['Test Name']} cost NCR, Best ${t['Test Name']} lab Tuglakabad`
      ).join(', ')
    : "CBC test discount, Vitamin D cheap price, Thyroid profile compare Delhi NCR";

  // 2. MAIN KEYWORDS LIST
  const mainKeywords = `TestYaan, Lab tests Delhi NCR, Home sample collection Delhi, Lowest price lab tests, NABL labs comparison, ${dynamicTestKeywords}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title ? `${title} | TestYaan` : "TestYaan | Lowest Price Lab Tests & Health Packages in Delhi"}</title>
      <meta name="description" content={description || "Compare & Book Lab Tests at lowest prices. Get huge discounts on CBC, KFT, LFT, and Full Body Checkups with expert home collection in Delhi NCR."} />
      <meta name="keywords" content={mainKeywords} />

      {/* Google Ranking & Trust Tags */}
      <link rel="canonical" href={fullUrl} />
      <meta name="geo.region" content="IN-DL" />
      <meta name="geo.placename" content="Tuglakabad, New Delhi" />
      
      {/* Social Media Tags */}
      <meta property="og:title" content={title || "TestYaan - Cheap Lab Tests & Packages"} />
      <meta property="og:description" content="Save up to 70% on lab tests. Compare prices from top NABL labs and book home collection." />
      <meta property="og:url" content={fullUrl} />
      
      {/* Robots Instruction */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default SEO;