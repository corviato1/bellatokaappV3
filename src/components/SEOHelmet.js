import { useEffect } from 'react';

const SEOHelmet = ({ 
  title = "Bellatoka App - Cannabis Cultivation Management",
  description = "Professional cannabis cultivation tracking, nutrient management, and pest control solutions.",
  keywords = "cannabis cultivation, hydroponic nutrients, pest management, grow tracking",
  canonical = "https://bellatoka.app",
  structuredData = null
}) => {

  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);

      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', canonical, true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:url', canonical, true);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // Add structured data if provided
    if (structuredData) {
      let structuredDataScript = document.querySelector('script[type="application/ld+json"][data-react-seo]');
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.setAttribute('type', 'application/ld+json');
        structuredDataScript.setAttribute('data-react-seo', 'true');
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(structuredData);
    }

  }, [title, description, keywords, canonical, structuredData]);

  return null; // This component doesn't render anything
};

const StrainSEO = ({ strainName, section, displayName }) => {
  useEffect(() => {
    const sectionDisplayName = section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ');
    const title = `${displayName || strainName} - ${sectionDisplayName} | Bellatoka App`;

    const getDescription = () => {
      switch(section) {
        case 'stats':
          return `View detailed cultivation statistics for ${displayName || strainName} including planting, flowering, harvest, and cure dates. Track your cannabis grow cycle with Bellatoka App.`;
        case 'nutrients':
          return `Complete nutrient feeding schedule for ${displayName || strainName} during vegetative and flowering stages. Professional hydroponic nutrient management.`;
        case 'pest-management':
          return `Integrated pest management solutions and treatment schedules for ${displayName || strainName} cultivation. Organic pest control methods.`;
        case 'showcase':
          return `Photo gallery showcasing the growth progression of ${displayName || strainName} from seedling to harvest. Cannabis cultivation timeline.`;
        default:
          return `${displayName || strainName} cultivation details including ${sectionDisplayName.toLowerCase()} information for professional cannabis growing.`;
      }
    };

    const keywords = `${strainName}, ${displayName || strainName}, cannabis cultivation, ${section}, grow tracking, bellatoka app, marijuana growing, hydroponic nutrients`;
    const canonical = `https://bellatoka.app/2025-harvest/${strainName}/${section}`;

    // Create structured data for strain pages
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": getDescription(),
      "url": canonical,
      "author": {
        "@type": "Organization",
        "name": "Bellatoka App"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Bellatoka App",
        "url": "https://bellatoka.app"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonical
      }
    };

    // Update document
    document.title = title;

    const updateMetaTag = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);

      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMetaTag('description', getDescription());
    updateMetaTag('keywords', keywords);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', getDescription(), true);
    updateMetaTag('og:url', canonical, true);

    // Update canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // Add structured data
    let structuredDataScript = document.querySelector('script[type="application/ld+json"][data-strain-seo]');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.setAttribute('type', 'application/ld+json');
      structuredDataScript.setAttribute('data-strain-seo', 'true');
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);

  }, [strainName, section, displayName]);

  return null;
};

export default SEOHelmet;
export { StrainSEO };