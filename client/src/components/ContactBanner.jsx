import React from "react";

function ContactBanner() {
  return (
    <>
      <section className="contact-section py-5">
        <div className="container-fluid">
          <div className="contact-wrapper rounded-5">
            <div className="container">
              <div className="row align-items-center">

                {/* LEFT SIDE */}
                <div className="col-md-6 p-5">
                  <h2 className="display-5 fw-bold">
                    Get <span className="highlight">25% Discount</span> on your
                    first purchase
                  </h2>
                  <p className="mt-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Dictumst amet, metus, sit massa posuere maecenas.
                  </p>
                </div>

                {/* RIGHT SIDE FORM */}
                <div className="col-md-6 p-5">
                  <form className="contact-form">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Name"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="abc@mail.com"
                      />
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="subscribe"
                      />
                      <label className="form-check-label" htmlFor="subscribe">
                        Subscribe to newsletter
                      </label>
                    </div>

                    <button type="submit" className="btn submit-btn w-100">
                      Submit
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`

        .contact-section {
          background: #ffffff;
        }

        /* VERY LIGHT GREEN BACKGROUND */
        .contact-wrapper {
          background: #c4e8db;   /* very soft green */
          padding: 70px 0;
          box-shadow: 0 15px 40px rgba(0,0,0,0.08); /* neutral shadow */
          transition: 0.3s ease;
        }

        .highlight {
          color: #6367FF;
        }

        /* FORM CARD */
        .contact-form {
          background: #ffffff;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06); /* neutral shadow */
        }

        .form-control {
          border-radius: 12px;
          border: 1px solid #d7f3e8;
        }

        .form-control:focus {
          border-color: #429c7f;
          box-shadow: 0 0 0 0.2rem rgba(111, 211, 180, 0.2);
        }

        .submit-btn {
          background: #8494FF;
          color: white;
          border-radius: 30px;
          padding: 12px;
          font-weight: 600;
          transition: 0.3s ease;
        }

        .submit-btn:hover {
          background: #6367FF;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .contact-wrapper {
            padding: 40px 0;
          }
        }

      `}</style>
    </>
  );
}

export default ContactBanner;