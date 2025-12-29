import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <section className="about-section">
          <h1>About Bella Toka</h1>
          <p>
            Bella Toka is a state-of-the-art indoor cannabis cultivation facility 
            dedicated to producing premium quality cannabis through sustainable and 
            innovative growing practices.
          </p>
          <p>
            Our track and trace system monitors every plant from seed to sale, 
            ensuring complete transparency and quality control throughout the 
            cultivation process.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Process</h2>
          <div className="process-grid">
            <div className="process-item">
              <h3>Vegetative (V1-V4)</h3>
              <p>Plants develop strong root systems and foliage over 4 weeks.</p>
            </div>
            <div className="process-item">
              <h3>Flowering (F1-F10)</h3>
              <p>10 weeks of carefully controlled flowering for optimal bud development.</p>
            </div>
            <div className="process-item">
              <h3>Hanging (H1-H2)</h3>
              <p>Harvested plants are hung to dry in controlled conditions.</p>
            </div>
            <div className="process-item">
              <h3>Curing (C1-C9)</h3>
              <p>Final curing stage to develop flavor and potency profiles.</p>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <h2>Contact Us</h2>
          <div className="contact-container">
            <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Message sent! (Demo)'); }}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" placeholder="Subject" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="5" placeholder="Your message..." required></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
            <div className="contact-info">
              <h3>Get in Touch</h3>
              <p>Have questions about our cultivation process or interested in learning more?</p>
              <div className="info-item">
                <strong>Email:</strong>
                <span>info@bellatoka.com</span>
              </div>
              <div className="info-item">
                <strong>Location:</strong>
                <span>Indoor Cultivation Facility</span>
              </div>
              <div className="info-item">
                <strong>Hours:</strong>
                <span>By Appointment Only</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
