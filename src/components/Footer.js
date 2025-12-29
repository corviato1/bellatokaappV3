import React from "react";
import "../styles/footer.css";

const links = [
  {
    url: "https://bellatoka.app/under-construction",
    imageSrc: "/images/footer/enterprise.png",
    altText: "Enterprise Login"
  },
  {
    url: "https://bellatoka.app/under-construction",
    imageSrc: "/images/footer/user.png",
    altText: "User Login"
  },
  {
    url: "https://github.com/corviato1/bellatokaapp",
    imageSrc: "/images/footer/github.png",
    altText: "GitHub Repository"
  }
];

const Footer = () => (
  <div className="footer-container">
    {links.map((link, index) => (
      <a
        key={index} 
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={link.imageSrc}
          alt={link.altText}
          title={link.altText}
          className="footer-icon"
        />
      </a>
    ))}
  </div>
);

export default Footer;