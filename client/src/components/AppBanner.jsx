import React from "react";

function AppBanner() {
  return (
    <>
      <section className="app-section py-5 my-5">
        <div className="container position-relative">

          {/* Yellow Box */}
          <div className="app-banner rounded-5">
            <div className="row align-items-center">

              {/* Empty column for spacing phone */}
              <div className="col-md-4"></div>

              {/* TEXT CONTENT */}
              <div className="col-md-8 text-content">
                <h2 className="mb-4">Shop faster with Foodmart App</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sagittis sed ptibus liberolectus nonet psryroin. Amet sed
                  lorem posuere sit iaculis amet.
                </p>

                <div className="d-flex gap-3 flex-wrap mt-4">
                  <img
                    src="images/app-store.jpg"
                    alt="app-store"
                    className="store-img"
                  />
                  <img
                    src="images/google-play.jpg"
                    alt="google-play"
                    className="store-img"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Floating Phone Image */}
          <div className="phone-wrapper">
            <img
              src="images/phone.png"
              alt="phone"
              className="img-fluid phone-img"
            />
          </div>

        </div>
      </section>

      <style>{`

        .app-section {
          background: #ffffff;
        }

        .app-banner {
          background: #fcecbf; /* same yellow */
          padding: 0px 0px;
          position: relative;
          overflow: visible;
          background-image: url("images/bg-pattern-2.png");
          background-repeat: no-repeat;
          background-position: right center;
         
        }

        .text-content {
          padding-right: 40px;
          margin-top: 100px;
          margin-bottom: 100px;
        }

        /* PHONE FLOATING OUTSIDE */
        .phone-wrapper {
          position: absolute;
          left: 0;
          top: -60px;
          bottom: -60px;
          left: 60px;
          display: flex;
          align-items: center;
        }

        .phone-img {
          max-height: 550px;
          object-fit: contain;
        }

        /* STORE BUTTON ROUNDED */
        .store-img {
          border-radius: 15px;
          height: 55px;
          transition: 0.3s ease;
        }

        .store-img:hover {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {

          .phone-wrapper {
            position: relative;
            top: 0;
            bottom: 0;
            justify-content: center;
            margin-bottom: 30px;
          }

          .app-banner {
            padding: 60px 25px;
          }

        }

      `}</style>
    </>
  );
}

export default AppBanner;