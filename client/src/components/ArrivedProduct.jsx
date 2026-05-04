import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { Link, useNavigate } from "react-router-dom";



function ArrivedProduct() {
  const [products, setProducts] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    // fetch most recent items from backend (limit to 4 for the carousel)
    fetch("https://thriftify-j4ll.onrender.com/api/products?limit=4")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const handleViewProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <section
      style={{
        background: "#FFDBFD",
        padding: "70px 0",
      }}
    >
      <div className="container">

        {/* Section Header */}
        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap">
          <div>
            <h2
              style={{
                fontWeight: "700",
                color: "#6367FF",
              }}
            >
              Newly Added Items
            </h2>
            <p style={{ color: "#666", marginBottom: "0" }}>
              Discover our latest premium arrivals
            </p>
          </div>

          <Link
            to="/products"
            style={{
              textDecoration: "none",
              fontWeight: "600",
              color: "#6367FF",
            }}
          >
            View All →
          </Link>
        </div>

        {/* Swiper */}
        <div style={{ position: "relative", padding: "0 60px" }}>

  {/* Custom Navigation Buttons */}
  <button className="custom-prev nav-btn">
    ❮
  </button>

  <button className="custom-next nav-btn">
    ❯
  </button>

      <Swiper
              modules={[Navigation, Autoplay]}
        spaceBetween={25}
        slidesPerView={3}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        >
          {products.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "20px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                  transition: "0.3s ease",
                  cursor: "pointer",
                }}
                className="product-card"
              >
                <div className="row align-items-center">
                  <div className="col-4">
                    <img
                      src={item.image || item.img}
                      alt={item.title}
                      style={{
                        width: "100%",
                        borderRadius: "15px",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div className="col-8">
                    <p
                      style={{
                        color: "#8494FF",
                        fontSize: "14px",
                        marginBottom: "5px",
                      }}
                    >
                      {item.seller?.firstName || "Unknown"}
                    </p>

                    <h6
                      style={{
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      {item.title}
                    </h6>

                    <button
                      style={{
                        background: "#6367FF",
                        border: "none",
                        padding: "6px 15px",
                        borderRadius: "20px",
                        color: "white",
                        fontSize: "13px",
                        marginTop: "10px",
                        transition: "0.3s",
                      }}
                      onClick={() => handleViewProduct(item._id)}
                    >
                      View Product
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </div>

      {/* Hover Effect Styling */}
      <style>
        {`
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(99,103,255,0.2);
        }
        `}
      </style>
    </section>

    
  );
}

export default ArrivedProduct;
