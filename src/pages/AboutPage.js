import React from "react";
import "../styles/AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <section className="about-section">
          <h1>About Bella Toka</h1>
          <p>
            Bella Toka is a state-of-the-art indoor cannabis cultivation
            facility dedicated to producing premium quality cannabis through
            sustainable and innovative growing practices.
          </p>
          <p>
            Our track and trace system monitors every plant from seed to sale,
            ensuring complete transparency and quality control throughout the
            cultivation process.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Pillars</h2>

          <div className="process-grid">
            <div className="process-item">
              <h3>Minimal Footprint</h3>
              <ul className="pillar-list">
                <li>Pending</li>
              </ul>
            </div>

            <div className="process-item">
              <h3>In Depth Supply Chain</h3>
              <ul className="pillar-list">
                <li>Pending</li>
              </ul>
            </div>

            <div className="process-item">
              <h3>Premium Standards</h3>
              <ul className="pillar-list">
                <li>Custom terpene orders</li>
                <li>More info</li>
              </ul>
            </div>

            <div className="process-item">
              <h3>Data Utilization</h3>
              <ul className="pillar-list">
                <li>Pending</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <h2>Contact Us</h2>
          <div className="contact-container">
            <form
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent! (Demo)");
              }}
            >
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Your name" required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="Subject"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>

            <div className="contact-info">
              <h3>Get in Touch</h3>
              <p>
                Have questions about our cultivation process or interested in
                learning more?
              </p>

              <div className="info-item">
                <strong>Email:</strong>
                <span>contact@bellatoka.com</span>
              </div>

              <div className="info-item">
                <strong>Location:</strong>
                <span>Sonoma County, California</span>
              </div>

              {/* <div className="info-item">
                <strong>Links To Learn:</strong>
                <span>
                  <a
                    href="https://bellatoka.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link 1
                  </a>
                  <p> </p>
                  <a
                    href="https://bellatoka.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link 2
                  </a>
                  <p> </p>
                  <a
                    href="https://bellatoka.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link 3
                  </a>
                  <p> </p>
                  <a
                    href="https://bellatoka.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link 4
                  </a>
                  <p> </p>
                  <a
                    href="https://bellatoka.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link 5
                  </a>
                </span>
              </div> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
