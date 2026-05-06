import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
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

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch existing product data
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://thriftify-j4ll.onrender.com/api/products`);
        const data = await res.json();
        const product = data.find(p => p._id === id);

        if (!product) {
          alert("Product not found");
          navigate('/dashboard');
          return;
        }

        // Check if user owns this product
        if (product.seller?._id !== user._id && product.seller !== user._id) {
          alert("You don't have permission to edit this product");
          navigate('/dashboard');
          return;
        }

        setForm({
          title: product.title || "",
          shortDescription: product.shortDescription || "",
          category: product.category || "men",
          originalPrice: product.originalPrice || "",
          sellingPrice: product.sellingPrice || "",
          details: product.details || "",
          image: product.image || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Error loading product");
        navigate('/dashboard');
      }
    };

    if (user && id) {
      fetchProduct();
    }
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
    setSaving(true);

    try {
      let imageUrl = form.image;

      // Upload new image if selected
      if (selectedFile) {
        // Get signature from backend
        const sigRes = await fetch("https://thriftify-j4ll.onrender.com/api/products/upload-signature");
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

        imageUrl = uploadData.secure_url;
      }

      // Update product
      const payload = { ...form, image: imageUrl };
      const res = await fetch(`https://thriftify-j4ll.onrender.com/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Could not update product");
      } else {
        alert("Product updated successfully!");
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert("Error updating product: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-10">
        <div className="text-center">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/5 rounded-2xl mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-black">Edit Product</h2>
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

        <div className="flex gap-4">
          <button
            type="submit"
            className="submit-button bg-indigo-500 text-white px-4 py-2 rounded"
            disabled={saving}
          >
            {saving ? 'Updating...' : 'Update Product'}
          </button>
          <button
            type="button"
            className="cancel-button bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
