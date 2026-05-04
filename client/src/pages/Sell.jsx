import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sell() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    category: "men",
    originalPrice: "",
    sellingPrice: "",
    details: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to sell a product.");
      return;
    }

    if (!form.title.trim() || !form.sellingPrice || !form.originalPrice || !selectedFile) {
      alert("Please fill title, prices and upload an image.");
      return;
    }

    try {
      // First, upload image to Cloudinary
      if (!selectedFile) {
        alert("Please select an image.");
        return;
      }

      // Get signature from backend
      const sigRes = await fetch("http://localhost:4000/api/products/upload-signature");
      const sigData = await sigRes.json();

      // Prepare form data for Cloudinary upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('api_key', sigData.api_key);
      formData.append('timestamp', sigData.timestamp);
      formData.append('signature', sigData.signature);
      formData.append('folder', 'products');

      // Upload to Cloudinary
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloud_name}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error.message);
      }

      const imageUrl = uploadData.secure_url;

      // Now, create product with the image URL
      const payload = { ...form, image: imageUrl };
      const res = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Could not create product");
      } else {
        alert("Product created!");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting product: " + err.message);
    }
  };

  return (
    <>
    <div className="max-w-2xl mx-auto p-6 bg-white/5 rounded-2xl mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-black">Sell a Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-#8494FF">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded px-3 py-2 text-gray-500"
            required
          />
        </div>

        <div>
          <label className="block text-#8494FF">Short description</label>
          <textarea
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            className="w-full rounded px-3 py-2 text-gray-500"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-#8494FF">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded px-3 py-2 text-gray-500"
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-#8494FF">Original price</label>
            <input
              type="number"
              name="originalPrice"
              value={form.originalPrice}
              onChange={handleChange}
              className="w-full rounded px-3 py-2 text-gray-500"
              min="0"
            />
          </div>
          <div>
            <label className="block text-#8494FF">Selling price</label>
            <input
              type="number"
              name="sellingPrice"
              value={form.sellingPrice}
              onChange={handleChange}
              className="w-full rounded px-3 py-2 text-black"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-#8494FF">Condition</label>
          <select
            name="details"
            value={form.details}
            onChange={handleChange}
            className="w-full rounded px-3 py-2 text-gray-500"
          >
            <option value="">Select condition</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Acceptable">Acceptable</option>
            <option value="Needs Repair">Needs Repair</option>
          </select>
        </div>

        <div>
          <label className="block text-#8494FF">Image&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          <input type="file" accept="image/*" onChange={handleFile} />
          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="mt-2 h-32 object-contain"
            />
          )}
        </div>

        <button
          type="submit"
          className="submit-button bg-indigo-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>


             </>


  );
}

export default Sell;
