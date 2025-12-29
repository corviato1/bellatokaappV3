
import React from "react";
import styled from "styled-components";
import "./PesticideList.css";

const SecureContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PDFContainer = styled.div`
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  height: 800px;
`;

const Button = styled.button`
  background: linear-gradient(145deg, #9FE7F5, #75B9E7);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s;
  margin: 20px 0;

  &:hover {
    transform: scale(1.05);
  }
`;

const PesticideList = () => {
  const pdfUrl = `${process.env.PUBLIC_URL || ''}/pesticide.pdf`;

  // Debug: Log the actual URL being used
  console.log('PDF URL:', pdfUrl);
  console.log('PUBLIC_URL:', process.env.PUBLIC_URL);

  const handleDownload = async () => {
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "pesticide-list.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  return (
    <SecureContainer>
      <h1>Pesticide List</h1>
      <PDFContainer>
        <object
          data={pdfUrl}
          type="application/pdf"
          width="100%"
          height="100%"
          onError={() => console.error('PDF object failed to load')}
        >
          {/* Fallback iframe if object fails */}
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            title="Pesticide List PDF"
          >
            <p>
              Unable to display PDF. Your browser may not support PDF viewing.
              <br />
              <strong>PDF URL:</strong> {pdfUrl}
              <br />
              <Button onClick={handleDownload}>
                Download PDF
              </Button>
            </p>
          </iframe>
        </object>
      </PDFContainer>
      <Button onClick={handleDownload}>
        Download PDF
      </Button>
    </SecureContainer>
  );
};

export default PesticideList;
