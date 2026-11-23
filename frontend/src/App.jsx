import { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryFilter from "./components/CategoryFilter";
import ProductList from "./components/ProductList";
import Login from "./pages/login-tmp";
import Register from "./pages/register-tmp";
import api from "./api";

const animalOptions = [
  { id: "all", label: "All pets", icon: "🐾" },
  { id: "dog", label: "Dogs", icon: "🐶" },
  { id: "cat", label: "Cats", icon: "🐱" },
  { id: "bird", label: "Birds", icon: "🐦" },
  { id: "rabbit", label: "Rabbits", icon: "🐰" },
  { id: "fish", label: "Fish", icon: "🐟" },
  { id: "small", label: "Others", icon: "🐹" },
];

const typeOptions = [
  { id: "all", label: "All types", icon: "✨" },
  { id: "food", label: "Food", icon: "🍖" },
  { id: "toys", label: "Toys", icon: "🧸" },
  { id: "accessory", label: "Accessories", icon: "🎀" },
  { id: "equipment", label: "Equipment", icon: "🏠" },
  { id: "care", label: "Care & health", icon: "💊" },
];

function App() {
  const [products, setProducts] = useState([]);

  const [selectedAnimal, setSelectedAnimal] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from MongoDB through the backend
  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reach the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchAnimal =
      selectedAnimal === "all" || product.animal === selectedAnimal;

    const matchType = selectedType === "all" || product.type === selectedType;

    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchAnimal && matchType && matchSearch;
  });

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />

              <div className="toolbar">
                <div className="search">
                  <span>🔍</span>
                  <input
                    type="text"
                    placeholder="Search food, toys, cages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <CategoryFilter
                  options={animalOptions}
                  selected={selectedAnimal}
                  onSelect={setSelectedAnimal}
                />

                <CategoryFilter
                  className="types"
                  options={typeOptions}
                  selected={selectedType}
                  onSelect={setSelectedType}
                />
              </div>

              <main id="products" className="products">
                <h2 className="section-title">Our products</h2>

                {loading && <p>Loading products...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && products.length === 0 && (
                  <p>No products available yet.</p>
                )}

                {!loading && !error && products.length > 0 && (
                  <ProductList products={filteredProducts} />
                )}
              </main>
            </>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
