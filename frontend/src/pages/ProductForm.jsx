import { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api";

const emptyForm = {
  name: "",
  animal: "dog",
  type: "food",
  price: "",
  image: "",
  description: "",
  stock: "",
};

function ProductForm({ onSaved }) {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEdit);

  // Edit mode: load the existing product into the form
  useEffect(() => {
    if (!isEdit) return;

    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setForm({
          name: data.name ?? "",
          animal: data.animal ?? "dog",
          type: data.type ?? "food",
          price: data.price ?? "",
          image: data.image ?? "",
          description: data.description ?? "",
          stock: data.stock ?? "",
        });
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Unable to load the product.");
      })
      .finally(() => setLoadingProduct(false));
  }, [id, isEdit]);

  // Only logged-in users can use this page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }

      await onSaved?.();
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reach the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return <p className="product-form-page">Loading product...</p>;
  }

  return (
    <div className="product-form-page">
      <h2>{isEdit ? "Edit product" : "Add a product"}</h2>

      <form className="product-form" onSubmit={handleSubmit}>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Animal
          <select name="animal" value={form.animal} onChange={handleChange}>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="rabbit">Rabbit</option>
            <option value="fish">Fish</option>
            <option value="small">Others</option>
          </select>
        </label>

        <label>
          Type
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="food">Food</option>
            <option value="toys">Toys</option>
            <option value="accessory">Accessory</option>
            <option value="equipment">Equipment</option>
            <option value="care">Care & health</option>
          </select>
        </label>

        <label>
          Price (DA)
          <input
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Stock
          <input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Image path
          <input
            name="image"
            placeholder="/images/dog-leash.jpg"
            value={form.image}
            onChange={handleChange}
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <div className="form-actions">
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Save changes" : "Add product"}
          </button>
          <button type="button" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;