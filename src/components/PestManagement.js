
import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
`;

const ImageContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const PestManagement = ({ strain }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const getPestImage = (imageName) => {
    try {
      return require(`../images/pest-management/${imageName}.png`);
    } catch (error) {
      console.error(`Error loading pest management image: ${imageName}`);
      return require('../images/pest-management/default.png');
    }
  };

  return (
    <Container>
      <h1>Pest Management</h1>
      <ImageContainer>
        <Image
          src={selectedImage ? getPestImage(selectedImage) : getPestImage('default')}
          alt={`Pest management ${selectedImage || 'default'}`}
          onError={(e) => {
            console.error(`Failed to load image: ${selectedImage}`);
            e.target.src = getPestImage('default');
          }}
        />
      </ImageContainer>
    </Container>
  );
};

export default PestManagement;
