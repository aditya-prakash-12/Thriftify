import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <footer className="main-footer py-5">
        <div className="container-fluid">
          <div className="row gy-4">

            {/* LOGO + SOCIAL */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-brand">
                <img src="images/logo.png" alt="logo" className="mb-4" />
                <p className="footer-desc">
                  Fresh groceries and quality products delivered at your
                  doorstep. Shop smarter with Foodmart.
                </p>

                <div className="social-links mt-4">
                  <ul className="d-flex list-unstyled gap-3">
                   <li>
                  <a href="#" className="social-icon">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>

                <li>
                  <a href="#" className="social-icon">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>

                <li>
                  <a href="#" className="social-icon">
                    <i className="fab fa-youtube"></i>
                  </a>
                </li>

                <li>
                  <a href="#" className="social-icon">
                    <i className="fab fa-instagram"></i>
                  </a>
                </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* COLUMN 1 */}
            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="footer-title">Company</h6>
              <ul className="footer-links list-unstyled">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Affiliate</a></li>
              </ul>
            </div>

            {/* COLUMN 2 */}
            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="footer-title">Support</h6>
              <ul className="footer-links list-unstyled">
                <li><a href="#">FAQ</a></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>

            {/* COLUMN 3 */}
            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="footer-title">Services</h6>
              <ul className="footer-links list-unstyled">
                <li><a href="#">Delivery Info</a></li>
                <li><a href="#">Terms & Conditions</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>

            {/* COLUMN 4 */}
            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="footer-title">Explore</h6>
              <ul className="footer-links list-unstyled">
                <li><a href="#">Groceries</a></li>
                <li><a href="#">Offers</a></li>
                <li><a href="#">Best Sellers</a></li>
              </ul>
            </div>

          </div>
        </div>
      </footer>

      {/* FOOTER BOTTOM */}
      <div className="footer-bottom py-3">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0">© 2026 Foodmart. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0">Designed by Adii with ❤️</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`

        .main-footer {
          background: #f8fafc;
          border-top: 1px solid #eaeaea;
        }

        .footer-desc {
          color: #666;
          font-size: 14px;
          max-width: 280px;
        }

        .footer-title {
          font-weight: 600;
          margin-bottom: 15px;
          color: #222;
        }

        .footer-links li {
          margin-bottom: 8px;
        }

        .footer-links a {
          text-decoration: none;
          color: #666;
          font-size: 14px;
          transition: 0.3s ease;
        }

        .footer-links a:hover {
          color: #2e7d6b;
          padding-left: 4px;
        }

        .social-icon {
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: white;
          border: 1px solid #ddd;
          color: #333;
          text-decoration: none;
          font-size: 14px;
          transition: 0.3s ease;
        }

        .social-icon:hover {
          background: #2e7d6b;
          color: white;
          border-color: #2e7d6b;
        }

        .footer-bottom {
          background: #ffffff;
          border-top: 1px solid #eaeaea;
          font-size: 14px;
          color: #666;
        }


        .social-icon {
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #FFDBFD;        /* very light pastel */
        border: 1px solid #f6f6ff;  /* primary color */
        color: #515155;  
        font-size: 16px;
        transition: 0.3s ease;
      }

      .social-icon:hover {
        background: #6367FF;;
        color: white;
        border-color: #2e7d6b;
      }

      `}</style>
    </>
  );
}

export default Footer;