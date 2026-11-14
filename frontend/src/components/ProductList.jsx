import ProductCard from "./ProductCard";

function ProductList({ products, onChanged }) {
  if (products.length === 0) {
    return <p className="empty">No products found. Try another search 🐾</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onChanged={onChanged}
        />
      ))}
    </div>
  );
}

export default ProductList;
