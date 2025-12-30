const strainImageContexts = {
  applescotti: require.context('../images/strains/applescotti', false, /\.(png|jpg|jpeg)$/i),
  'blue-dream': require.context('../images/strains/blue-dream', false, /\.(png|jpg|jpeg)$/i),
  'gelato-33': require.context('../images/strains/gelato-33', false, /\.(png|jpg|jpeg)$/i),
  p81: require.context('../images/strains/p81', false, /\.(png|jpg|jpeg)$/i),
};

export const getStrainImages = (strain) => {
  const context = strainImageContexts[strain];
  if (!context) return [];
  
  return context.keys().map(key => ({
    filename: key.replace('./', ''),
    src: context(key)
  }));
};

export const getStrainImage = (strain, filename) => {
  const context = strainImageContexts[strain];
  if (!context) return null;
  
  try {
    return context(`./${filename}`);
  } catch {
    return null;
  }
};
