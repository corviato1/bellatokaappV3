
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./2025Harvest.css";
import { content } from '../db/content';
import { StrainSEO } from '../components/SEOHelmet';

const Harvest2025 = () => {
  const [strains] = useState(["applescotti", "gelato-33", "blue-dream", "p81"]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedNutrient, setSelectedNutrient] = useState(null);
  const [selectedPestManagement] = useState(null);
  const { strainName, section } = useParams();
  const navigate = useNavigate();

  const displayNames = useMemo(() => ({
    "applescotti": "Applescotti",
    "gelato-33": "Gelato 33",
    "blue-dream": "Blue Dream",
    "p81": "P81"
  }), []);

  // Define handleNutrientClick outside useEffect
  const handleNutrientClick = useCallback((event) => {
    const target = event.target.closest('[data-image]');
    if (target && target.classList.contains('clickable')) {
      const imageName = target.getAttribute('data-image');
      if (imageName) {
        setSelectedNutrient(imageName);
        // Scroll to top of page when item is clicked
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    // Update page title for SEO
    const strainDisplayName = displayNames[strainName] || strainName;
    const sectionDisplayName = section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ');
    document.title = `${strainDisplayName} - ${sectionDisplayName} | Bellatoka App`;

    // Update meta description based on section
    const getMetaDescription = () => {
      switch(section) {
        case 'stats':
          return `View detailed cultivation statistics for ${strainDisplayName} including planting, flowering, harvest, and cure dates.`;
        case 'nutrients':
          return `Complete nutrient feeding schedule for ${strainDisplayName} during vegetative and flowering stages.`;
        case 'pest-management':
          return `Integrated pest management solutions and treatment schedules for ${strainDisplayName} cultivation.`;
        case 'showcase':
          return `Photo gallery showcasing the growth progression of ${strainDisplayName} from seedling to harvest.`;
        default:
          return `${strainDisplayName} cultivation details including ${sectionDisplayName.toLowerCase()} information.`;
      }
    };

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', getMetaDescription());
    }

    document.addEventListener('click', handleNutrientClick);

    return () => {
      document.removeEventListener('click', handleNutrientClick);
    };
  }, [section, strainName, displayNames, handleNutrientClick]);

  const getImages = (strain) => {
    try {
      const imageList = require(`../images/strains/${strain}/index.js`).default;
      // Filter out images that don't exist to prevent console spam
      return imageList.filter(imageName => {
        try {
          require(`../images/strains/${strain}/${imageName}`);
          return true;
        } catch {
          return false;
        }
      });
    } catch (error) {
      console.error(`Error loading image list for ${strain}`);
      return [];
    }
  };

  const strainImages = getImages(strainName);

  const getNutrientImage = (imageName) => {
    try {
      return require(`../images/nutrients/${imageName}.png`);
    } catch (error) {
      console.error(`Error loading nutrient image: ${imageName}`);
      try {
        return require(`../images/nutrients/default.png`);
      } catch (defaultError) {
        console.error('Error loading default nutrient image');
        return null;
      }
    }
  };

  const getPestManagementImage = (imageName) => {
    try {
      return require(`../images/pest-management/${imageName}.png`);
    } catch (error) {
      console.error(`Error loading pest management image: ${imageName}`);
      try {
        return require(`../images/pest-management/default.png`);
      } catch (defaultError) {
        console.error('Error loading default pest management image');
        return null;
      }
    }
  };

  const handleNavigation = (direction) => {
    const currentIndex = strains.indexOf(strainName);
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % strains.length
        : (currentIndex - 1 + strains.length) % strains.length;
    navigate(`/2025-harvest/${strains[newIndex]}/${section}`);
  };

  const handleSectionChange = (newSection) => {
    navigate(`/2025-harvest/${strainName}/${newSection}`);
  };

  const handleMobileNutrientClick = (e) => {
    const nutrientEl = e.target.closest('.clickable');
    if (nutrientEl && section === 'nutrients') {
      const imageNum = nutrientEl.dataset.image;
      setSelectedNutrient(imageNum);

      // Snap to top on mobile only
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const renderDesktopNutrientsContent = () => {
    return (
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px'}}>
        <div className="nutrient-stage-container">
          <h3>Vegetative Stage</h3>
          <div className="nutrient-stage-content">
            <div className="content-item clickable" data-image="power-si" style={{fontWeight: 600}}>Power SI Potassium Silicate</div>
            <div className="content-item clickable" data-image="cocos-a">House and Garden Cocos A</div>
            <div className="content-item clickable" data-image="cocos-b">House and Garden Cocos B</div>
            <div className="content-item clickable" data-image="cal-mag">Botanicare Cal-Mag Plus</div>
            <div className="content-item clickable" data-image="diamond-nectar">General Hydroponics Diamond Nectar</div>
            <div className="content-item clickable" data-image="roots-gold">House and Garden Roots Excelurator Gold</div>
            <div className="content-item clickable" data-image="hydroguard">Botanicare Hydroguard</div>
            <div className="content-item clickable" data-image="sea-green">Primordial Solutions Sea Green</div>
            <div className="content-item clickable" data-image="liquid-karma">Botanicare Liquid Karma</div>
            <div className="content-item clickable" data-image="vitamino">Botanicare Vitamino</div>
            <div className="content-item clickable" data-image="nitrogen-boost">House and Garden Nitrogen Boost</div>
          </div>
        </div>
        <div className="nutrient-stage-container">
          <h3>Flower Stage</h3>
          <div className="nutrient-stage-content">
            <div className="content-item clickable" data-image="power-si" style={{fontWeight: 600}}>Power SI Potassium Silicate</div>
            <div className="content-item clickable" data-image="cocos-a">House and Garden Cocos A</div>
            <div className="content-item clickable" data-image="cocos-b">House and Garden Cocos B</div>
            <div className="content-item clickable" data-image="cal-mag">Botanicare Cal-Mag Plus</div>
            <div className="content-item clickable" data-image="diamond-nectar">General Hydroponics Diamond Nectar</div>
            <div className="content-item clickable" data-image="hydroguard">Botanicare Hydroguard</div>
            <div className="content-item clickable" data-image="paleo-bloom">Primordial Solutions PaleoBloom</div>
            <div className="content-item clickable" data-image="true-blooms">Primordial Solutions True Blooms</div>
            <div className="content-item clickable" data-image="hydroplex">Botanicare Hydroplex</div>
            <div className="content-item clickable" data-image="bud-xl">House and Garden Bud-XL</div>
            <div className="content-item clickable" data-image="sweet-raw">Botanicare Sweet Raw</div>
            <div className="content-item clickable" data-image="sweet">Botanicare Sweet Berry</div>
            <div className="content-item clickable" data-image="top-shooter">House and Garden Top Shooter</div>
            <div className="content-item clickable" data-image="sea-green">Primordial Solutions Sea Green</div>
          </div>
        </div>

        <div className="nutrient-stage-container">
          <h3>Images</h3>
          <div className="nutrient-stage-content">
            <div className="content-item clickable" data-image="Img_1">Img_1</div>
            <div className="content-item clickable" data-image="Img_2">Img_2</div>
            <div className="content-item clickable" data-image="Img_3">Img_3</div>
            <div className="content-item clickable" data-image="Img_4">Img_4</div>
            <div className="content-item clickable" data-image="Img_5">Img_5</div>
            <div className="content-item clickable" data-image="Img_6">Img_6</div>
            <div className="content-item clickable" data-image="Img_7">Img_7</div>
            <div className="content-item clickable" data-image="Img_8">Img_8</div>
          </div>
        </div>
      </div>
    );
  };

  const renderNutrientsContent = () => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Mobile three-column layout
      const vegetativeItems = [
        { name: 'Power SI Potassium Silicate', image: 'power-si' },
        { name: 'House and Garden Cocos A', image: 'cocos-a' },
        { name: 'House and Garden Cocos B', image: 'cocos-b' },
        { name: 'Botanicare Cal-Mag Plus', image: 'cal-mag' },
        { name: 'General Hydroponics Diamond Nectar', image: 'diamond-nectar' },
        { name: 'House and Garden Roots Excelurator Gold', image: 'roots-gold' },
        { name: 'Botanicare Hydroguard', image: 'hydroguard' },
        { name: 'Primordial Solutions Sea Green', image: 'sea-green' },
        { name: 'Botanicare Liquid Karma', image: 'liquid-karma' },
        { name: 'Botanicare Vitamino', image: 'vitamino' },
        { name: 'House and Garden Nitrogen Boost', image: 'nitrogen-boost' }
      ];

      const flowerItems = [
        { name: 'Power SI Potassium Silicate', image: 'power-si' },
        { name: 'House and Garden Cocos A', image: 'cocos-a' },
        { name: 'House and Garden Cocos B', image: 'cocos-b' },
        { name: 'Botanicare Cal-Mag Plus', image: 'cal-mag' },
        { name: 'General Hydroponics Diamond Nectar', image: 'diamond-nectar' },
        { name: 'Botanicare Hydroguard', image: 'hydroguard' },
        { name: 'Primordial Solutions PaleoBloom', image: 'paleo-bloom' },
        { name: 'Primordial Solutions True Blooms', image: 'true-blooms' },
        { name: 'Botanicare Hydroplex', image: 'hydroplex' },
        { name: 'House and Garden Bud-XL', image: 'bud-xl' },
        { name: 'Botanicare Sweet Raw', image: 'sweet-raw' },
        { name: 'Botanicare Sweet Berry', image: 'sweet' },
        { name: 'House and Garden Top Shooter', image: 'top-shooter' },
        { name: 'Primordial Solutions Sea Green', image: 'sea-green' }
      ];

      const imageItems = [
        { name: 'Img_1', image: 'Img_1' },
        { name: 'Img_2', image: 'Img_2' },
        { name: 'Img_3', image: 'Img_3' },
        { name: 'Img_4', image: 'Img_4' },
        { name: 'Img_5', image: 'Img_5' },
        { name: 'Img_6', image: 'Img_6' },
        { name: 'Img_7', image: 'Img_7' },
        { name: 'Img_8', image: 'Img_8' }
      ];

      return (
        <div className="nutrient-mobile-grid" onClick={handleMobileNutrientClick}>
          <div className="nutrient-mobile-column">
            <h4>Vegetative Stage</h4>
            {vegetativeItems.map((item, index) => (
              <div key={index} className="nutrient-mobile-item clickable" data-image={item.image}>
                {item.name}
              </div>
            ))}
          </div>
          <div className="nutrient-mobile-column">
            <h4>Flower Stage</h4>
            {flowerItems.map((item, index) => (
              <div key={index} className="nutrient-mobile-item clickable" data-image={item.image}>
                {item.name}
              </div>
            ))}
          </div>
          <div className="nutrient-mobile-column">
            <h4>Images</h4>
            {imageItems.map((item, index) => (
              <div key={index} className="nutrient-mobile-item clickable" data-image={item.image}>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      // Desktop layout
      return renderDesktopNutrientsContent();
    }
  };

  const sectionContent = content[section]?.[strainName] || `<p>Content for ${section} not available.</p>`;
  let imagePath;

  if (section === 'pest-management') {
    imagePath = require(`../images/icons/pest-management.png`);
  } else {
    imagePath = require(`../images/icons/${section}.png`);
  }

  return (
    <div className={`harvest-page ${isExpanded ? 'popup-active' : ''}`}>
      <StrainSEO 
        strainName={strainName} 
        section={section} 
        displayName={displayNames[strainName]} 
      />

      {/* Mobile Layout */}
      <div className="mobile-top-row">
        <div className="section-1">
          <div className="strain-header">
            <h1>{displayNames[strainName] || strainName}</h1>
            <div className="mobile-nav-row">
              <div className="mobile-nav-buttons">
                <button
                  className="nav-button prev"
                  onClick={() => handleNavigation("prev")}
                >
                  ‹ LAST
                </button>
                <button
                  className="nav-button next"
                  onClick={() => handleNavigation("next")}
                >
                  NEXT ›
                </button>
              </div>
            </div>
            <div className="mobile-navigation-section">
              <div className="mobile-left-nav">
                <img src={imagePath} alt={`${section} Icon`} className="mobile-chart-icon" />
                <div className="mobile-nav-buttons-vertical">
                  <button
                    className={`nav-btn ${section === "stats" ? "active" : ""}`}
                    onClick={() => handleSectionChange("stats")}
                  >
                    Stats
                  </button>
                  <button
                    className={`nav-btn ${section === "nutrients" ? "active" : ""}`}
                    onClick={() => handleSectionChange("nutrients")}
                  >
                    Nutrients
                  </button>
                  <button
                    className={`nav-btn ${section === "pest-management" ? "active" : ""}`}
                    onClick={() => handleSectionChange("pest-management")}
                  >
                    Pest<br/>Management
                  </button>
                </div>
              </div>
              <div className={`strain-carousel section-4 mobile-image-box ${section === 'stats' ? 'clickable-carousel' : ''}`} onClick={section === 'stats' ? () => setIsExpanded(true) : undefined}>
                {section === 'nutrients' ? (
                  selectedNutrient ? (
                    <img
                      src={getNutrientImage(selectedNutrient)}
                      alt={`Nutrient ${selectedNutrient}`}
                      className="strain-image active"
                      onError={(e) => {
                        console.error(`Failed to load nutrient image: ${selectedNutrient}`);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="select-nutrient-prompt">Click a nutrient to view details</div>
                  )
                ) : section === 'pest-management' ? (
                  selectedPestManagement ? (
                    <img
                      src={getPestManagementImage(selectedPestManagement)}
                      alt={`Pest Management ${selectedPestManagement}`}
                      className="strain-image active"
                      onError={(e) => {
                        console.error(`Failed to load pest management image: ${selectedPestManagement}`);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="select-nutrient-prompt">Click a pest management item to view details</div>
                  )
                ) : (
                  strainImages.map((imageName, index) => {
                    try {
                      const imagePath = require(`../images/strains/${strainName}/${imageName}`);
                      return (
                        <img
                          key={imageName}
                          src={imagePath}
                          alt={`${displayNames[strainName]} ${index + 1}`}
                          className={`strain-image ${index === currentImageIndex ? 'active' : ''}`}
                          onError={(e) => {
                            console.log(`Failed to load image: ${strainName}/${imageName}`);
                            e.target.style.display = 'none';
                          }}
                        />
                      );
                    } catch (error) {
                      console.error(`Error loading image ${imageName} for ${strainName}: ${error.message}`);
                      return null;
                    }
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="section-1">
        <div className="strain-header">
          <button
            className="nav-button prev"
            onClick={() => handleNavigation("prev")}
          >
            ‹ LAST
          </button>
          <h1>{displayNames[strainName] || strainName}</h1>
          <button
            className="nav-button next"
            onClick={() => handleNavigation("next")}
          >
            NEXT ›
          </button>
        </div>
      </div>

      <div className="section-container">
        <div className="sidebar section-2">
          <div className="mobile-section-2-content">
            <img src={imagePath} alt={`${section} Icon`} className="chart-icon" />
            <div className="navigation-buttons">
              <button
                className={`nav-btn ${section === "stats" ? "active" : ""}`}
                onClick={() => handleSectionChange("stats")}
              >
                Stats
              </button>
              <button
                className={`nav-btn ${section === "nutrients" ? "active" : ""}`}
                onClick={() => handleSectionChange("nutrients")}
              >
                Nutrients
              </button>
              <button
                className={`nav-btn ${section === "pest-management" ? "active" : ""}`}
                onClick={() => handleSectionChange("pest-management")}
              >
                Pest<br/>Management
              </button>
            </div>
          </div>
        </div>

        <div className="main-content section-3">
          <h2>
            {section
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </h2>
          {section === 'nutrients' ? renderNutrientsContent() : <div dangerouslySetInnerHTML={{ __html: sectionContent }} />}
        </div>

        <div className={`strain-carousel section-4 ${section === 'stats' ? 'clickable-carousel' : ''}`} onClick={section === 'stats' ? () => setIsExpanded(true) : undefined}>
          {section === 'nutrients' ? (
            selectedNutrient ? (
              <img
                src={getNutrientImage(selectedNutrient)}
                alt={`Nutrient ${selectedNutrient}`}
                className="strain-image active"
                onError={(e) => {
                  console.error(`Failed to load nutrient image: ${selectedNutrient}`);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="select-nutrient-prompt">Click a nutrient to view details</div>
            )
          ) : section === 'pest-management' ? (
            selectedPestManagement ? (
              <img
                src={getPestManagementImage(selectedPestManagement)}
                alt={`Pest Management ${selectedPestManagement}`}
                className="strain-image active"
                onError={(e) => {
                  console.error(`Failed to load pest management image: ${selectedPestManagement}`);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="select-nutrient-prompt">Click a pest management item to view details</div>
            )
          ) : (
            strainImages.map((imageName, index) => {
              try {
                const imagePath = require(`../images/strains/${strainName}/${imageName}`);
                return (
                  <img
                    key={imageName}
                    src={imagePath}
                    alt={`${displayNames[strainName]} ${index + 1}`}
                    className={`strain-image ${index === currentImageIndex ? 'active' : ''}`}
                    onError={(e) => {
                      console.log(`Failed to load image: ${strainName}/${imageName}`);
                      e.target.style.display = 'none';
                    }}
                  />
                );
              } catch (error) {
                console.error(`Error loading image ${imageName} for ${strainName}: ${error.message}`);
                return null;
              }
            })
          )}
        </div>
      </div>

      {/* Expanded Image Overlay */}
      <div className={`expanded-overlay ${isExpanded ? 'active' : ''}`}>
        {isExpanded && (
          <>
            <div className="expanded-controls">
              <div className="image-counter">
                {currentImageIndex + 1}/{strainImages.length}
              </div>
              <button 
                className="expanded-btn close-btn"
                onClick={() => setIsExpanded(false)}
              >
                ✕
              </button>
            </div>

            <img
              src={require(`../images/strains/${strainName}/${strainImages[currentImageIndex]}`)}
              alt={`${displayNames[strainName]} expanded`}
              className="expanded-image"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                console.error(`Failed to load expanded image: ${strainName}/${strainImages[currentImageIndex]}`);
                e.target.style.display = 'none';
              }}
            />

            <div className="expanded-nav-buttons">
              <button 
                className="expanded-btn nav-btn-expanded"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev - 1 + strainImages.length) % strainImages.length);
                }}
              >
                ‹ Last
              </button>

              <button 
                className="expanded-btn nav-btn-expanded"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev + 1) % strainImages.length);
                }}
              >
                Next ›
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Harvest2025;
