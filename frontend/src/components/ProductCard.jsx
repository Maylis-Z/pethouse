import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import api from "../api";

const placeholders = {
  dog: "🐶",
  cat: "🐱",
  bird: "🐦",
  rabbit: "🐰",
  fish: "🐟",
};

function ProductCard({ product, onChanged }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [imgFailed, setImgFailed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!showMessage) return;

    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [showMessage]);

  const handleBuy = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/" } });
      return;
    }

    dispatch(addToCart(product));
    setShowMessage(true);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;

    try {
      await api.delete(`/products/${product._id}`);
      onChanged?.();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete the product.");
    }
  };

  return (
    <article className="card">
      <div className="card-img">
        <span className="badge">{product.type}</span>

        {imgFailed || !product.image ? (
          <span className="card-placeholder">
            {placeholders[product.animal] || "🐾"}
          </span>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgFailed(true)}
          />
        )}
      </div>

      <div className="card-body">
        <h3>{product.name}</h3>

        <p className="description">{product.description}</p>

        <div className="card-footer">
          <span className="price">
            {Number(product.price).toLocaleString("fr-DZ")} DA
          </span>

          <button className="add-btn" onClick={handleBuy}>
            {isAuthenticated ? "Add +" : "buy"}
          </button>
        </div>

        {isAuthenticated && (
          <div className="card-admin">
            <button onClick={() => navigate(`/products/${product._id}/edit`)}>
              Edit
            </button>
            <button className="danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}

        {showMessage && <p className="added-message">✓ Added to cart!</p>}
      </div>
    </article>
  );
}

export default ProductCard;
