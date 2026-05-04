import React, { useState } from 'react';

function Contact() {
  const [status, setStatus] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('Thanks! Your message has been submitted. We will get back to you shortly.');
    event.target.reset();
  };

  return (
    <section className="contact-page" style={{ background: '#f7f8ff', padding: '80px 0' }}>
      <div className="container">
        <div className="contact-top text-center mb-5">
          <span className="section-label">Contact Us</span>
          <h1>We’re here to help</h1>
          <p>Have a question or need assistance? Send us a message and our team will reply quickly.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-card contact-details">
            <h2>Get in touch</h2>
            <p>Our support team is available 24/7 to help you with orders, products, and account questions.</p>

            <div className="info-block">
              <h4>Email</h4>
              <p>support@foodymart.com</p>
            </div>

            <div className="info-block">
              <h4>Phone</h4>
              <p>+91 98765 43210</p>
            </div>

            <div className="info-block">
              <h4>Address</h4>
              <p>12 Market Street, Mumbai, Maharashtra</p>
            </div>
          </div>

          <div className="contact-card contact-form-card">
            <h2>Send us a message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                Name
                <input type="text" name="name" placeholder="Your name" required />
              </label>
              <label>
                Email
                <input type="email" name="email" placeholder="Your email" required />
              </label>
              <label>
                Subject
                <input type="text" name="subject" placeholder="Subject" required />
              </label>
              <label>
                Message
                <textarea name="message" placeholder="Write your message" rows="6" required />
              </label>
              <button type="submit">Submit Message</button>
              {status && <p className="status-message">{status}</p>}
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .section-label {
          display: inline-block;
          margin-bottom: 16px;
          padding: 6px 16px;
          border-radius: 999px;
          background: #e8e5ff;
          color: #6367ff;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .contact-top h1 {
          font-size: 2.75rem;
          margin: 16px 0 12px;
          color: #222;
        }

        .contact-top p {
          color: #555;
          max-width: 640px;
          margin: 0 auto;
          line-height: 1.75;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 30px;
        }

        .contact-card {
          background: white;
          padding: 36px;
          border-radius: 28px;
          box-shadow: 0 22px 60px rgba(99,103,255,0.12);
        }

        .contact-details h2,
        .contact-form-card h2 {
          margin-bottom: 16px;
          font-size: 1.75rem;
          color: #111827;
        }

        .contact-details p,
        .info-block p {
          color: #4b5563;
          line-height: 1.8;
        }

        .info-block {
          margin-top: 24px;
        }

        .info-block h4 {
          margin-bottom: 10px;
          color: #6367ff;
          font-size: 1rem;
        }

        .contact-form {
          display: grid;
          gap: 18px;
        }

        .contact-form label {
          display: flex;
          flex-direction: column;
          gap: 10px;
          color: #374151;
          font-weight: 600;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #d1d5db;
          border-radius: 16px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
          resize: vertical;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: #6367ff;
        }

        .contact-form button {
          background: #6367ff;
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .contact-form button:hover {
          background: #8494ff;
        }

        .status-message {
          margin-top: 8px;
          color: #2563eb;
          font-weight: 600;
        }

        @media (max-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .contact-top h1 {
            font-size: 2.2rem;
          }

          .contact-card {
            padding: 28px;
          }
        }
      `}</style>
    </section>
  );
}

export default Contact;
