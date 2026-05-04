import React from "react";

function Offers() {
  return (
    <>
      <section className="offers-section py-5">
        <div className="container-fluid">
          <div className="row g-4">

            {/* Card 1 */}
            <div className="col-md-6">
              <div className="banner-ad custom-card bg-danger">
                <div className="row align-items-center h-100">
                  
                  <div className="col-7">
                    <div className="banner-content p-4">
                      <div className="categories text-primary fs-5 fw-bold">
                        Upto 25% Off
                      </div>
                      <h3 className="banner-title">Luxa Dark Chocolate</h3>
                      <p>Very tasty & creamy vanilla flavour creamy muffins.</p>
                      <a href="#" className="btn btn-dark text-uppercase">
                        Shop Now
                      </a>
                    </div>
                  </div>

                  <div className="col-5 text-end">
                    <img
                      src="images/ad-image-3.png"
                      alt="Chocolate"
                      className="offer-img"
                    />
                  </div>

                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-md-6">
              <div className="banner-ad custom-card bg-info">
                <div className="row align-items-center h-100">

                  <div className="col-7">
                    <div className="banner-content p-4">
                      <div className="categories text-primary fs-5 fw-bold">
                        Upto 25% Off
                      </div>
                      <h3 className="banner-title">Creamy Muffins</h3>
                      <p>Very tasty & creamy vanilla flavour creamy muffins.</p>
                      <a href="#" className="btn btn-dark text-uppercase">
                        Shop Now
                      </a>
                    </div>
                  </div>

                  <div className="col-5 text-end">
                    <img
                      src="images/ad-image-4.png"
                      alt="Muffins"
                      className="offer-img"
                    />
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>{`

        .offers-section {
          background: #ffffff;
        }

        .custom-card {
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.35s ease;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          padding: 15px;
          min-height: 220px;
        }

        /* lighter tint version of original colors */
        .bg-danger.custom-card {
          background-color: rgba(220, 53, 69, 0.12) !important;
        }

        .bg-info.custom-card {
          background-color: rgba(13, 202, 240, 0.12) !important;
        }

        .custom-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 18px 40px rgba(0,0,0,0.15);
        }

        .offer-img {
          max-width: 100%;
          height: auto;
          transition: 0.3s ease;
        }

        .custom-card:hover .offer-img {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .offer-img {
            margin-top: 20px;
          }
        }

      `}</style>
    </>
  );
}

export default Offers;